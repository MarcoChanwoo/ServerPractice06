import Router from 'koa-router';
import posts from './posts';
import auth from './auth/index';

const api = new Router();

api.use('/posts', posts.routes());
api.use('/auth', auth.routes());

// 라우터 출력
export default api;
