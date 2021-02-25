/**
 * 用户路由.
 * @author yinlei
 */
const Router = require('koa-router');
const router = new Router({ prefix: '/users' });
const jwt = require('koa-jwt');
const { find, findById, create, update, delete: del, login, checkOwner } = require('../controllers/users');

/// 认证jwt
const { secret } = require('../config');
const auth = jwt({ secret });

router.get('/',find);

router.post('/', create);

router.get('/:id',findById);

router.patch('/:id', auth, checkOwner, update);

router.delete('/:id', auth, checkOwner, del);

router.post('/login', login);

module.exports = router;