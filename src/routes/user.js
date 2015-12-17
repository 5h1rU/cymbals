import jwt from 'jsonwebtoken';
import User from '../models/user';

export function userPost(app) {
  app.post('/v1/user', (req, res) => {
    const newUser = new User();

    newUser.first_name = req.body.first_name;
    newUser.last_name = req.body.last_name;
    newUser.email = req.body.email;
    newUser.password = newUser.generateHash(req.body.password);

    newUser.save((err, user) => {
      if (err) { return res.status(400).json({ err }); }

      req.checkBody('email', 'Invalid email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail();

      req.checkBody('password', 'password field is empty').notEmpty();
      req.checkBody('first_name', 'first name field is empty').notEmpty();
      req.checkBody('last_name', 'last name field is empty').notEmpty();

      const errors = req.validationErrors();
      if (errors) {
        return res.status(400).json({ error: errors });
      }

      const token = jwt.sign(user, 'secret');
      return res.status(200).json({ token });
    });
  });
}

export function userGet(app) {
  app.get('/v1/user', (req, res) => res.json({ user: req.user }));
}

export function userUpdate(app) {
  app.put('/v1/user', (req, res) => {
    return User.findByIdAndUpdate(req.user._id, { first_name: req.body.first_name }, (err, user) => {
      if (err) { throw err; }
      return res.status(200).json({ user });
    });
  });
}
