/**
 * Home 控制器
 * @author yinlei
 */
const path = require('path');
const fs = require('fs');
class HomeController {
    index(ctx) {
        ctx.body = '<h1>躲猫猫首页</h1>'
    }
    /**
     * 测试阿里云oss
     */
    async upload(ctx) {
        const file = ctx.request.files.file;
        const basename = path.basename(file.path);
        // console.log(ctx.state.aliOss)
        let stream =  fs.createReadStream(file.path);
        let size = fs.statSync(file.path).size;
        let result = await ctx.state.aliOss.putStream(`/flutter-cat/${basename}`,stream, {
            contentLength: size,
        });
        ctx.body = result;
        // ctx.body = {
        //     url: `${ctx.origin}/uploads/${basename}`,
        // }
    }
}
module.exports = new HomeController();