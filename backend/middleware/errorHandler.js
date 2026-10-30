import config from "../utils/config.js";

const errorHandler = (err, req, res,next) => {
    const statusCode = err.statusCode || 500;
    
    return res.status(statusCode).json({
        statusCode: statusCode,
        message: err.message,
        error: config.nodeEnv === "development" ? err.stack : null,        
    })
}

export default errorHandler;