"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  this.props = {
    statusCode: null,
    message: null
  };

  this.status = statusCode => {
    this.props.statusCode = statusCode;
    return {
      json: message => {
        this.props.message = message;
        return this.props;
      }
    };
  };
}