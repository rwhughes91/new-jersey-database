export default (req, res, next) => {
  if (req.path !== '/grapqhl' && req.method !== 'POST') {
    return res.status(404).json({ message: 'Page not found' });
  }
  next();
};
