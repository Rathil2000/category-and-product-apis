const httpStatus = require('http-status');
const { User, ActivityLog } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  console.log(userBody);
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email, isEmail) => {
  return User.findOne({ email });
};

/**
 * Get user by mobile number
 * @param {string} mobile_number
 * @returns {Promise<User>}
 */

const getUserByMobileNumber = async (mobile_number) => {
  return User.findOne({ mobile_number });
}

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await User.findByIdAndRemove(userId)
  // await user.remove();
  return user;
};

const addActivityLog = async (data) => {
  const activityLog = await ActivityLog.create(data);
  return activityLog;
};

const queryActivity = async (filter, options) => {
  const activities = await ActivityLog.paginate(filter, options);
  return activities;
};

const verifyIds = (existingId, requestedId) => {
  if (existingId !== requestedId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized to perform this action.');
  }
};
const saveCustomerId = async (body) => {
  const user = await getUserById(body.userId);
  user.customer_id = body.customerId;
  await user.save();
  // const filter = { _id: body.userId };
  // const update = { customer_id: body.customerId };
  // const options = { upsert: true, new: true };

  // const updatedUser = await User.findOneAndUpdate(filter, update, options);

  return user;
  // return updatedUser;
};
const getUserFindOne = async (filter) => {
  return await User.findOne(filter)
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  getUserByMobileNumber,
  updateUserById,
  deleteUserById,
  verifyIds,
  saveCustomerId,
  getUserFindOne,
  addActivityLog,
  queryActivity,
};
