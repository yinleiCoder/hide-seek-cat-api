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
        if(ctx.params.id * 1 >= db.length) {
            ctx.throw(412, '先决条件失败：id >= 数组长度.');
        }
        ctx.body = db[ctx.params.id * 1];
    }
    create(ctx) {
        ctx.verifyParams({
            name: {type: 'string'},
            age: {type: 'number'}
        });
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