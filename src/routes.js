import { login } from './routes/login';
import { userGet, userPost, userUpdate } from './routes/user';
import { venuePost, venueGet, venueUpdate } from './routes/venue';

export function routes(app) {
  app.post('/v1/login', login);

  app.post('/v1/users', userPost);
  app.put('/v1/users/:id', userUpdate);
  app.get('/v1/users/:id', userGet);

  app.post('/v1/venues/create', venuePost);
  app.get('/v1/venues/:id', venueGet);
  app.put('/v1/venues/:id', venueUpdate);
}
