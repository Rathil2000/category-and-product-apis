const catchAsync = require('../utils/catchAsync');
const sendSuccessResponse = require('../utils/success');
const httpStatus = require('http-status');
const Event = require('../models/category.model');
const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();
const categories = catchAsync(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const totalEvents = await Event.countDocuments();
  let query = {};

  if (req.body.start_date && req.body.end_date) {
    query = {
      start_date: { $gte: new Date(req.body.start_date) },
      end_date: { $lte: new Date(req.body.end_date) },
    };
  }
  const events = await Event.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('tickets').populate({
      path : "eventProducer",
      model: "User",
      select : "first_name last_name"
    });
  const eventsWithPresignedURLs = events.map((event) => {
    if (event.event_image) {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: event.event_image,
        Expires: 3600, // URL expiration time in seconds
      };
      event.event_image = s3.getSignedUrl('getObject', params);
    }
    return event;
  });

  const result = {
    currentPage: page,
    totalPage: Math.ceil(totalEvents / limit),
    totalEvents,
    events: eventsWithPresignedURLs,
  };
  sendSuccessResponse(httpStatus.OK, res, 'fetched', result);
});

module.exports = { categories };
