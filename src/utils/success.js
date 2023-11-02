
module.exports = function sendSuccessResponse(statusCode, res, message, data) {
    res.status(statusCode).json({
        success: true,
        code: statusCode,
        message,
        data
    });
}

