import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import expressValidator from 'express-validator';
import { routes } from './routes.js';
import expressJwt from 'express-jwt';

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressJwt({ secret: 'secret' }).unless({ path: [{ url: '/v1/users', methods: ['POST'] }, { url: '/v1/login' }] }));
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: [{ msg: 'invalid credentials' }] });
  }
  next();
});

routes(app);
// connect to our database
mongoose.connect('mongodb://heroku_gwv8r7fv:peavcuum1ue6h47fmo4b7mltoc@ds033175.mongolab.com:33175/heroku_gwv8r7fv');


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

export default app;
