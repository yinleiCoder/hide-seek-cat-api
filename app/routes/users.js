/**
 * 用户路由.
 * @author yinlei
 */
const Router = require('koa-router');
const router = new Router({ prefix: '/users' });
const jwt = require('koa-jwt');
const { 
    find, 
    findById, 
    create, 
    update, 
    delete: del, 
    login, 
    checkOwner, 
    listFollowing, 
    checkUserExist,
    follow, 
    unfollow, 
    listFollowers,
    followTopic,
    unfollowTopic, 
    listFollowingTopics,
    listPosts,
} = require('../controllers/users');

const {
    checkTopicExist,
} = require('../controllers/topics');

/// 认证jwt
const { secret } = require('../config');
const auth = jwt({ secret });

router.get('/',find);
router.post('/', create);
router.get('/:id',findById);
router.patch('/:id', auth, checkOwner, update);
router.delete('/:id', auth, checkOwner, del);

router.post('/login', login);

router.get('/:id/following', listFollowing);
router.get('/:id/followers', listFollowers);

router.put('/following/:id', auth, checkUserExist, follow);
router.delete('/following/:id', auth, checkUserExist, unfollow);

router.get('/:id/followingTopics', listFollowingTopics);
router.put('/followingTopics/:id', auth, checkTopicExist, followTopic);
router.delete('/followingTopics/:id', auth, checkTopicExist,unfollowTopic);

router.get('/:id/posts', listPosts);


module.exports = router;