"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _socket = _interopRequireDefault(require("socket.io"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let ioServer = {
  uploading: false
};
var _default = {
  init: httpServer => {
    ioServer.io = (0, _socket.default)(httpServer);
    return ioServer.io;
  },
  getIO: () => {
    if (!ioServer.io) throw new Error('Socket must be initialized');
    return ioServer;
  }
};
exports.default = _default;