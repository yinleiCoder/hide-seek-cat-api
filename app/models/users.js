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
    name: { type: String, required: true },
});

module.exports = model('User', userSchema);