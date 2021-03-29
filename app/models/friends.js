/**
 * 好友Model.
 * @author yinlei
 */
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const friendSchema = new Schema({
    __v: { type: Number, select: false },
    uid: { type: Schema.Types.ObjectId, ref: 'User'},
    fid: { type: Schema.Types.ObjectId, ref: 'User'},
    state: { type: Number}, /// 好友申请状态：0已为好友，1申请中，2对方还未同意(申请发送方)
},{timestamps: true});

module.exports = model('Friend', friendSchema);