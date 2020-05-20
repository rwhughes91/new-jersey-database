import request from 'supertest';
import server from '../../index';

describe('endpoint int tests', () => {
  it('should return a 404 error when is404 middleware runs', (done) => {
    return request(server)
      .get('/graphql')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
  it('should return a 401 error when a a request is sent to a restricted route without a token', (done) => {
    return request(server)
      .get('/upload')
      .expect('Content-Type', /json/)
      .expect(401, done);
  });
});
