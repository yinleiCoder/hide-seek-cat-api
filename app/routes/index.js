/**
 * 读取routes目录下的文件，并挂在到koa-router.
 * @author yinlei
 */
const fs = require('fs');
module.exports = (app) => {
    fs.readdirSync(__dirname).forEach(file => {
        if(file === 'index.js') return;
        const route = require(`./${file}`);
        /// allowedMethods: 响应HTTP options，告诉它所支持的请求方法、相应的返回405(不允许)和501(没实现)
        app.use(route.routes()).use(route.allowedMethods());
    })
}