/**
 * 帖子 控制器
 * @author yinlei
 */
/// post model.
const Post = require('../models/posts');
const path = require('path');
const fs = require('fs');
class PostController {

    /// 分页
    async find(ctx) {
        const { per_page = 10 } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_page * 1, 1);
        const q = new RegExp(ctx.query.q);
        ctx.body = await Post
            .find({ $or: [{title: q}, {description: q}] })
            .sort({'createdAt': -1}).limit(perPage).skip(page * perPage).populate('poster topics');
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
            url: {type: 'string', required: false},
        });
        const file = ctx.request.files.file; 
        const basename = path.basename(file.path);
        let stream =  fs.createReadStream(file.path);
        let size = fs.statSync(file.path).size;
        let {url} = await ctx.state.aliOss.putStream(`/flutter-cat/${basename}`,stream, {
            contentLength: size,
        });
        let temp = {...ctx.request.body, url};
        const post = await new Post({...temp, poster: ctx.state.user._id}).save();
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