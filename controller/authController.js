const ErrorHandler = require('../Utils/errorhandler');
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const sendToken = require('../Utils/jwtToken');
const sendEmail = require('../Utils/sendEmail')

exports.signup = catchAsyncErrors(async (req, res, next) => {
    console.log(req.body);
    const newUser = await User.create(req.body)
    .then(newUser => {
        console.log('******', newUser);
        sendToken(newUser,200,res);
    })
    .catch(err => {
        console.log('error in creating a contact', err);
        return res.redirect('back');
    });
    
    // console.log(newUser);
})

exports.login = catchAsyncErrors(async(req, res , next) => {
    const {email, password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler("Please provide email Id & Password for login in!",404))
    }

    const user = await User.findOne({email}).select('password');

    const isMatch = await user.comparePasswordInDb(password, user.password);

    //check id yhe user exists & password matches
    if(!user || !isMatch){
        return next(new ErrorHandler("Incorrect email or password", 400));
    }

    // const token = signToken(user._id)

    // res.status(200).json({
    //     status: 'success',
    //     token,
    //     user
    // })

    sendToken(user,200,res);
})


// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
    console.log("cvzbxvcbzvb")
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
  
    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  });


  // Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
  
    if (!user) {
      return next(new ErrorHander("User not found", 404));
    }
  
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
  
    await user.save({ validateBeforeSave: false });
  
    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;
  
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });
  
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save({ validateBeforeSave: false });
  
      return next(new ErrorHander(error.message, 500));
    }
  });


  // Get User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
  
    res.status(200).json({
      success: true,
      user,
    });
  });


  // update User password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
  
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  
    if (!isPasswordMatched) {
      return next(new ErrorHander("Old password is incorrect", 400));
    }
  
    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHander("password does not match", 400));
    }
  
    user.password = req.body.newPassword;
  
    await user.save();
  
    sendToken(user, 200, res);
  });