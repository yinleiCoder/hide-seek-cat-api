/**
 * 站酷图集路由.
 * @author yinlei
 */
const Router = require('koa-router');
const router = new Router({ prefix: '/zcool' });
const jwt = require('koa-jwt');
const { 
    findZcool, 
    findZcoolDetail, 
} = require('../controllers/zcool');

/// 认证jwt
const { secret } = require('../config');
const auth = jwt({ secret });

router.get('/findZcool', findZcool);
router.get('/findZcoolDetail', findZcoolDetail);

module.exports = router;