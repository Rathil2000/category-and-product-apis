const Joi = require('joi');
const { password, confirmPassword } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    mobile_number: Joi.string().required(),
    user_type: Joi.string().optional(),
  }),
};

const login = {
  body: Joi.object().keys({
    emailOrMobile: Joi.string().required(),
    password: Joi.string().required(),
    loginType: Joi.string().optional(),
    deviceToken: Joi.string().optional(),
    version: Joi.string().optional(),
    deviceInfo: Joi.string().optional(),
    googleToken: Joi.string().optional(),
    isMyProfile: Joi.boolean().optional(),
  }),
};
const adminLogin = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
const googleSignupLogin = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    googleAuth: Joi.string().required(),
    mobile_number: Joi.string().optional(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};
const adminForgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    //confirmPassword: Joi.string().required().custom(confirmPassword),
  }),
};
const adminResetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    //confirmPassword: Joi.string().required().custom(confirmPassword),
  }),
};
const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  googleSignupLogin,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  adminLogin,
  adminForgotPassword,
  adminResetPassword,
};
