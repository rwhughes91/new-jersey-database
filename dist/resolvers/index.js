"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Query = _interopRequireDefault(require("./Query"));

var _Mutation = _interopRequireDefault(require("./Mutation"));

var _Lien = _interopRequireDefault(require("./Lien"));

var _Sub = _interopRequireDefault(require("./Sub"));

var _UploadLienData = _interopRequireDefault(require("./UploadLienData"));

var _FlatLien = _interopRequireDefault(require("./FlatLien"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const resolvers = {
  Query: _Query.default,
  Mutation: _Mutation.default,
  Lien: _Lien.default,
  Sub: _Sub.default,
  UploadLienData: _UploadLienData.default,
  FlatLien: _FlatLien.default
};
var _default = resolvers;
exports.default = _default;