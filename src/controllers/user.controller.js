const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, subscriptionService } = require('../services');
const sendSuccessResponse = require('../utils/success');
const { getPreSignedUrl } = require('../middlewares/awsS3Bucket');
const { static_images } = require('../config/config')
const { activity } = require("../config/activities");

const createUser = catchAsync(async (req, res) => {
  if (!req.file) throw new ApiError(httpStatus.BAD_REQUEST, "Please provide profile image!")
  req.body.pic = req.file.location
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'user_type']);
  const options = pick(req.query, ['sortBy', 'limit', 'page','pagination']);
  let result = await userService.queryUsers(filter, options);
  result = JSON.parse(JSON.stringify(result));
  for (i = 0; i < result.results.length; i++) {
    
    result.results[i].pic = await getPreSignedUrl(result.results[i].pic);
    const subscription = await subscriptionService.checkSubscription(result.results[i].id);
    const is_active_subscription = subscription.success ? subscription.isActiveSubscription : false;

    // Set the 'is_active_subscription' field for each user
    result.results[i].is_active_subscription = is_active_subscription;
  }
  sendSuccessResponse(httpStatus.OK, res, "Data fetched successfully.", result)
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if the logged-in user is trying to fetch their own profile
  userService.verifyIds(req.user.id, req.params.userId)

  //checking user subscription
  let is_active_subscription = false
  const subscription = await subscriptionService.checkSubscription(req.params.userId);
  if (subscription.success) { is_active_subscription = subscription.isActiveSubscription }

  // Set the value of isMyProfile manually
  const response = {
    ...user.toJSON(),
    isMyProfile: true, // or false
    is_active_subscription,
  };
  sendSuccessResponse(httpStatus.OK, res, "Data fetched successfully.", response)
});

const updateUser = catchAsync(async (req, res) => {
  // Check if the logged-in user is trying to update their own profile
  userService.verifyIds(req.user.id, req.params.userId)

  if (req.body.skills) {
    req.body.skills = req.body.skills.split(',');
  }
  req.body.pic = static_images.user_profile;
  if (req.file) {
    req.body.pic = req.file.key;
  }
  const user = await userService.updateUserById(req.params.userId, req.body);
  user.pic = await getPreSignedUrl(user.pic);

  //Activity log
  await userService.addActivityLog({
    user: user.id,
    activity: {
      message: activity.UserUpdate,
    }
  });

  sendSuccessResponse(httpStatus.OK, res, "Data updated successfully.", user)
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

/* const addActivityLog = catchAsync(async (req, res) => {
  let response = await userService.addActivityLog(req.body);
  sendSuccessResponse(httpStatus.OK, res, "Activity stored successfully.", response)
}); */

const getActivityLogs = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'pagination']);
  //options.populate = 'user';
  const userId = req.user.id;

  let result = await userService.queryActivity({ user: userId }, options);
  sendSuccessResponse(httpStatus.OK, res, 'Activities fetched successfully.', result);
});

const saveCustomerId = catchAsync(async (req, res) => {
  let user = await userService.saveCustomerId(req.body);
  sendSuccessResponse(httpStatus.OK, res, "Customer id updated successfully.", user);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  saveCustomerId,
  getActivityLogs
  // addActivityLog
};
