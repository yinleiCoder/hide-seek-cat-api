/**
 * APP升级信息等 控制器
 * @author yinlei
 */
/// post model.
const App = require('../models/app');

class AppController {

    async appUpdate(ctx) {
        ctx.verifyParams({
            device: {type: 'string'},
            channel: {type: 'string', required: false},
            architecture: {type: 'string', required: false},
            model: {type: 'string', required: false},
        });
        const {device, channel, architecture, model} = ctx.request.body;
        // const app = await App.find();
        // ctx.body = app;
        ctx.body = {
            device,
            channel,
            architecture,
            model,
            shopUrl: '暂未上传到APP应用商店',
            banner: 'https://img.zcool.cn/community/013d205cdd458da801208f8bf3bdda.jpg@2o.jpg',
            //https://giligili-yinlei.oss-cn-shanghai.aliyuncs.com/flutter/app-armeabi-v7a-release.apk
            fileUrl: 'https://giligili-yinlei.oss-cn-shanghai.aliyuncs.com/flutter/app-x86_64-release.apk',
            latestVersion: 'v0.9.0-alpha',
            latestDescription: '这是测试APP升级接口'
        }
    }



}
module.exports = new AppController();