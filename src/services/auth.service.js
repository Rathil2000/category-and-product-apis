const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { isEmail, password } = require('../validation/custom.validation');
const { email } = require('../config/config');

/**
 * Login with username and password
 * @param {string} emailOrMobile
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailOrMobileNo = async (emailOrMobile, password) => {
  let user;
  // Check if the input is an email or mobile number
  if (isEmail(emailOrMobile)) {
    user = await userService.getUserByEmail(emailOrMobile);
  } else {
    user = await userService.getUserByMobileNumber(emailOrMobile);
  }

  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  if (!(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
  }
  return user;
};

const adminLogin = async (email, password) => {
  let admin;
  admin = await userService.getUserByEmail(email);
  if (!admin) throw new ApiError(httpStatus.BAD_REQUEST, 'Admin not found');
  if (!(await admin.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
  }
  return admin;
};
/**
 * Login with google
 * @param {Promise<User>} user
 * @param {string} googleAuth
 * @returns {Promise<User>}
 */
const loginUserWithGoogleAuth = async (user, googleAuth) => {
  if (!(await user.isGoogleAuthMatch(googleAuth))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication failed!');
  }

  return true;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await User.findOne({ refresh_token: refreshToken });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  // For example, you can update the refresh_token field to null
  refreshTokenDoc.refresh_token = null;
  await refreshTokenDoc.save();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const payload = tokenService.verifyToken(refreshToken);
    const user = await userService.getUserById(payload.sub);
    if (!user) {
      throw new Error('User not found');
    }

    return tokenService.generateAccessToken(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Refresh token is invalid');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @param {string} confirmPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken);
    const user = await userService.getUserById(resetPasswordTokenDoc.sub);
    if (!user) {
      throw new Error();
    }

    await userService.updateUserById(user.id, { password: newPassword });
    // await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    // if (error.message === 'New password and confirm password must be same') {
    //   throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    // }
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};
const resetPasswordAdmin = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken);
    const admin = await userService.getUserById(resetPasswordTokenDoc.sub);
    if (!admin) {
      throw new Error();
    }

    await userService.updateUserById(admin.id, { password: newPassword });
    // await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    // if (error.message === 'New password and confirm password must be same') {
    //   throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    // }
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

module.exports = {
  loginUserWithEmailOrMobileNo,
  loginUserWithGoogleAuth,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
  adminLogin,
  resetPasswordAdmin,
};
