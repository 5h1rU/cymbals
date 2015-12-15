import mongoose from 'mongoose';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';

const User = new mongoose.Schema({
  local: {
    email: String,
    password: String,
  },
});

User.methods.generateHash = password => hashSync(password, genSaltSync(8), null);

User.methods.validPassword = function (password) {
  return compareSync(password, this.local.password);
};

export default mongoose.model('User', User);
