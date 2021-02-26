/**
 * 回答帖子Model.
 * 1. 回答的增删改查
 * 2. 问题-答案/用户-答案——一对多
 * 3. 👍/👎答案
 * 4. 收藏答案
 * 
 * 帖子——答案 二级嵌套接口
 * @author yinlei
 */
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const answerSchema = new Schema({
    __v: { type: Number, select: false },
    content: { type: String, required: true },
    /// 每个帖子都有一个回答者
    answerer: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
    /// 记录其从属于哪个帖子： 一对多
    postId: { type: String, required: true },
    /// 投票数
    voteCount: { type: Number, required: true, default: 0 },
}, {timestamps: true});

module.exports = model('Answer', answerSchema);