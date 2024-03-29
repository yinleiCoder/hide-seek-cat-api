/**
 * 话题 控制器
 * @author yinlei
 */
/// topic model.
const Topic = require('../models/topics');
/// user model.
const User = require('../models/users');
/// post model.
const Post = require('../models/posts');

class TopicController {

    /// 分页
    async find(ctx) {
        const { per_page = 10 } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_page * 1, 1);
        ctx.body = await Topic
            .find({name: new RegExp(ctx.query.q)})
            .sort({'createdAt': -1})
            .limit(perPage).skip(page * perPage);
    }

    async checkTopicExist(ctx, next) {
        const topic = await Topic.findById(ctx.params.id);
        if(!topic){
            ctx.throw(404, '该话题不存在');
        }
        await next();
    }

    async findById(ctx) {
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const topic = await Topic.findById(ctx.params.id).select(selectFields);
        ctx.body = topic;
    }

    async create(ctx) {
        ctx.verifyParams({
            name: {type: 'string'},
            avatar_url: {type: 'string', required: false},
            introduction: {type: 'string', required: false},
        });
        const topic = await new Topic(ctx.request.body).save();
        ctx.body = topic;
    }

    async update(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: false},
            avatar_url: {type: 'string', required: false},
            introduction: {type: 'string', required: false},
        });
        const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        ctx.body = topic;
    }

    /// 获取该话题下的关注者
    async listTopicFollowers(ctx) {
        const users = await User.find({followingTopics: ctx.params.id});
        ctx.body = users;
    }

    /// 某话题下的帖子列表
    async listPosts(ctx) {
        const posts = await Post.find({ topics: ctx.params.id }).populate('poster topics');
        ctx.body = posts;
    }

}
module.exports = new TopicController();