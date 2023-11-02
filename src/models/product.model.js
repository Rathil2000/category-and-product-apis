const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const Category = require('./category.model');


const productSchema = mongoose.Schema(
    {
        productName: { type: String, required: false, },
        description: { type: String, required: false },
        price: { type: Number, required: false },
        imagePath:{type:String, required:false},
        categoryId:{type:String, required:false},
        imageUrl:{type:String,required:false}
    },
    {
        timestamps: true,
    }
);


const Product = mongoose.model('product', productSchema);

module.exports = Product;
