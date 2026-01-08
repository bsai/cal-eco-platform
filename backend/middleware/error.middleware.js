const logger = require('../utils/logger');

function errorMiddleware(error, req, res, next) {
  // check error is an object or string
  const errorObj = error instanceof Error ? error : { message: String(error), status: 500 };
  const { status = 500, message } = errorObj;
  const data = errorObj.data || null;

  // possible status codes are 400-599, default to 500
  const validStatus = Number.isInteger(status) && status >= 400 && status <= 599 ? status : 500;

  logger.error(`Error: ${message || 'Internal server error'}`, {
    path: req.path,
    method: req.method,
    status: validStatus,
    error: errorObj.stack,
    ...(req.id && { requestId: req.id }),
  });

  // if status is not 500, otherwise use generic message
  const errorMessage = validStatus === 500 || !message ? 'Internal server error' : message;

  const errorResponse = {
    success: false,
    status: validStatus,
    message: errorMessage,
    ...(data && { data }),
    ...(req.id && { requestId: req.id }),
  };

  res.status(validStatus).json(errorResponse);
}

module.exports = errorMiddleware;
