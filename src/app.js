import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import expressValidator from 'express-validator';
import * as routes from './routes.js';
import * as configPassport from './config/passport';
import expressJwt from 'express-jwt';

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressJwt({ secret: 'secret' }).unless({ path: ['/v1/login', '/v1/signup'] }));

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: [{ msg: 'invalid credentials' }] });
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());

configPassport.serializeUser(passport);
configPassport.deserializeUser(passport);
configPassport.localSignup(passport);
configPassport.localLogin(passport);

routes.profile(app);
routes.signup(app, passport);
routes.login(app, passport);
routes.logout(app);
// connect to our database
mongoose.connect('mongodb://localhost:27017');


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
