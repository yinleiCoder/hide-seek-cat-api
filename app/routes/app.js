/**
 * 躲猫猫APP管理路由
 * @author yinlei
 */
const Router = require('koa-router');
const router  =new Router({ prefix: '/app' });
const { 
    appUpdate,
} = require('../controllers/app');

router.post('/update', appUpdate);

module.exports = router;
