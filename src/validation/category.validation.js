const Joi = require('joi');
const { objectId, validateProductIds } = require('./custom.validation');

const createCategory = {
  body: Joi.object().keys({
    categoryName: Joi.string(),
   
    description: Joi.string().optional(),
   
  }),

};

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
    pagination : Joi.boolean()
  }),
  body: Joi.object()
    .keys({
      start_date: Joi.date().iso().optional(),
      end_date: Joi.date().iso().optional()
    })
};

const getEvent = {
  params: Joi.object().keys({
    eventId: Joi.string().custom(objectId),
  }),
};

const updateEvent = {
  params: Joi.object().keys({
    eventId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().optional(),
      start_date: Joi.date().iso().optional().options({ convert: true }),
      end_date: Joi.date().iso().optional().options({ convert: true }),
      about: Joi.string().optional(),
      address: Joi.string().optional(),
      full_address: Joi.string().optional(),
      email_confirmation_body: Joi.string().optional(),
      eventProducer: Joi.string().optional().custom(objectId),
      tickets: Joi.string().optional().custom(validateProductIds),
    })
    .min(1),
  file: Joi.object().keys({
    event_image: Joi.string().optional(),
  })
};

const deleteEvent = {
  params: Joi.object().keys({
    eventId: Joi.string().custom(objectId),
  }),
};

const getTicketHolders = {
  params: Joi.object().keys({
    eventId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    name: Joi.string(),
    user_type: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    pagination : Joi.boolean()
  }),
}

module.exports = {
  createCategory,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  getTicketHolders
};
