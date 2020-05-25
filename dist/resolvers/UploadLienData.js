"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const UploadLienData = {
  sale_date: ({
    sale_date
  }) => {
    return sale_date.toLocaleDateString();
  },
  recording_date: ({
    recording_date
  }) => {
    return recording_date.toLocaleDateString();
  }
};
var _default = UploadLienData;
exports.default = _default;