/**
 * 用户Model.
 * 1. 分析用户模块的属性
 * 2. 编写用户模块的Schema
 * 3. 使用Schema生成用户Model
 * 
 * @author yinlei
 */
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema({
    __v: { type: Number, select: false },
    name: { type: String, required: true },
    password: { type: String, required: true, select: false },
    avatar_url: { type: String, default: 'https://img.zcool.cn/community/019e006054343f11013e87f440a8b8.jpg@3000w_1l_0o_100sh.jpg' },
    gender: { type: String, enum: ['male', 'female'], default: 'male' },
    headline: { type: String, default: '添加一句话介绍自己吧！' },
    locations: { type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }], select: false },
    business: { type: Schema.Types.ObjectId, ref: 'Topic', select: false },
    employments: {
        type: [{
            company: { type: Schema.Types.ObjectId, ref: 'Topic' },
            job: { type: Schema.Types.ObjectId, ref: 'Topic' },
        }], 
        select: false
    },
    educations: {
        type: [{
            school: { type: Schema.Types.ObjectId, ref: 'Topic' },
            major: { type: Schema.Types.ObjectId, ref: 'Topic' },
            diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
            entrance_year: { type: Number },
            graduation_year: { type: Number },
        }], 
        select: false
    },
    /// 关注. 粉丝数量太大了，故和User分离
    following: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        select: false,
    },
    /// 关注话题
    followingTopics: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
        select: false,
    },
    /// 👍
    likingAnswers: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
        select: false,
    },
    /// 👎
    dislikingAnswers: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
        select: false,
    },
    /// 收藏答案
    collectingAnswers: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
        select: false,
    },
}, {timestamps: true});

module.exports = model('User', userSchema);