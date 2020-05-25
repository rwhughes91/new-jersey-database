"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const userSchema = new _mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: {
    type: String,
    unique: true
  },
  resetTokenExpiration: {
    type: Date
  }
});

var _default = (0, _mongoose.model)('User', userSchema);

exports.default = _default;