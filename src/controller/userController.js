const User = require("../model/user");

const getUserProfile = async (req, res) => {
  try {
    const email = req.query.email;
    const user = await User.find({ email: email }).exec();
    if (user[0]) {
      console.log(user[0]);
      const toReturnUser = {
        email: user[0].email,
        name: user[0].name,
        status: user[0].status,
      };
      return {
        success: 200,
        message: "User profile",
        data: toReturnUser,
      };
    } else {
      return {
        success: 404,
        message: "User profile not found",
      };
    }
  } catch (err) {
    console.error("Error fetching user profile ", err);
    return {
      success: 500,
      message: "Error fetching user profile",
    };
  }
};

module.exports = {
  getUserProfile,
};
