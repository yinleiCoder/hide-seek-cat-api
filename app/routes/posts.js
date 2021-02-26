/**
 * 帖子路由.
 * @author yinlei
 */
const Router = require('koa-router');
const router = new Router({ prefix: '/posts' });
const jwt = require('koa-jwt');
const { 
    find, 
    findById, 
    create, 
    update, 
    delete: del,
    checkPostExist,
    checkPoster,
} = require('../controllers/posts');

/// 认证jwt
const { secret } = require('../config');
const auth = jwt({ secret });

router.get('/', find);
router.post('/', auth, create);
router.get('/:id', checkPostExist, findById);
router.patch('/:id', auth, checkPostExist, checkPoster, update);
router.delete('/:id', auth, checkPostExist, checkPoster, del);

module.exports = router;