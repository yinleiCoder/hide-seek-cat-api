/**
 * Users 控制器
 * @author yinlei
 */
/// user model.
const User = require('../models/users');

/// json web token.
const jsonwebtoken = require('jsonwebtoken');
const { secret } = require('../config');

class UsersController {

    /// 分页
    async find(ctx) {
        const { per_page = 10 } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_page * 1, 1);
        ctx.body = await User
            .find({name: new RegExp(ctx.query.q)})
            .limit(perPage).skip(page * perPage);
    }

    async findById(ctx) {
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const user = await User.findById(ctx.params.id).select(selectFields);
        if(!user) {
            ctx.throw(404, '用户不存在');
        }
        ctx.body = user;
    }

    async create(ctx) {
        ctx.verifyParams({
            name: {type: 'string'},
            password: {type: 'string'},
        });
        const { name } = ctx.request.body;
        const repeatedUser = await User.findOne({ name });
        if(repeatedUser){
            ctx.throw(409, '用户已经存在');
        }
        const user = await new User(ctx.request.body).save();
        ctx.body = user;
    }

    /// 授权: 保证操作者是其自己,不能删除别人的
    async checkOwner(ctx, next) {
        /// koa-jwt 中间件将jsonwebtoken.verify结果挂载到了ctx.state下
        if(ctx.params.id !== ctx.state.user._id) {
            ctx.throw(403, '未授权');
        }
        await next();
    }

    async update(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: false},
            password: {type: 'string', required: false},
            avatar_url: { type: 'string', required: false},
            gender: { type: 'string', required: false},
            headline: { type: 'string', required: false},
            locations: { type: 'array', itemType: 'string', required: false},
            business: { type: 'string', required: false},
            employments: { type: 'array', itemType: 'object', required: false},
            educations: { type: 'array', itemType: 'object', required: false},
        });
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if(!user) {
            ctx.throw(404, '用户不存在');
        }
        ctx.body = user;
    }

    async delete(ctx) {
        const user = await User.findByIdAndRemove(ctx.params.id);
        if(!user) {
            ctx.throw(404, '用户不存在');
        }
        ctx.status = 204;
    }

    async login(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: true},
            password: {type: 'string', required: true},
        });
        const user = await User.findOne(ctx.request.body);
        if(!user){
            ctx.throw(401, '用户名或密码不正确');
        }
        /// 生成token.
        const { _id, name } = user;
        const token = jsonwebtoken.sign({ _id, name }, secret, {
            expiresIn: '1d'
        });
        ctx.body = { token };
    }

    /// 获取自己的粉丝
    async listFollowers(ctx) {
        const users = await User.find({following: ctx.params.id});
        ctx.body = users;
    }

    /// 获取自己关注人列表
    async listFollowing(ctx) {
        const user = await User.findById(ctx.params.id).select('+following').populate('following');
        if(!user){
            ctx.throw(404, '未关注任何人');
        }
        ctx.body = user.following;
    }

    /// 检验用户存在与否 中间件
    async checkUserExist(ctx, next) {
        const user = await User.findById(ctx.params.id);
        if(!user){
            ctx.throw(404, '该用户不存在');
        }
        await next();
    }

    async follow(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following');
        if(!me.following.map(id => id.toString()).includes(ctx.params.id)){
            me.following.push(ctx.params.id);
            me.save();
        }
        ctx.status = 204;
    }

    async unfollow(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following');
        const index = me.following.map(id => id.toString()).indexOf(ctx.params.id);
        if(index > -1){
            me.following.splice(index, 1);
            me.save();
        }
        ctx.status = 204;
    }

}
module.exports = new UsersController();