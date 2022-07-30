module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // "500" means internal server error
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
