/**
 * 评论帖子Model.
 * 1. 评论的增删改查
 * 2. 答案-评论/帖子-评论/用户-评论一对多
 * 3. 一级评论与二级评论
 * 一级的评论：答案的评论
 * 二级的评论：评论的评论
 * @author yinlei
 */
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const commentSchema = new Schema({
    __v: { type: Number, select: false },
    content: { type: String, required: true },
    /// 每个帖子、答案都有一个评论者
    commentator: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
    /// 记录其从属于哪个帖子： 一对多
    postId: { type: String, required: true },
    /// 记录其从属于哪个答案：一对多
    answerId: { type: String, required: true },
    /// 根评论ID(二级评论需要用)
    rootCommentId: { type: String },
    /// 回复评论给谁
    replyTo: { type: Schema.Types.ObjectId, ref: 'User' },
}, {timestamps: true});

module.exports = model('Comment', commentSchema);