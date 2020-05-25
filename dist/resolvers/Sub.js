"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _formatters = require("../utils/formatters");

const Sub = {
  sub_type: ({
    sub_type
  }, args, context, info) => {
    return (0, _formatters.toTitleCase)(sub_type);
  },
  sub_date: ({
    sub_date
  }, args, context, info) => {
    return sub_date.toLocaleDateString();
  }
};
var _default = Sub;
exports.default = _default;