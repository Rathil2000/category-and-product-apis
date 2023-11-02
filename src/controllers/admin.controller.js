const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const moment = require('moment');
const { getPreSignedUrl } = require('../middlewares/awsS3Bucket');
const { userService, tokenService, emailService, eventService } = require('../services');
const sendSuccessResponse = require('../utils/success');
const httpStatus = require('http-status');
const { User } = require('../models');

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  //Login with Email
  const admin = await authService.adminLogin(email, password);
  const tokens = await tokenService.generateAuthTokens(admin);
  // Fetch the updated user object after generating tokens
  const userDetail = await userService.getUserById(admin.id);

  sendSuccessResponse(httpStatus.OK, res, 'User logged in successfully.', userDetail);
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.adminGenerateResetPasswordToken(req.body.email);
  const response = await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  sendSuccessResponse(httpStatus.OK, res, 'Mail sent, Please check your mail box.');
});

const adminResetPassword = catchAsync(async (req, res) => {
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({
      message: "Password and Confirm password didn't match",
      success: false,
    });
  }
  const { token } = req.query;

  await authService.resetPasswordAdmin(token, password);
  sendSuccessResponse(httpStatus.OK, res, 'Password changed successfully.');
});
const getEvents = catchAsync(async (req, res) => {
  const { start_date, end_date } = req.body;
  let filter = pick(req.query, ['name', 'user_type']);
  if (start_date && end_date) {
    filter = pick(req.body, ['start_date', 'end_date']);
    filter = {
      start_date: {
        $gte: moment(start_date, 'YYYY-MM-DD').toDate(),
      },
      end_date: {
        $gte: moment(end_date, 'YYYY-MM-DD').toDate(),
      },
    };
  }
  if (req.params.eventProducerId) {
    filter.eventProducer = req.params.eventProducerId;
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'pagination']);
  options.mainSelect = 'name start_date end_date about address full_address email_confirmation_body event_image';
  options.populate = [
    {
      path: 'tickets',
      select: 'name start_date end_date price',
    },
    {
      path: 'eventProducer',
      select: 'first_name last_name pic user_type',
    },
  ];
  let result = await eventService.queryEvents(filter, options);
  result = JSON.parse(JSON.stringify(result));
  for (i = 0; i < result.results.length; i++) {
    result.results[i].is_event_owner = result.results[i].eventProducer.id === req.user.id;
    result.results[i].event_image = await getPreSignedUrl(result.results[i].event_image);
  }
  sendSuccessResponse(httpStatus.OK, res, 'Event data fetched successfully.', result);
});

const logout = catchAsync(async (req, res) => {
  const adminId = req.user.id;
  const admin = await User.findByIdAndUpdate(adminId, { access_token: null, refresh_token: null }, { new: true });
  if (!admin) {
    return res.status(404).json({ message: 'admin not found' });
  }
  sendSuccessResponse(httpStatus.OK, res, 'Admin logged out successfully', admin);
});
const getUsers = catchAsync(async (req, res) => {
  let { page, limit, pagination } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  pagination = pagination !== 'false';

  let query = {};
  if (!pagination) {
    // Fetch all records
    const users = await User.find(query);
    const formatedUser = users.map((user) => ({
      _id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      pic: user.pic,
      mobile_number: user.mobile_number,
      email: user.email,
      user_type: user.user_type,
      isEventProducer: user.user_type === 'eventProducer',
    }));
    if (!formatedUser) {
      return res.status(500).json({
        success: false,
        message: 'No data Found',
      });
    }
    const paginationInfo = {
      currentPage: page,
      totalPages: Math.ceil((await User.countDocuments(query)) / limit),
    };
    sendSuccessResponse(httpStatus.OK, res, 'fetch', {
      users: formatedUser,
      pagination: paginationInfo,
    });
  } else {
    // Fetch paginated records
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const users = await User.find(query).skip(startIndex).limit(limit);
    const formatedUser = users.map((user) => ({
      _id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      pic: user.pic,
      mobile_number: user.mobile_number,
      email: user.email,
      isEventProducer: user.user_type === 'eventProducer',
    }));
    if (!formatedUser) {
      return res.status(500).json({
        success: false,
        message: 'No data Found',
      });
    }

    const paginationInfo = {
      currentPage: page,
      totalPages: Math.ceil((await User.countDocuments(query)) / limit),
    };

    sendSuccessResponse(httpStatus.OK, res, 'fetch', {
      users: formatedUser,
      pagination: paginationInfo,
    });
  }
});
module.exports = {
  login,
  forgotPassword,
  adminResetPassword,
  getEvents,
  logout,
  getUsers,
};
