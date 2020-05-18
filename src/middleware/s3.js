export default (s3) => {
  return (req, res, next) => {
    req.s3 = s3;
    next();
  };
};
