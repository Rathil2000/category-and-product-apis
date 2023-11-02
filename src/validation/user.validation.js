const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    status: Joi.string().optional(),
    bio: Joi.string().optional(),
    about: Joi.string().optional(),
    pic: Joi.string().optional(),
    mobile_number: Joi.string().optional(),
    email: Joi.string().optional(),
    user_type: Joi.string().required().valid('player', 'eventProducer'),
    skills: Joi.array().items(Joi.string()),
    password: Joi.string().optional().custom(password),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    pagination: Joi.boolean()
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      first_name: Joi.string().optional(),
      last_name: Joi.string().optional(),
      status: Joi.string().optional(),
      bio: Joi.string().optional(),
      about: Joi.string().optional(),
      pic: Joi.string().optional(),
      googleAuth: Joi.string().optional(),
      mobile_number: Joi.string().optional(),
      email: Joi.string().optional(),
      user_type: Joi.string().optional().valid('player', 'eventProducer'),
      skills: Joi.string().optional(),
      password: Joi.string().optional().custom(password),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const activityLog = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    activity: Joi.required(),
  }),
};

const getActivityLogs = {
  query: Joi.object().keys({
    name: Joi.string(),
    user_type: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    pagination : Joi.boolean()
  }),
}

const saveCustomerId = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    customerId: Joi.string().required(),
  })
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  activityLog,
  saveCustomerId,
  getActivityLogs
};
