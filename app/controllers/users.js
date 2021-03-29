/**
 * Users 控制器
 * @author yinlei
 */
/// user model.
const User = require('../models/users');
/// friend model.
const Friend = require('../models/friends');
/// post model.
const Post = require('../models/posts');
/// answer model.
const Answer = require('../models/answers');
/// message model.
const Message = require('../models/messages');

/// json web token.
const jsonwebtoken = require('jsonwebtoken');
const { secret } = require('../config');

class UsersController {

    /// 分页
    async find(ctx) {
        const { per_page = 10 } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_page * 1, 1);
        ctx.body = await User
            .find({name: new RegExp(ctx.query.q)})
            .limit(perPage).skip(page * perPage);
    }

    async findById(ctx) {
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const populateStr = fields.split(';').filter(f => f).map(f => {
            if(f === 'employments'){
                return 'employments.company employments.job';
            }
            if(f === 'educations') {
                return 'educations.school educations.major';
            }
            return f;
        }).join(' ');
        const user = await User.findById(ctx.params.id).select(selectFields).populate(populateStr);
        if(!user) {
            ctx.throw(404, '用户不存在');
        }
        ctx.body = user;
    }

    async create(ctx) {
        ctx.verifyParams({
            name: {type: 'string'},
            password: {type: 'string'},
        });
        const { name, password } = ctx.request.body;
        const repeatedUser = await User.findOne({ name });
        if(repeatedUser){
            ctx.throw(409, '用户已经存在');
        }
        const user = await new User({name, password}).save();
        ctx.body = user;
    }

    /// 授权: 保证操作者是其自己,不能删除别人的
    async checkOwner(ctx, next) {
        /// koa-jwt 中间件将jsonwebtoken.verify结果挂载到了ctx.state下
        if(ctx.params.id !== ctx.state.user._id) {
            ctx.throw(403, '未授权');
        }
        await next();
    }

    async update(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: false},
            password: {type: 'string', required: false},
            avatar_url: { type: 'string', required: false},
            gender: { type: 'string', required: false},
            headline: { type: 'string', required: false},
            locations: { type: 'array', itemType: 'string', required: false},
            business: { type: 'string', required: false},
            employments: { type: 'array', itemType: 'object', required: false},
            educations: { type: 'array', itemType: 'object', required: false},
        });
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if(!user) {
            ctx.throw(404, '用户不存在');
        }
        ctx.body = user;
    }

    async delete(ctx) {
        const user = await User.findByIdAndRemove(ctx.params.id);
        if(!user) {
            ctx.throw(404, '用户不存在');
        }
        ctx.status = 204;
    }

    async login(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: true},
            password: {type: 'string', required: true},
        });
        const user = await User.findOne(ctx.request.body);
        if(!user){
            ctx.throw(401, '用户名或密码不正确');
        }
        /// 生成token.
        const { _id, name } = user;
        const token = jsonwebtoken.sign({ _id, name }, secret, {
            expiresIn: '1d'
        });
        ctx.body = { token, uid: _id};
    }

    /// 获取自己的粉丝
    async listFollowers(ctx) {
        const users = await User.find({following: ctx.params.id});
        ctx.body = users;
    }

    /// 获取自己关注人列表
    async listFollowing(ctx) {
        const user = await User.findById(ctx.params.id).select('+following').populate('following');
        if(!user){
            ctx.throw(404, '未关注任何人');
        }
        ctx.body = user.following;
    }

    /// 检验用户存在与否 中间件
    async checkUserExist(ctx, next) {
        const user = await User.findById(ctx.params.id);
        if(!user){
            ctx.throw(404, '该用户不存在');
        }
        await next();
    }

    async follow(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following');
        if(!me.following.map(id => id.toString()).includes(ctx.params.id)){
            me.following.push(ctx.params.id);
            me.save();
        }
        ctx.status = 204;
    }

    async unfollow(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following');
        const index = me.following.map(id => id.toString()).indexOf(ctx.params.id);
        if(index > -1){
            me.following.splice(index, 1);
            me.save();
        }
        ctx.status = 204;
    }

    /// 获取关注话题列表
    async listFollowingTopics(ctx) {
        const user = await User.findById(ctx.params.id).select('+followingTopics').populate('followingTopics');
        if(!user){
            ctx.throw(404, '用户不存在');
        }
        ctx.body = user.followingTopics;
    }

    async followTopic(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+followingTopics');
        if(!me.followingTopics.map(id => id.toString()).includes(ctx.params.id)){
            me.followingTopics.push(ctx.params.id);
            me.save();
        }
        ctx.status = 204;
    }

    async unfollowTopic(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+followingTopics');
        const index = me.followingTopics.map(id => id.toString()).indexOf(ctx.params.id);
        if(index > -1){
            me.followingTopics.splice(index, 1);
            me.save();
        }
        ctx.status = 204;
    }

    /// 帖子列表
    async listPosts(ctx) {
        const posts = await Post.find({poster: ctx.params.id});
        if(!posts){
            ctx.throw(404, '该用户未发表帖子');
        }
        ctx.body = posts;
    }

    /// 获取某话题下的👍过的答案列表
    async listLikingAnswers(ctx) {
        const user = await User.findById(ctx.params.id).select('+likingAnswers').populate('likingAnswers');
        if(!user){
            ctx.throw(404, '用户不存在');
        }
        ctx.body = user.likingAnswers;
    }

    async likeAnswer(ctx, next) {
        const me = await User.findById(ctx.state.user._id).select('+likingAnswers');
        if(!me.likingAnswers.map(id => id.toString()).includes(ctx.params.id)){
            me.likingAnswers.push(ctx.params.id);
            me.save();
            await Answer.findByIdAndUpdate(ctx.params.id, {$inc: {voteCount: 1}});
        }
        ctx.status = 204;
        await next();
    }

    async unlikeAnswer(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+likingAnswers');
        const index = me.likingAnswers.map(id => id.toString()).indexOf(ctx.params.id);
        if(index > -1){
            me.likingAnswers.splice(index, 1);
            me.save();
            await Answer.findByIdAndUpdate(ctx.params.id, {$inc: {voteCount: -1}});
        }
        ctx.status = 204;
    }
    
    /// 获取某话题下的👎过的答案列表
    async listDisLikingAnswers(ctx) {
        const user = await User.findById(ctx.params.id).select('+dislikingAnswers').populate('dislikingAnswers');
        if(!user){
            ctx.throw(404, '用户不存在');
        }
        ctx.body = user.dislikingAnswers;
    }

    async dislikeAnswer(ctx, next) {
        const me = await User.findById(ctx.state.user._id).select('+dislikingAnswers');
        if(!me.dislikingAnswers.map(id => id.toString()).includes(ctx.params.id)){
            me.dislikingAnswers.push(ctx.params.id);
            me.save();
        }
        ctx.status = 204;
        await next();
    }

    async undislikeAnswer(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+dislikingAnswers');
        const index = me.dislikingAnswers.map(id => id.toString()).indexOf(ctx.params.id);
        if(index > -1){
            me.dislikingAnswers.splice(index, 1);
            me.save();
        }
        ctx.status = 204;
    }

    /// 获取收藏的答案列表
    async listCollectingAnswers(ctx) {
        const user = await User.findById(ctx.params.id).select('+collectingAnswers').populate('collectingAnswers');
        if(!user){
            ctx.throw(404, '用户不存在');
        }
        ctx.body = user.collectingAnswers;
    }

    async collectAnswer(ctx, next) {
        const me = await User.findById(ctx.state.user._id).select('+collectingAnswers');
        if(!me.collectingAnswers.map(id => id.toString()).includes(ctx.params.id)){
            me.collectingAnswers.push(ctx.params.id);
            me.save();
        }
        ctx.status = 204;
        await next();
    }

    async uncollectAnswer(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+collectingAnswers');
        const index = me.collectingAnswers.map(id => id.toString()).indexOf(ctx.params.id);
        if(index > -1){
            me.collectingAnswers.splice(index, 1);
            me.save();
        }
        ctx.status = 204;
    }

    /// 添加对方为好友
    async addFriend(ctx) {
        const result = await Friend.findOne({
            uid: ctx.state.user._id,
        });
        if(result && result.state == 2) {
            ctx.throw(409, '已申请对方为好友，重复申请无效');
        }
        await Friend.insertMany([
            {
                uid: ctx.state.user._id,
                fid: ctx.params.id,
                state: 2,
            },
            {
                uid: ctx.params.id,
                fid: ctx.state.user._id,
                state: 1,
            }
        ]);
        ctx.status = 204;
    }

    /// 同意申请
    async agreeFriendReq(ctx) {
        await Friend.updateMany({
            $or: [
                {uid: ctx.state.user._id,fid: ctx.params.id,},
                {uid: ctx.params.id,fid: ctx.state.user._id,},
            ]
        }, {
            $set: {
                state: 0,
            }
        });
        
        await Message.insertMany([
            {
                from: ctx.state.user._id,
                to: ctx.params.id,
                content: '我们已经成为好友啦！',
                type: 0,
                state: 1,
            },
            {
                from: ctx.params.id,
                to: ctx.state.user._id,
                content: '我们已经成为好友啦！',
                type: 0,
                state: 1,
            }
        ]);
        ctx.status = 204;
    }

    /// 查找我的全部好友
    async listMyFriends(ctx) {
        ctx.body = await Friend
            .find({uid: ctx.params.id}).populate('uid fid');
    }

    /// 查找我的全部好友和其最新消息
    async listMyFriendsAndMessages(ctx) {
        const friends = await Friend.find({uid: ctx.params.id}).populate('fid');
        let result = [];
        for (const friend of friends){
            result.push(await Message.findOne({$or: [
                {from: friend.fid._id},
            ]}).populate('from to'));
        }
        ctx.body = result;
    }
     /// 查找和某人具体的聊天记录
    async listMessagesWithSomeone(ctx) {
        const { per_page = 10 } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_page * 1, 1);
        const q = new RegExp(ctx.query.q);
        ctx.body = await Message
            .find({ $or: [{from: ctx.params.fid, to: ctx.params.id, content: q},{ from: ctx.params.id, to: ctx.params.fid, content: q} ] }).sort({'createdAt': -1})
            .limit(perPage).skip(page * perPage).populate('from to');
    }
    
    /// 向好友发送一条消息[暂时不打算做，客户端自己存储消息记录就可以了]
    async sendOneMessage(ctx) {
        ctx.status = 204;
    }

}
module.exports = new UsersController();