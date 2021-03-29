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
    listLikingAnswers,
    listDisLikingAnswers,
    likeAnswer,
    dislikeAnswer,
    unlikeAnswer,
    undislikeAnswer,
    listCollectingAnswers,
    collectAnswer,
    uncollectAnswer,
    addFriend,
    agreeFriendReq,
    listMyFriends,
    listMyFriendsAndMessages,
    sendOneMessage,
    listMessagesWithSomeone,
} = require('../controllers/users');

const {
    checkTopicExist,
} = require('../controllers/topics');
const {
    checkanswerExist,
} = require('../controllers/answers');

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

router.get('/:id/likingAnswers', listLikingAnswers);
router.put('/likingAnswers/:id', auth, checkanswerExist, likeAnswer, undislikeAnswer);
router.delete('/likingAnswers/:id', auth, checkanswerExist,unlikeAnswer);
router.get('/:id/dislikingAnswers', listDisLikingAnswers);
router.put('/dislikingAnswers/:id', auth, checkanswerExist, dislikeAnswer, unlikeAnswer);
router.delete('/dislikingAnswers/:id', auth, checkanswerExist,undislikeAnswer);

router.get('/:id/collectingAnswers', listCollectingAnswers);
router.put('/collectingAnswers/:id', auth, checkanswerExist, collectAnswer);
router.delete('/collectingAnswers/:id', auth, uncollectAnswer);

router.get('/:id/allFriends',listMyFriends);
router.get('/:id/allfriendsandmessages', listMyFriendsAndMessages);
router.get('/:id/allmessageswithSomeone/:fid', listMessagesWithSomeone);
router.post('/addFriend/:id', auth, addFriend);
router.post('/sendOneMessage/:id', auth, sendOneMessage);
router.put('/agreeFriendReq/:id', auth, agreeFriendReq);

module.exports = router;