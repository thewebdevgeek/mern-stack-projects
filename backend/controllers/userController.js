import asyncHandler from "express-async-handler";
// import jwt token creator
import generateToken from "../utils/generateToken.js";
// import user model
import User from "../models/userModel.js";
//@desc  Auth User &get token
//@route POST /api/users/login
//@access Public
const authUser = asyncHandler(async (req, res) => {
  // when we set a form and send from the front end we can access the body of request
  const { email, password } = req.body;
  // find user one document which matches the email
  const user = await User.findOne({ email });
  // check if user exists and make sure password sent in request matches the user's password in db
  //we send a plain text password but the password in db is encrypted so we need to use bcrypt
  //we do this check inthe schema using schema.methods.<function_name> syntax
  if (user && (await user.matchPassword(password))) {
    //   we can check the password check in the model
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      // the token will have the user's id embedded in it
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});
//@desc  Get user profile
//@route GET /api/users/profile
//@access Private
const getUserProfile = asyncHandler(async (req, res) => {
  //find the user by id
  const user = await User.findById(req.user._id);
  // res.send("Success");
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or password");
  }
});
export { authUser, getUserProfile };
