const jwt = require('jsonwebtoken');
const { sendUnAuthorizedtError } = require('../utils/error')

exports.isAuthorized = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return sendUnAuthorizedtError(res, null, {
                message: "Authorization Token is Missing",
            });
        }

        const payload = jwt.verify(authorization, process.env.JWT_SECRET_KEY, (err, payload) => {
            if (err) {
                return sendUnAuthorizedtError(res, err, {
                    message: "Authorization Token is not Valid",
                });
            }
            Object.assign(req.body, payload)
            next();
        });
    } catch {
        res.status(401).json({
            success: false,
            error: new Error('Invalid request!')
        });
    }
};