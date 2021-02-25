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
});

module.exports = model('User', userSchema);