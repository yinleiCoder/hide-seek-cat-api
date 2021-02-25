/**
 * Users 控制器
 * @author yinlei
 */
const db = [{name: 'yinlei'}];

class UsersController {
    find(ctx) {
        ctx.body = db;
    }
    findById(ctx) {
        ctx.body = db[ctx.params.id * 1];
    }
    create(ctx) {
        db.push(ctx.request.body);
        ctx.body = db;
    }
    update(ctx) {
        db[ctx.params.id * 1] = ctx.request.body;
        ctx.body = ctx.request.body;
    }
    delete(ctx) {
        db.splice(ctx.params.id * 1, 1);
        ctx.status = 200;
    }
}
module.exports = new UsersController();