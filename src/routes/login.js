import jwt from 'jsonwebtoken';
import User from '../models/user';

export function login(app) {
  app.post('/v1/login', (req, res) => {
    req.checkBody('email', 'Invalid email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail();

    req.checkBody('password', 'password field is empty').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({ error: errors });
    }

    User.findOne({ 'email': req.body.email }, (err, user) => {
      if (err) { throw err; }
      if (!user || !user.validPassword(req.body.password)) {
        return res.status(401).json({ error: [{ msg: 'invalid user or password' }] });
      }
      const token = jwt.sign(user, 'secret');
      return res.status(200).json({ token });
    });
  });
}
