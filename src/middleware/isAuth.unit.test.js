import isAuth from './isAuth';
import jwt from 'jsonwebtoken';
import sinon from 'sinon';

const createReq = (returningValue = null) => {
  return {
    get() {
      return returningValue;
    },
  };
};

describe('Auth middleware', () => {
  it('should throw an error if no authorization header is present', () => {
    expect(isAuth.bind(this, createReq(), {}, () => {})).toThrow();
  });
  it('should throw an error if the authorization header is only one string', () => {
    expect(isAuth.bind(this, createReq('Bearer'), {}, () => {})).toThrow();
  });
  it('should throw an error if the token cannot be verified', () => {
    expect(isAuth.bind(this, createReq('Bearer xyz'), {}, () => {})).toThrow();
  });
  it('should yield a userId after decoding the token', () => {
    const req = createReq('Bearer someToken');
    sinon.stub(jwt, 'verify');
    jwt.verify.returns({ userId: 'abc' });
    isAuth(req, {}, () => {});
    expect(req).toHaveProperty('userId', 'abc');
    expect(jwt.verify.called).toEqual(true);
    jwt.verify.restore();
  });
});
