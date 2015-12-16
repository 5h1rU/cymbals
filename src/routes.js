import { login } from './routes/login';
import { userGet, userPost, userUpdate } from './routes/user';

export function routes(app, passport) {
  login(app, passport);
  userPost(app, passport);
  userGet(app);
  userUpdate(app);
}
