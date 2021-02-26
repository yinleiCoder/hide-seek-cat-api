/**
 * 回答帖子路由.
 * @author yinlei
 */
const Router = require('koa-router');
const router = new Router({ prefix: '/posts/:postId/answers' });
const jwt = require('koa-jwt');
const { 
    find, 
    findById, 
    create, 
    update, 
    delete: del,
    checkanswerExist,
    checkanswerer,
} = require('../controllers/answers');

/// 认证jwt
const { secret } = require('../config');
const auth = jwt({ secret });

router.get('/', find);
router.post('/', auth, create);
router.get('/:id', checkanswerExist, findById);
router.patch('/:id', auth, checkanswerExist, checkanswerer, update);
router.delete('/:id', auth, checkanswerExist, checkanswerer, del);

module.exports = router;