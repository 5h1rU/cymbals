import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user';

export function serializeUser(passport) {
  passport.serializeUser((user, done) => done(null, user.id));
}

export function deserializeUser(passport) {
  passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));
}

function validateUserError(err, done) {
  if (err) {
    return done(err);
  }
}

function validateUserExist(configObj) {
  return configObj.done(null, false, { message: 'user already used' });
}

function validateUserLogin(configObj) {
  return configObj.done(null, false, { message: 'wrooong' });
}

function saveUser(user, done) {
  user.save(err => {
    if (err) {
      throw err;
    }
    return done(null, user);
  });
}

// this can be a compose function
function userCreate(configObj, done) {
  const user = new User();
  user.local.email = configObj.email;
  user.local.password = user.generateHash(configObj.password);
  saveUser(user, done);
}

// this can be a compose function
function validateUser(configObj) {
  User.findOne({ 'local.email': configObj.email }, (err, user) => {
    validateUserError(err, configObj.done);
    configObj.userHandler(configObj, user);
  });
}

function userSetData(configObj, user) {
  if (user) {
    return validateUserExist(configObj);
  }

  return userCreate({
    email: configObj.email,
    password: configObj.password,
  }, configObj.done);
}

function userLoginCheckData(configObj, user) {
  if (!user || !user.validPassword(configObj.password)) {
    return validateUserLogin(configObj);
  }
  return configObj.done(null, user);
}

export function localSignup(passport) {
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  }, (req, email, password, done) => {
    return validateUser({
      req,
      email,
      password,
      userHandler: userSetData,
      done,
    });
  }));
}

export function localLogin(passport) {
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  }, (req, email, password, done) => {
    return validateUser({
      req,
      email,
      password,
      userHandler: userLoginCheckData,
      done,
    });
  }));
}
