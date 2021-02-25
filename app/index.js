/**
 * 躲猫猫 Koa RESTful API:
 * @author yinlei
 */
const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const app = new Koa();
const routing = require('./routes');

/// 解析POST请求的Body
app.use(bodyparser());
/// 批量注册routes
routing(app);

const PORT = 3000;
app.listen(PORT, () => console.log(`躲猫猫 RESTful API 启动端口: ${PORT}`));