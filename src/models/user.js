import mongoose from 'mongoose';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';

const User = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: String,
  password: { type: String, required: true },
  created_at: Date,
  updated_at: Date,
});

User.methods.generateHash = password => hashSync(password, genSaltSync(8), null);

User.methods.validPassword = function (password) {
  return compareSync(password, this.password);
};

export default mongoose.model('User', User);
