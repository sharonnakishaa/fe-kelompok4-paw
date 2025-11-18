const { constants } = require("./constants");

const errorHandler = (err, req, res, next) => {
    // Log error untuk debugging di Vercel
    console.error('Error Handler:', {
        name: err.name,
        message: err.message,
        code: err.code,
        path: req.path,
        method: req.method
    });

    let statusCode = res.statusCode && res.statusCode >= 400 ? res.statusCode : 500;
    
    let message = err.message;
    let title = "Server Error";

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = constants.NOT_FOUND;
        message = `Resource not found. Invalid ID format.`;
        title = "Not Found";
    }

    if (err.name === 'ValidationError') {
        statusCode = constants.VALIDATION_ERROR;
        message = Object.values(err.errors).map(val => val.message).join(', ');
        title = "Validation Failed";
    }

    if (err.code === 11000) {
        statusCode = constants.VALIDATION_ERROR;
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate field value entered for '${field}'. Please use another value.`;
        title = "Duplicate Key Error";
    }

    // Database connection error
    if (err.message && err.message.includes('Database connection failed')) {
        statusCode = 503;
        title = "Service Unavailable";
        message = "Database connection is currently unavailable. Please try again later.";
    }

    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            title = "Validation Failed";
            break;
        case constants.UNAUTHORIZED:
            title = "Unauthorized";
            break;
        case constants.FORBIDDEN:
            title = "Forbidden";
            break;
        case constants.NOT_FOUND:
            title = "Not Found";
            break;
    }
    
    res.status(statusCode).json({
        title: title,
        message: message,
        stackTrace: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = errorHandler;