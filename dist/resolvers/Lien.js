"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _formatters = require("../utils/formatters");

const Lien = {
  county: ({
    county
  }) => {
    return (0, _formatters.toTitleCase)(county);
  },
  address: ({
    address
  }) => {
    return (0, _formatters.toTitleCase)(address);
  },
  sale_date: ({
    sale_date
  }) => {
    return sale_date ? sale_date.toLocaleDateString() : sale_date;
  },
  redemption_date: ({
    redemption_date
  }) => {
    return redemption_date ? redemption_date.toLocaleDateString() : redemption_date;
  },
  subs: ({
    subs
  }) => {
    if (!(subs instanceof Array)) {
      return [subs];
    }

    return subs;
  }
};
var _default = Lien;
exports.default = _default;