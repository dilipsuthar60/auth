const Auth = require("../model/authModel");
exports.isAuthorizedForNestAiDashboard= async (req, res, next) => {

    const { authorization } = req.headers;
    try {
        if (!authorization) {
            return sendUnAuthorizedtError(res, null, {
                message: "Authorization Token is Missing",
            });
        }
        const user = await Auth.findOne({ _id: req.body.id });

        if (user && user.service.aiDashboard) {
            next();
        } else {
            res.status(403).send('Forbidden - You do not have access to pythonServerProxy');
        }
    } catch (error) {
        res.status(401).json({
            success: false,
            error: new Error('Invalid request!')
        });
    }
};