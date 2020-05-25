"use strict";

var _setup = _interopRequireDefault(require("./setup"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('makeResponse function', () => {
  it('should return props when .json is called', () => {
    const res = new _setup.default();
    expect(res.status(404).json({
      message: 'Page not found'
    })).toEqual({
      statusCode: 404,
      message: {
        message: 'Page not found'
      }
    });
  });
});