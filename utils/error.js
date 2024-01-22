exports.sendInternalServerError = (res, errors= null, options={}) => {
    const { message } = options;
    errorResponse = {
        success: false,
        message: message? message: "Internal Server Error",
        success: false,
        errors: Array.isArray(errors) || !errors ? errors : [errors]
    }
    res.status(500).json(errorResponse);
};

exports.sendBadRequestError = (res, errors= null, options={}) => {
    const { message } = options;
    errorResponse = {
        success: false,
        message: message? message: "Bad Request, Please Check your Request Payload",
        success: false,
        errors: Array.isArray(errors) ? errors : [errors]
    }
    res.status(400).json(errorResponse);
};

exports.sendUnAuthorizedtError = (res, errors= null, options={}) => {
    const { message } = options;
    errorResponse = {
        success: false,
        message: message? message: "Not authorized to use this service",
        success: false,
        errors: Array.isArray(errors) || !errors ? errors : [errors]
    }
    res.status(401).json(errorResponse);
};

exports.sendNotFoundError = (res, errors= null, options={}) => {
    const { message } = options;
    errorResponse = {
        success: false,
        message: message? message: "Not Found",
        success: false,
        errors: Array.isArray(errors) || !errors ? errors : [errors]
    }
    res.status(404).json(errorResponse);
};