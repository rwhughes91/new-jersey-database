import Response from './setup';

describe('makeResponse function', () => {
  it('should return props when .json is called', () => {
    const res = new Response();
    expect(res.status(404).json({ message: 'Page not found' })).toEqual({
      statusCode: 404,
      message: { message: 'Page not found' },
    });
  });
});
