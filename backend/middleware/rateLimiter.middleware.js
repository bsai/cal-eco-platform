const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');
const config = require('../config');

const RATE_LIMIT_SKIP_PATHS = ['/'];

const apiLimiter = rateLimit({
  windowMs: config.rateLimiter.duration,
  max: config.rateLimiter.max,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return RATE_LIMIT_SKIP_PATHS.some(path => path.toLowerCase() === req.path.toLowerCase().replace(/\/$/, ''))
  },
  handler: (req, res) => {
    logger.warn(`[RateLimiter] Limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      status: 429,
      message: `Too many requests. Max ${config.rateLimiter.max} requests per ${config.rateLimiter.duration / 1000 / 60} minutes allowed`,
    });
  },
});

module.exports = apiLimiter;
