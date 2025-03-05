class AppError {
  statusCode;
  message;
  details;

  constructor(
    statusCode = 500,
    message = "Internal Server Error",
    details = null
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.details = details;
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      details: this.details,
    };
  }
}

module.exports = { AppError };
