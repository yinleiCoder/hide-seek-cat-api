/**
 * 评论帖子 控制器
 * @author yinlei
 */
/// comments model.
const Comment = require('../models/comments');

class CommentController {

    /// 分页
    async find(ctx) {
        const { per_page = 10 } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_page * 1, 1);
        const q = new RegExp(ctx.query.q);
        const { postId, answerId } = ctx.params;
        const { rootCommentId } = ctx.query;
        ctx.body = await Comment
            .find({ content: q, postId, answerId, rootCommentId })
            .limit(perPage).skip(page * perPage)
            .populate('commentator replyTo');
    }

    async checkcommentExist(ctx, next) {
        console.log(ctx.params.id);
        const comment = await Comment.findById(ctx.params.id).select('+commentator');
        if(!comment){
            ctx.throw(404, '该评论不存在');
        }
        /// 只有在删改查答案才检查答案存不存在，👍和👎不检查
        if(ctx.params.postId && comment.postId !== ctx.params.postId){
            ctx.throw(404, '该帖子下没有此评论');
        }
        if(ctx.params.answerId && comment.answerId !== ctx.params.answerId){
            ctx.throw(404, '该答案下没有此评论');
        }
        ctx.state.comment = comment;
        await next();
    }

    async findById(ctx) {
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const comment = await Comment.findById(ctx.params.id).select(selectFields).populate('commentator');
        ctx.body = comment;
    }

    async create(ctx) {
        ctx.verifyParams({
            content: {type: 'string'},
            rootCommentId: {type: 'string', required: false},
            replyTo: {type: 'string', required: false},
        });
        const comment = await new Comment({...ctx.request.body, commentator: ctx.state.user._id, postId: ctx.params.postId, answerId: ctx.params.answerId}).save();
        ctx.body = comment;
    }

    async checkcommentator(ctx, next) {
        const { comment } = ctx.state;
        if(comment.commentator.toString() !== ctx.state.user._id) {
            ctx.throw(403, '没有权限操作该帖子的回答');
        }
        await next();
    }

    async update(ctx) {
        ctx.verifyParams({
            content: {type: 'string', required: false},
        });
        const { content } = ctx.request.body;
        await ctx.state.comment.update({content});
        ctx.body = ctx.state.comment;
    }

    async delete(ctx) {
        await Comment.findByIdAndRemove(ctx.params.id);
        ctx.status = 204;
    }

}
module.exports = new CommentController();