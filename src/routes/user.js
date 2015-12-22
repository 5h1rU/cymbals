import User from '../models/user';
import { jwtSign } from '../config/jwt';

export function userPost(req, res) {
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

    return res.status(201).json({ token: jwtSign(user) });
  });
}

export function userGet(req, res) {
  if (req.params.id === 'me') {
    User.findOne({ _id: req.user.id }, (err, user) => {
      if (err) { throw err; }
      return res.status(200).json({ user });
    });
  } else {
    User.findOne({ _id: req.params.id }, (err, user) => {
      if (err) { throw err; }
      return res.status(200).json({ user });
    });
  }
}

export function userUpdate(req, res) {
  if (req.params.id !== req.user.id) {
    return res.status(401).json({ error: [{ msg: 'Unauthorized' }] });
  }

  User.findByIdAndUpdate(req.user.id, { first_name: req.body.first_name }, (err, user) => {
    if (err) { throw err; }
    return res.status(200).json({ user });
  });
}
