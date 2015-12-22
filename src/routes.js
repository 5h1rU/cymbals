import { login } from './routes/login';
import { userGet, userPost, userUpdate } from './routes/user';

export function routes(app) {
  app.post('/v1/login', login);
  app.post('/v1/users', userPost);
  app.put('/v1/users/:id', userUpdate);
  app.get('/v1/users/:id', userGet);
}
