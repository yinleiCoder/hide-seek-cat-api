/**
 * APPModel.
 * APP的升级等
 * @author yinlei
 */
const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const appSchema = new Schema({
    __v: { type: Number, select: false },
    device: { type: String },
    channel: { type: String },
    architecture: { type: String },
    model: { type: String },
    shopUrl: { type: String },
    fileUrl: { type: String },
    latestVersion: { type: String },
    latestDescription: { type: String },
},{timestamps: true});

module.exports = model('App', appSchema);