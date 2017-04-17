/**
 * Created by jack on 16/11/3.
 */

var router = require('koa-router')();
const session = require('../db');

router.get('/',function *(next) {
    yield this.render('email');
});

router.get('/data',function *(next) {

    let query = this.query;
    let email = query.email;
    let action = query.action;
    let page = parseInt(query.page || 0);
    let search = `MATCH p=()-[r:POP3]->(s) where s.address = "${email}" and r.action = "${action}" `;

    if(query['date[]'] && query['date[]'].length>0){
        let begin = query['date[]'][0],
            end = query['date[]'][1];
        search += ` and r.timestamp >= "${begin}" and r.timestamp <= "${end}" `;
    }
    let count = yield session.db46.run(search + 'return count(*) as count');
    search += 'return p   order by r.timestamp DESC';
    let data = yield session.db46.run( search + " SKIP {page} LIMIT 20 ", {page:parseInt((page-1)*20)});
    this.body = {total:count,data:data.records || []};
});

router.get('/:address/:type/:page', function *(next) {
    let start = new Date().getTime();
    let address = this.params.address;
    let page = this.params.page;
    let type = this.params.type;
    let query = this.query;

    if(type == 'send'){
        let search = "MATCH (n)-[r:SEND]-(t:Emessage) Where n.address = {address} WITH t MATCH (t)-[r:RECEIVE]-(w) WITH t.messageid as Id,w.address as Address,r as Ship ";

        if(query['date[]'] && query['date[]'].length>0){
            let begin = query['date[]'][0],
                end = query['date[]'][1];
            search += ` where Ship.sendTime >= "${begin}" and Ship.sendTime <= "${end}" `;
        }

        let send = yield session.db47.run(search + " return Id,Address,Ship order by Ship.sendTime DESC SKIP {page} LIMIT 20 ", {address:address,page:parseInt(page-1)*20});
        let count = yield session.db47.run( search +" return count(*) as total",{address:address});
        this.body = {data:send.records,total:count}
    }else{
        let search = "MATCH (n)-[r:RECEIVE]-(t:Emessage) Where n.address = {address} WITH t MATCH (t)-[r:SEND]-(w) WITH t.messageid as Id,w.address as Address,r as Ship ";

        if(query['date[]'] && query['date[]'].length>0){
            let begin = query['date[]'][0],
                end = query['date[]'][1];
            search += ` where Ship.sendTime >= "${begin}" and Ship.sendTime <= "${end}" `;
        }

        let receive = yield session.db47.run(search + "return Id,Address,Ship order by Ship.sendTime DESC  SKIP {page} LIMIT 20", {address:address,page:parseInt(page-1)*20})
        let count = yield session.db47.run( search +" return count(*) as total",{address:address});
        this.body = {data:receive.records,total:count}
    }

    if(address){

    }else{
        this.body = [];
    }
});

function trans(data) {
    for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        obj['_fields'][2].properties.sendTimeStamp = tranTime(obj['_fields'][2].properties.sendTime);
        if(obj['_fields'][2].properties.receiveTime){
            obj['_fields'][2].properties.receiveTimeStamp = tranTime(obj['_fields'][2].properties.receiveTime);
        }
    }

    data.sort(function (a,b) {
        return - a['_fields'][2].properties.sendTimeStamp + b['_fields'][2].properties.sendTimeStamp;
    });

    return data;
}


function tranTime(time) {
    var tstr = time.replace('  ',' ');
    tstr = tstr.split(' ');
    if(tstr.length == 3){
        tstr.splice(2,0,2016);
        return Date.parse(new Date(tstr.join(' ')));
    }else{
        return Date.parse(time);
    }
}

module.exports = router;
