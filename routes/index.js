var router = require('koa-router')();
const session = require('../db');

router.get('/', function *(next) {

  yield this.render('index', {
    title: 'Hello World Koa!'
  });
});

;


module.exports = router;
