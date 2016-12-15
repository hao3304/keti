/**
 * Created by jack on 16/11/3.
 */

var router = require('koa-router')();
const session = require('../db');

router.get('/',function *(next) {
    yield this.render('email');
})

router.get('/:address', function *(next) {
    var start = new Date().getTime();
    var address = this.params.address;
    if(address){
        var send = yield session.run("MATCH (n)-[r:SEND]-(t:Emessage) Where n.address = {address} WITH t MATCH (t)-[r:RECEIVE]-(w) return t.messageid as Id,w.address as Address,r as Ship", {address:address})
        var receive = yield session.run("MATCH (n)-[r:RECEIVE]-(t:Emessage) Where n.address = {address} WITH t MATCH (t)-[r:SEND]-(w) return t.messageid as Id,w.address as Address,r as Ship", {address:address})
        var end = new Date().getTime();
        this.body = {send:trans(send.records),receive:trans(receive.records),time:end - start}
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
