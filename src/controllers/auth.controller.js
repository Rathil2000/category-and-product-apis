const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../services');
const sendSuccessResponse = require('../utils/success');
const ApiError = require('../utils/ApiError');
const { appConfig } = require("../config/config");
const { activity } = require("../config/activities");

const register = catchAsync(async (req, res) => {

  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
 
  res.status(httpStatus.CREATED).send({ user, tokens });
});


const appConfiguration = catchAsync(async (req, res) => {
  sendSuccessResponse(httpStatus.OK, res, "App configuration.", appConfig)
});

const login = catchAsync(async (req, res) => {
  const { emailOrMobile, password } = req.body;

  //Login with Email or Mobile
  const user = await authService.loginUserWithEmailOrMobileNo(emailOrMobile, password);
  const tokens = await tokenService.generateAuthTokens(user);

  // Fetch the updated user object after generating tokens
  const userDetail = await userService.getUserById(user.id);

  sendSuccessResponse(httpStatus.OK, res, "User logged in successfully.", userDetail)
});


const googleSignupLogin = catchAsync(async (req, res) => {
  const { email, googleAuth } = req.body;
  //1.check user exist
  // const checkUserExist = await userService.checkUserExist(email);
  let user = await userService.getUserByEmail(email);

  // let user
  // if (checkUserExist) {
  if (user) {
    //1.1.if exist match googleAuth and login
    await authService.loginUserWithGoogleAuth(user, googleAuth);
  } else {
    //1.2.if not exist: create/signup and login
    if (!googleAuth) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Please provide auth!")
    }
    user = await userService.createUser(req.body);
  }
  //2.login
  await tokenService.generateAuthTokens(user);

  // Fetch the updated user object after generating tokens
  const userDetail = await userService.getUserById(user.id);

  //Activity log
  await userService.addActivityLog({
    user: user.id,
    activity: {
      message: activity.Login,
    }
  });
  sendSuccessResponse(httpStatus.OK, res, "User logged in successfully.", userDetail)
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  sendSuccessResponse(httpStatus.OK, res, "User logged out successfully.")
});

const refreshTokens = catchAsync(async (req, res) => {
  const token = await authService.refreshAuth(req.body.refreshToken);
  sendSuccessResponse(httpStatus.OK, res, "Token generated successfully.", token)
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  sendSuccessResponse(httpStatus.OK, res, "Mail sent, Please check your mail box.")
});

const resetPassword = catchAsync(async (req, res) => {
  const { password } = req.body;
  const { token } = req.query;

  await authService.resetPassword(token, password);
  sendSuccessResponse(httpStatus.OK, res, "Password changed successfully.")
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  appConfiguration,
  login,
  googleSignupLogin,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
