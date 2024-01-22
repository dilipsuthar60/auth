const {
  sendBadRequestError,
  sendInternalServerError,
  sendNotFoundError,
  sendUnAuthorizedtError,
} = require("../utils/error");
const Auth = require("../model/authModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return sendBadRequestError(res);
    }
    const user = await Auth.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email Not Found!",
      });
    }

    const payload = {
      id: user._id.toString(),
      email: user.email,
    };
    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      return res.status(403).json({
        success: false,
        message: "Password Incorrect",
      });
    }

    let accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "10m",
    });
    let refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
      expiresIn: "14d",
    });
    const response = {
      success: true,
      message: "Login Successfully",
      user,
      accessToken,
    };

    user.password = undefined;
    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000, }).header('Authorization', accessToken)
      .send(response);
  } catch (error) {
    console.error(error.message);
    sendInternalServerError(res, error);
  }
};
exports.register = async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    if (!email || !password) {
      return sendBadRequestError(res);
    }
    const existingUser = await Auth.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists",
      });
    }

    let hashPassword = await bcrypt.hash(password, 10);

    const newUser = await Auth.create({
      username,
      email,
      password: hashPassword,
      service: {
        chatBot: true,
        imaganary: false,
        aiDashboard: true
      }
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error.message);
    sendInternalServerError(res, error);
  }
};

exports.refresh = async (req, res) => {
  const refreshToken = req.cookies['refreshToken'];

  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });
  try {
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY,
      async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Forbidden" });

        const foundUser = await Auth.findOne({ _id: decoded.id });

        if (!foundUser)
          return res.status(401).json({ message: "Unauthorized" });
        const payload = {
          id: decoded.id,
          email: decoded.email,
        };

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
          expiresIn: "2d",
        });

        res.header('Authorization', accessToken).send(decoded);
      }
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "something went wrong." });
  }
};

exports.logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) return res.status(204).json({ message: "No content" });
  res.clearCookie("refrestoken", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

exports.verifyToken = async (req, res) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.send(false)
    }

    jwt.verify(authorization, process.env.JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        // return sendUnAuthorizedtError(res, err, {
        //   message: "Authorization Token is not Valid",
        // });
        return res.send(false)
      }
      return res.status(200).send(true)
    });
  } catch (error) {
    sendInternalServerError(res, error);
  }

}

exports.pythonServer = async (req, res) => {
  const { authorization } = req.headers;
  try {
    if (!authorization) {
      return sendUnAuthorizedtError(res, null, {
        message: "Authorization Token is Missing",
      });
    }
    const payload = jwt.verify(authorization, process.env.JWT_SECRET_KEY, async (err, payload) => {
      if (err) {
        return sendUnAuthorizedtError(res, err, {
          message: "Authorization Token is not Valid",
        });
      }
      const user = await Auth.updateOne({ email: payload.email },
        { $set: { 'service.servicePython': true, updatedAt: Date.now() } }, { new: true })
      return res.status(200).json({ success: true, message: "python service update" })
    });
  } catch (error) {

  }
}
exports.nestServerImaganary = (req, res) => {
  const { authorization } = req.headers;
  try {
    if (!authorization) {
      return sendUnAuthorizedtError(res, null, {
        message: "Authorization Token is Missing",
      });
    }
    const payload = jwt.verify(authorization, process.env.JWT_SECRET_KEY, async (err, payload) => {
      if (err) {
        return sendUnAuthorizedtError(res, err, {
          message: "Authorization Token is not Valid",
        });
      }

      const user = await Auth.updateOne({ email: payload.email },
        { $set: { 'service.serviceNestImaganary': true, updatedAt: Date.now() } }, { new: true })
      return res.status(200).json({ success: true, message: "nest service update" })
    });
  } catch (error) {

  }
}
exports.nestServerAidashboard = (req, res) => {
  const { authorization } = req.headers;
  try {
    if (!authorization) {
      return sendUnAuthorizedtError(res, null, {
        message: "Authorization Token is Missing",
      });
    }
    const payload = jwt.verify(authorization, process.env.JWT_SECRET_KEY, async (err, payload) => {
      if (err) {
        return sendUnAuthorizedtError(res, err, {
          message: "Authorization Token is not Valid",
        });
      }

      const user = await Auth.updateOne({ email: payload.email },
        { $set: { 'service.serviceNestImaganary': true, updatedAt: Date.now() } }, { new: true })
      return res.status(200).json({ success: true, message: "nest service update" })
    });
  } catch (error) {

  }
}
exports.userInfo = async (req, res) => {
  try {
    const user = await Auth.findOne({ email: req.body.email }, { password: 0 });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    }
    return res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    console.error(error);
  }
}
