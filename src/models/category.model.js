const mongoose = require('mongoose');
// const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const User = require('./user.model');
const Product = require('./product.model');



const categorySchema = mongoose.Schema(
    {
        categoryName: { type: String, required: false, trim: true, },
       
        description: { type: String, required: false },
       
   
    },
    {
        timestamps: true,
    }
);



const Category = mongoose.model('category', categorySchema);

module.exports = Category;
