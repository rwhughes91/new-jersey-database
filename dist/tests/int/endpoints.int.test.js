"use strict";

var _supertest = _interopRequireDefault(require("supertest"));

var _index = _interopRequireDefault(require("../../index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('endpoint int tests', () => {
  it('should return a 404 error when is404 middleware runs', done => {
    return (0, _supertest.default)(_index.default).get('/graphql').expect('Content-Type', /json/).expect(404, done);
  });
  it('should return a 401 error when a a request is sent to a restricted route without a token', done => {
    return (0, _supertest.default)(_index.default).get('/upload').expect('Content-Type', /json/).expect(401, done);
  });
});