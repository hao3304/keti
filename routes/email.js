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
        this.body = {send:send.records,receive:receive.records,time:end - start}
    }else{
        this.body = [];
    }
});

module.exports = router;
