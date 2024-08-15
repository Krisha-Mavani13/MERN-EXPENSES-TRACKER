const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

//user registration

const usersController = {
  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    //validate
    if (!username || !email || !password) {
      throw new Error("Please all fields are required");
    }
    //check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists");
    }
    //hash the user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //create the user
    const userCreated = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    //send the response
    res.json({
      username: userCreated.username,
      email: userCreated.email,
      id: userCreated._id,
    });
  }),
  //login
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid login credentials");
    }
    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid login credentials");
    }
    //generate a token
    const token = jwt.sign({ id: user._id }, "masynctechKey", {
      expiresIn: "30d",
    });
    //send response
    res.json({
      message: "Login Success",
      token,
      id: user._id,
      email: user.email,
      username: user.username,
    });
  }),

  //profile
  profile: asyncHandler(async (req, res) => {
    console.log(req.user);
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User not found");
    }
    res.json({
      username: user.username,
      email: user.email,
    });
  }),
  changeUserPassword: asyncHandler(async (req, res) => {
    const { newPassword } = req.body;
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User not found");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    //resave
    await user.save({
      validateBeforeSave: false,
    });
    //send the response
    res.json({
      message: "Password Changed Successfully",
    });
  }),
  //update profile
  updateUserProfile: asyncHandler(async (req, res) => {
    const { email, username } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      {
        username,
        email,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User Profile Updated Successfully",
      updatedUser,
    });
  }),
};

module.exports = usersController;
