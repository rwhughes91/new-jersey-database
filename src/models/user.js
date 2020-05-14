import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
    unique: true,
  },
  resetTokenExpiration: {
    type: Date,
  },
});

export default model('User', userSchema);
