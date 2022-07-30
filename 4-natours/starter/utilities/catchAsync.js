module.exports = catchAsync = (fn) => {
  return (req, res, next) => {
    // new anonymous function
    fn(req, res, next).catch(next);
  };
};
