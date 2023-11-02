const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { password, confirmPassword } = require('./admin.custom.validation');

const getEvents = {
  params: Joi.object().keys({
    eventProducerId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    name: Joi.string(),
    user_type: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    pagination: Joi.boolean(),
  }),
  body: Joi.object().keys({
    start_date: Joi.date().iso().optional(),
    end_date: Joi.date().iso().optional(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    confirmPassword: Joi.string().required().custom(confirmPassword),
  }),
};

module.exports = {
  getEvents,
  resetPassword,
};
