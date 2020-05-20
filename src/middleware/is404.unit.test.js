import is404 from './is404';
import Response from '../tests/setup';

const createReq = (path = null, method = null) => {
  return {
    path,
    method,
  };
};

describe('is404 middleware', () => {
  let res;
  beforeEach(() => {
    res = new Response();
  });

  it('should return json when not a post request to graphql', () => {
    expect(is404(createReq('/graphql', 'GET'), res, () => {})).toEqual({
      statusCode: 404,
      message: { message: 'Page not found' },
    });
  });
  it('should pass when posting to /graphql', () => {
    expect(is404(createReq('/graphql', 'POST'), res, () => {})).toBeUndefined();
  });
});
