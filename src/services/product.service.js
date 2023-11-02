const httpStatus = require('http-status');
const { default: axios } = require('axios');
const ApiError = require('../utils/ApiError');
const { Product } = require('../models');
const config = require('../config/config');
const fs = require('fs')
const path = require('path');
const createProduct = async (productdata) => {
  return Product.create(productdata);
};

const getProducts = async () => {
  return Product.find();
}


const getProductById = async (id) => {

  return Product.findById(id)


};



const updateProductById = async (productId, updateFile,fileName) => {
  
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  console.log("product is:", product);
  const path = product.imagePath;

    fs.unlinkSync(path);

  const baseUrl = `http://localhost:8000/productImages/${fileName}`
  const productData = {
    updateFile,
    imagePath: updateFile,
    imageUrl:baseUrl
  }

  Object.assign(product, productData);
  await product.save();
  return product;
};


const deleteProductById = async (productId) => {
  const product = await getProductById(productId);

    console.log('File deleted successfully');

    await Product.findByIdAndRemove(productId)

    return product;

}


module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
