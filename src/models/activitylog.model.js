const mongoose = require('mongoose');
// const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const Product = require('./product.model');
const User = require('./user.model');

const activiyLogSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // This refers to the model name 
    },
    activity: {
      event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event',
        required: false
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: false
      },
      ticketPurchase: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ticket-purchases',
        required: false
      },
      message: { type: String, required: true },
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
activiyLogSchema.plugin(toJSON);
activiyLogSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
// userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
//     const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
//     return !!user;
// };


// eventSchema.pre('save', async function (next) {
//     const user = this;
//     if (user.isModified('password')) {
//         user.password = await bcrypt.hash(user.password, 8);
//     }
//     next();
// });

/**
 * @typedef ActivityLog
 */
const ActivityLog = mongoose.model('activity_logs', activiyLogSchema);

module.exports = ActivityLog;
