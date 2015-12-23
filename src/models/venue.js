import mongoose from 'mongoose';

const Venue = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  capacity: { type: String, required: true },
  address: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId },
  created_at: Date,
  updated_at: Date,
});


export default mongoose.model('Venue', Venue);
