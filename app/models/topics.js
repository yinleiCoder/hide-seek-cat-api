/**
 * 话题Model.
 * 分页、模糊搜素
 * 用户属性中话题的引用、关注/取消话题、用户关注的话题列表
 * @author yinlei
 */
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const topicSchema = new Schema({
    __v: { type: Number, select: false },
    name: { type: String, required: true },
    avatar_url: { type: String },
    introduction: { type: String, select: false },
});

module.exports = model('Topic', topicSchema);