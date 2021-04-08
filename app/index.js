/**
 * 躲猫猫 Koa RESTful API:
 * @author yinlei
 */
const Koa = require('koa');
const koaBody = require('koa-body');
const app = new Koa();
const routing = require('./routes');

const error = require('koa-json-error');
const parameter = require('koa-parameter');
const koaStatic = require('koa-static');
const path = require('path');

/// ali-oss
let OSS = require('ali-oss');
let aliOss = new OSS({
    region: 'oss-cn-chengdu',
    bucket: 'yinlei-hide-seek-cat',
    accessKeyId: 'LTAI5tGJiHs12XBE7k8o5Syo',
    accessKeySecret: 'T0SBUqJaVLG7PI4YUmoqhaEvnERPdl',
});

/// MongoDB.
const { connectionStr } = require('./config');
const mongoose = require('mongoose');
mongoose.connect(connectionStr, {useNewUrlParser: true}, () => console.log('躲猫猫MongoDB连接成功!!!'));
mongoose.connection.on('error', console.error);
mongoose.set('useFindAndModify', false);


/// 文件静态
app.use(koaStatic(path.join(__dirname, 'public')));
/// 错误处理: 处理错误、生产环境下禁用错误堆栈的返回
app.use(error({
    postFormat: (e, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
}));
/// 解析POST请求的Body
app.use(koaBody({
    /// 启用文件
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, '/public/uploads'),
        keepExtensions: true,
    }
}));
/// ali-oss
app.use(async (ctx, next) => {
    ctx.state.aliOss = aliOss;
    await next();
});
/// 校验请求体
app.use(parameter(app));
/// 批量注册routes
routing(app);

const PORT = 3000;
// app.listen(PORT, () => console.log(`躲猫猫 RESTful API 启动端口: ${PORT}`));

const httpServer = require('http').createServer(app.callback());
const options = {};
const io = require('socket.io')(httpServer, options);
require('./socketio')(io);
httpServer.listen(PORT);