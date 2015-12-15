import jwt from 'jsonwebtoken';

export function login(app, passport) {
  app.post('/v1/login', (req, res, next) => passport.authenticate('local-login', (err, user) => {
    if (err) { return next(err); }

    req.checkBody('email', 'Invalid email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail();

    req.checkBody('password', 'password field is empty')
      .notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({ error: errors });
    }

    if (!user) {
      return res.status(401).json({ error: [{ msg: 'invalid user or password' }] });
    }

    const token = jwt.sign(user, 'secret', { expiresIn: 1000 });
    return res.status(200).json({ token });
  })(req, res, next)
  );
}

export function logout(app) {
  app.post('/v1/logout', (req, res) => {
    req.logout();
    return res.status(200).json({ message: 'logout successfully' });
  });
}

export function signup(app, passport) {
  app.post('/v1/signup', (req, res, next) => passport.authenticate('local-signup', (err, user) => {
    if (err) { return next(err); }
    req.checkBody('email', 'Invalid email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail();

    req.checkBody('password', 'password field is empty')
      .notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({ error: errors });
    }

    const token = jwt.sign(user, 'secret', { expiresIn: 1000 });
    return res.status(200).json({ token });
  })(req, res, next)
  );
}

export function profile(app) {
  app.get('/v1/profile', (req, res) => res.json({ user: req.user }));
}
