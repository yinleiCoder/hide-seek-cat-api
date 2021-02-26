/**
 * 帖子 控制器
 * @author yinlei
 */
/// post model.
const Post = require('../models/posts');

class PostController {

    /// 分页
    async find(ctx) {
        const { per_page = 10 } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_page * 1, 1);
        const q = new RegExp(ctx.query.q);
        ctx.body = await Post
            .find({ $or: [{title: q}, {description: q}] })
            .limit(perPage).skip(page * perPage);
    }

    async checkPostExist(ctx, next) {
        const post = await Post.findById(ctx.params.id).select('+poster');
        if(!post){
            ctx.throw(404, '该帖子不存在');
        }
        ctx.state.post = post;
        await next();
    }

    async findById(ctx) {
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const post = await Post.findById(ctx.params.id).select(selectFields).populate('poster topics');
        ctx.body = post;
    }

    async create(ctx) {
        ctx.verifyParams({
            title: {type: 'string'},
            description: {type: 'string', required: false},
        });
        const post = await new Post({...ctx.request.body, poster: ctx.state.user._id}).save();
        ctx.body = post;
    }

    async checkPoster(ctx, next) {
        const { post } = ctx.state;
        if(post.poster.toString() !== ctx.state.user._id) {
            ctx.throw(403, '没有权限操作帖子');
        }
        await next();
    }

    async update(ctx) {
        ctx.verifyParams({
            title: {type: 'string', required: false},
            description: {type: 'string', required: false},
        });
        await ctx.state.post.update(ctx.request.body);
        ctx.body = ctx.state.post;
    }

    async delete(ctx) {
        await Post.findByIdAndRemove(ctx.params.id);
        ctx.status = 204;
    }

}
module.exports = new PostController();