/**
 * Home 控制器
 * @author yinlei
 */
class HomeController {
    index(ctx) {
        ctx.body = '<h1>躲猫猫首页</h1>'
    }
}
module.exports = new HomeController();