/**
 * 评论帖子路由.
 * @author yinlei
 */
const Router = require('koa-router');
const router = new Router({ prefix: '/posts/:postId/answers/:answerId/comments' });
const jwt = require('koa-jwt');
const { 
    find, 
    findById, 
    create, 
    update, 
    delete: del,
    checkcommentExist,
    checkcommentator,
} = require('../controllers/comments');

/// 认证jwt
const { secret } = require('../config');
const auth = jwt({ secret });

router.get('/', find);
router.post('/', auth, create);
router.get('/:id', checkcommentExist, findById);
router.patch('/:id', auth, checkcommentExist, checkcommentator, update);
router.delete('/:id', auth, checkcommentExist, checkcommentator, del);

module.exports = router;