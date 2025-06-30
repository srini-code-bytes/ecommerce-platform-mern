const rateLimit = require('express-rate-limit');

const otpRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 min in milliseconds
    max: 3, // Limit each user to 3 requests per windowMs
    message: 'More than 3 OTP requests in 15 minutes. Please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req) => {
        // Use user ID or another unique identifier from the request
        return req.user ? req.user.id : req.ip;
    },
});

module.exports = otpRateLimiter;