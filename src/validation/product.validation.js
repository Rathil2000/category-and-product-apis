const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProduct = {
  body: Joi.object().keys({
    productName: Joi.string().optional(),
    description: Joi.string().optional(),
    image: Joi.string().optional(),
    price: Joi.number().integer().optional(),
    categoryId: Joi.string().optional().custom(objectId),
  }),
};

const getProducts = {
  query: Joi.object().keys({
    productName: Joi.string(),
    user_type: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    pagination: Joi.boolean()
  })};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().optional(),
      start_date: Joi.date().iso().optional().options({ convert: true }),
      end_date: Joi.date().iso().optional().options({ convert: true }),
      price: Joi.string().optional(),
      //location: Joi.array().items(Joi.string()).optional(),
      event: Joi.string().optional().custom(objectId),
    })
    .min(1),
};

const deleteTicket = {
  params: Joi.object().keys({
    ticketId: Joi.string().custom(objectId),
  }),
};

const purchaseTicketResponse = {
  body: Joi.object().keys({
    eventId: Joi.string().custom(objectId),
    ticketId: Joi.string().custom(objectId),
    ticketName: Joi.string().required(),
    ticketPrice: Joi.string().required(),
    stripeResponse: Joi.required()
  }),
};

const checkedInEvent = {
  params: Joi.object().keys({
    ticketPurchaseId: Joi.optional().custom(objectId),
  }),
  body: Joi.object().keys({
    is_app_user: Joi.required(),
    isCheckedIn: Joi.boolean().required(),
    email: Joi.optional(),
  }),
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteTicket,
  purchaseTicketResponse,
  checkedInEvent,
};
