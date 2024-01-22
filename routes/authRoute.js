const router = require("express").Router();

const { login, register, refresh, verifyToken, pythonServer, nestServerAidashboard,nestServerImaganary,userInfo } = require("../controllers/authCtrl");
const { isAuthorized } = require("../middleware/isAuthorized");

router.post("/login", login);
router.post("/register", register);
router.post("/refresh", refresh);
router.get("/verify-token", verifyToken);
router.patch("/python-service", pythonServer);
router.patch("/nest-ai-dashboard", nestServerAidashboard);
router.patch("/nest-imaganary", nestServerImaganary);
router.get("/get-user-info",isAuthorized, userInfo);

module.exports = router;