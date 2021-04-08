/**
 * 回答帖子 控制器
 * @author yinlei
 */
/// answers model.
const Answer = require('../models/answers');

class AnswerController {

    /// 分页
    async find(ctx) {
        const { per_page = 10 } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_page * 1, 1);
        const q = new RegExp(ctx.query.q);
        ctx.body = await Answer
            .find({ content: q, postId: ctx.params.postId })
            .limit(perPage).skip(page * perPage).populate('answerer');
    }

    async checkanswerExist(ctx, next) {
        const answer = await Answer.findById(ctx.params.id).select('+answerer');
        if(!answer){
            ctx.throw(404, '该答案不存在');
        }
        /// 只有在删改查答案才检查答案存不存在，👍和👎不检查
        if(ctx.params.postId && answer.postId !== ctx.params.postId){
            ctx.throw(404, '该帖子下没有此答案');
        }
        ctx.state.answer = answer;
        await next();
    }

    async findById(ctx) {
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const answer = await Answer.findById(ctx.params.id).select(selectFields).populate('answerer');
        ctx.body = answer;
    }

    async create(ctx) {
        ctx.verifyParams({
            content: {type: 'string'},
        });
        const answer = await new Answer({...ctx.request.body, answerer: ctx.state.user._id, postId: ctx.params.postId}).save();
        ctx.body = answer;
    }

    async checkanswerer(ctx, next) {
        const { answer } = ctx.state;
        if(answer.answerer.toString() !== ctx.state.user._id) {
            ctx.throw(403, '没有权限操作该帖子的回答');
        }
        await next();
    }

    async update(ctx) {
        ctx.verifyParams({
            content: {type: 'string', required: false},
        });
        await ctx.state.answer.update(ctx.request.body);
        ctx.body = ctx.state.answer;
    }

    async delete(ctx) {
        await Answer.findByIdAndRemove(ctx.params.id);
        ctx.status = 204;
    }

}
module.exports = new AnswerController();