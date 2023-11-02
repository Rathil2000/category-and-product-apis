const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
   
    first_name: {
      type: String,
      required: false,
      trim: true,
    },
    last_name: {
      type: String,
      required: false,
      trim: true,
    },
    status: {
      type: String,
      required: false
    },
    bio: {
      type: String,
      required: false
    },
    pic: {
      type: String,
      required: false,
    },
    about: {
      type: String,
      required: false,
      trim: true,
    },
    mobile_number: {
      type: String,
      required: false,
      validate: {
        validator: function (value) {
          // Regular expression to validate mobile number format
          const regex = /^[0-9]{10}$/;
          return regex.test(value);
        },
        message: 'Invalid mobile number'
      },
      validate(value) {
        if (!validator.isMobilePhone(value)) {
          throw new Error('Invalid mobile number');
        }
      }
    },
    email: {
      type: String,
      required: false,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    user_type: {
      type: String,
      enum: roles,
      default: 'player',
    },
   
    googleAuth: {
      type: String,
      // required: true,
      required: function () {
        return !this.password; // googleAuth is required if password is not provided
      },
      trim: true,
      minlength: 8,
      private: true, // used by the toJSON plugin
    },
    password: {
      type: String,
      required: function () {
        return !this.googleAuth; // password is required if googleAuth is not provided
      },
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    access_token: {
      type: String,
      index: true,
    },
    refresh_token: {
      type: String,
      index: true,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};
userSchema.statics.isMobileTaken = async function (mobile_number, excludeUserId) {
  const user = await this.findOne({ mobile_number, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} googleAuth
 * @returns {Promise<boolean>}
 */
userSchema.methods.isGoogleAuthMatch = async function (googleAuth) {
  const user = this;
  return (user.googleAuth == googleAuth)
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
