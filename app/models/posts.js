/**
 * 帖子Model.
 * 1. 帖子的增删改查
 * 2. 用户的帖子列表(用户-帖子——一对多关系)
 * 3. 话题的帖子列表+帖子的话题列表(话题-帖子多对多关系)
 * @author yinlei
 */
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const postSchema = new Schema({
    __v: { type: Number, select: false },
    title: { type: String, required: true },
    description: { type: String },
    /// 每个帖子只有一个发布者用户
    poster: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
    /// 话题与帖子的多对多关系
    topics: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
        select: false,
    }
},{timestamps: true});

module.exports = model('Post', postSchema);