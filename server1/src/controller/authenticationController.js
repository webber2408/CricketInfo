const jwt = require("jsonwebtoken");
const User = require("../model/user");

const jwtKey = "rahul_aruvansh";
const jwtExpiry = 3000;

const login = async (req, res) => {
  try {
    const { userEmail, password } = req.body;
    const user = await User.find({ email: userEmail }).exec();
    if (!user[0]) {
      return {
        success: 404,
        message: "User not found, please register",
      };
    }
    if (user[0].password != password) {
      return {
        success: 401,
        message: "Incorrect Password",
      };
    }
    const token = jwt.sign({ userEmail }, jwtKey, {
      algorithm: "HS256",
      expiresIn: jwtExpiry,
    });
    return {
      success: 200,
      message: "User logged in successfully",
      token: token,
      email: userEmail,
      showAds: user[0].receiveAdvertisements,
    };
  } catch (err) {
    console.error("login failed ", err);
    return {
      success: 500,
      message: "Login failed",
    };
  }
};

const register = async (req, res) => {
  try {
    const toSaveUser = req.body;
    toSaveUser.status = 1; // 1 -> Active 2 -> Inactive
    toSaveUser.receiveAdvertisements = true;
    if (!toSaveUser.email || !toSaveUser.password || !toSaveUser.name) {
      return {
        success: 404,
        message: "Please supply all information",
      };
    }
    const user = await User.find({ email: toSaveUser.email }).exec();
    if (user[0]) {
      return {
        success: 422,
        message: "User already registered, please login",
      };
    }
    toSaveUser.subscribedTopicIds = [];
    const result = await new User({ ...toSaveUser }).save();
    if (result) {
      return {
        success: 200,
        message: "User registered successfully",
      };
    } else {
      return {
        success: 500,
        message: "User registration failed",
      };
    }
  } catch (err) {
    console.error("Registration failed ", err);
    return {
      success: 500,
      message: "Registration failed",
    };
  }
};

module.exports = {
  login,
  register,
};
