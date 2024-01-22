const Auth = require("../model/authModel");
exports.isAuthorizedForNestImaganary= async (req, res, next) => {
    
    const { authorization } = req.headers;
    try {
        if (!authorization) {
            return sendUnAuthorizedtError(res, null, {
                message: "Authorization Token is Missing",
            });
        }
        const user = await Auth.findOne({ _id: req.body.id});
        if (user && user.service.imaganary) {
            next();
        } else {
            res.status(403).send('Forbidden - You do not have access to nestImaganaryServerProxy');
        }
    } catch (error) {
        res.status(401).json({
            success: false,
            error: new Error('Invalid request!')
        });
    }
};