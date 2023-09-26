import Joi from '../../../node_modules/joi/lib/index';
import User from '../../models/user';

/*  회원가입 구현
    POST /api/auth/register
*/
export const register = async (ctx) => {
    const schema = Joi.object().keys({
        username: Joi.string().alphanum().min(3).max(20).required(),
        password: Joi.string().required(),
    });
    const result = schema.validate(ctx.request.body);
    if (result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    const { username, password } = ctx.request.body;
    try {
        const exists = await User.findByUsername(username);
        if (exists) {
            ctx.status = 409; // Conflict
            return;
        }
        const user = new User({
            username,
        });
        await user.setPassword(password);
        await user.save();
        ctx.body = user.serialize();
    } catch (e) {
        ctx.throw(500, e);
    }
};

/*  로그인 구현
    POST /api/auth/login
*/
export const login = async (ctx) => {
    const { username, password } = ctx.request.body;
    if (!username || !password) {
        ctx.status = 401; // Unauthorized
        return;
    }
    try {
        const user = await User.findByUsername(username);
        if (!user) {
            ctx.status = 401;
            return;
        }
        const valid = await user.checkPassword(password);
        if (!valid) {
            ctx.status = 401;
            return;
        }
        ctx.body = user.serialize();
    } catch (e) {
        ctx.throw(500, e);
    }
};
export const check = async (ctx) => {};
export const logout = async (ctx) => {};
