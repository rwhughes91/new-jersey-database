"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = (req, res, next) => {
  if (req.path !== '/grapqhl' && req.method !== 'POST') {
    return res.status(404).json({
      message: 'Page not found'
    });
  }

  next();
};

exports.default = _default;