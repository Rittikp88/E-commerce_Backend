const ErrorHander = require("../Utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
//   const { token } = req.cookies;

//   if (!token) {
//     return next(new ErrorHander("Please Login to access this resource", 401));
//   }

//   const decodedData = jwt.verify(token, 'asg7-hnkrg-53jjed7-78gggfdfd');

//   req.user = await User.findById(decodedData.id);

//   next();
// });

exports.isAuthenticatedUser = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(
      new ErrorHander(
        "Please provide a valid token to access this resource",
        401
      )
    );
  }

  console.log(token);
  console.log(process.env.JWT_SECRET);

  try {
    const decodedData = jwt.verify(token, "asg7-hnkrg-53jjed7-78gggfdfd");
    req.user = await User.findById(decodedData.id);
    next();
  } catch (error) {
    return next(new ErrorHander("Invalid token. Please login again.", 401));
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }

    next();
  };
};