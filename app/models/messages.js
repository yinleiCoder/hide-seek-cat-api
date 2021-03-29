/**
 * 消息Model.
 * @author yinlei
 */
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const messageSchema = new Schema({
    __v: { type: Number, select: false },
    from: { type: Schema.Types.ObjectId, ref: 'User'},
    to: { type: Schema.Types.ObjectId, ref: 'User'},
    content: { type: String },
    type: { type: Number }, /// 内容类型 0文字 1图片链接 2音频链接 3 视频消息 4 地理位置
    state: { type: Number}, /// 消息状态 0已读 1未读
},{timestamps: true});

module.exports = model('Message', messageSchema);