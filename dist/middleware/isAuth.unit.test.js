"use strict";

var _isAuth = _interopRequireDefault(require("./isAuth"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _sinon = _interopRequireDefault(require("sinon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createReq = (returningValue = null) => {
  return {
    get() {
      return returningValue;
    }

  };
};

describe('Auth middleware', () => {
  it('should throw an error if no authorization header is present', () => {
    expect(_isAuth.default.bind(void 0, createReq(), {}, () => {})).toThrow();
  });
  it('should throw an error if the authorization header is only one string', () => {
    expect(_isAuth.default.bind(void 0, createReq('Bearer'), {}, () => {})).toThrow();
  });
  it('should throw an error if the token cannot be verified', () => {
    expect(_isAuth.default.bind(void 0, createReq('Bearer xyz'), {}, () => {})).toThrow();
  });
  it('should yield a userId after decoding the token', () => {
    const req = createReq('Bearer someToken');

    _sinon.default.stub(_jsonwebtoken.default, 'verify');

    _jsonwebtoken.default.verify.returns({
      userId: 'abc'
    });

    (0, _isAuth.default)(req, {}, () => {});
    expect(req).toHaveProperty('userId', 'abc');
    expect(_jsonwebtoken.default.verify.called).toEqual(true);

    _jsonwebtoken.default.verify.restore();
  });
});