const User = require("../model/user");

const getUserProfile = async (req, res) => {
  try {
    const email = req.query.email;
    const user = await User.find({ email: email }).exec();
    if (user[0]) {
      const toReturnUser = {
        email: user[0].email,
        name: user[0].name,
        status: user[0].status,
        receiveAdvertisements: user[0].receiveAdvertisements,
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

const toggleAdvertisements = async (req, res) => {
  try {
    const email = req.query.email;
    const advertisement = req.query.ads;
    const user = await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          receiveAdvertisements: advertisement,
        },
      }
    );
    if (user) {
      return {
        success: 200,
        message: "Advertisements toggled for user",
      };
    } else {
      return {
        success: 404,
        message: "No user with the given email found",
      };
    }
  } catch (err) {
    console.error("Error stopping advertisement ", err);
    return {
      success: 500,
      message: "Error stopping advertisement",
    };
  }
};

module.exports = {
  getUserProfile,
  toggleAdvertisements,
};
