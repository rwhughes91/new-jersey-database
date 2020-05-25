"use strict";

var _is = _interopRequireDefault(require("./is404"));

var _setup = _interopRequireDefault(require("../tests/setup"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createReq = (path = null, method = null) => {
  return {
    path,
    method
  };
};

describe('is404 middleware', () => {
  let res;
  beforeEach(() => {
    res = new _setup.default();
  });
  it('should return json when not a post request to graphql', () => {
    expect((0, _is.default)(createReq('/graphql', 'GET'), res, () => {})).toEqual({
      statusCode: 404,
      message: {
        message: 'Page not found'
      }
    });
  });
  it('should pass when posting to /graphql', () => {
    expect((0, _is.default)(createReq('/graphql', 'POST'), res, () => {})).toBeUndefined();
  });
});