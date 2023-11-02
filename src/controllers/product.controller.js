const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService, userService, categoryService, emailService } = require('../services');
const sendSuccessResponse = require('../utils/success');
const config = require('../config/config');
const { Product, ProductPurchaseNonApp } = require('../models');
const multer = require("multer");
const path = require("path");


const createProduct = catchAsync(async (req, res) => {
  const baseUrl = `http://localhost:8000/productImages/${req.file.filename}`
  const data = {
    productName: req.body.productName,
    description: req.body.description,
    price: req.body.price,
    imagePath: req.file.path,
    categoryId: req.body.categoryId,
    imageUrl: baseUrl
  }

  const product = await productService.createProduct(data);

  sendSuccessResponse(httpStatus.CREATED, res, "Product created successfully.", product)

});

const getProducts = catchAsync(async (req, res) => {

  const data = {
    productName: req.body.productName,
    description: req.body.description,
    price: req.body.price,

  }

  const result = await productService.getProducts(data);

  sendSuccessResponse(httpStatus.OK, res, "Data fetched successfully.", result)
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  sendSuccessResponse(httpStatus.OK, res, "Data fetched successfully.", product)
});

const updateProduct = catchAsync(async (req, res) => {
console.log("req.file is:",req.file.path);

  const product = await productService.updateProductById(req.params.productId, req.file.path,req.file.filename);
  console.log("product is:",product);

  sendSuccessResponse(httpStatus.OK, res, "Data updated successfully.", product)
});

const deleteProduct = catchAsync(async (req, res) => {

  await productService.deleteProductById(req.params.productId);
  sendSuccessResponse(httpStatus.OK, res, "Data deleted successfully.")
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Images')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) 
}
})

const upload = multer({ storage: storage }).single("imagePath")

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  upload
};
