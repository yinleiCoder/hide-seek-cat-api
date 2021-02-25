/**
 * 躲猫猫 Koa RESTful API:
 * @author yinlei
 */
const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const app = new Koa();
const routing = require('./routes');

const error = require('koa-json-error');
const parameter = require('koa-parameter');


/// 错误处理: 处理错误、生产环境下禁用错误堆栈的返回
app.use(error({
    postFormat: (e, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
}));
/// 解析POST请求的Body
app.use(bodyparser());
/// 校验请求体
app.use(parameter(app));
/// 批量注册routes
routing(app);

const PORT = 3000;
app.listen(PORT, () => console.log(`躲猫猫 RESTful API 启动端口: ${PORT}`));