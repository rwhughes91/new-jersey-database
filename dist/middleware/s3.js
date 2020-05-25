"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = s3 => {
  return (req, res, next) => {
    req.s3 = s3;
    next();
  };
};

exports.default = _default;