const { AppError } = require("./AppError");

function errorHandler(err, req, res, next) {
  console.error({ err });

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      details: err.details,
    });
    return;
  }

  res.status(500).json({
    message: "Internal Server Error",
    details: err?.toString(),
  });
}

module.exports = { errorHandler };
