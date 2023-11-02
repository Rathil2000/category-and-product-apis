const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validation/product.validation');
const productController = require('../../controllers/product.controller');

const path = require('path');

const router = express.Router();


router
  .route('/')
  .post(
    // auth('manageCategories'),
    validate(productValidation.createProduct),
    productController.upload,productController.createProduct)

router
  .route('/list')
  .get(
   // auth(),
    // validate(productValidation.getProducts),
    productController.getProducts)

router
  .route('/:productId')
  .get(
    // auth(),
    // validate(productValidation.getProduct),
    productController.getProduct)
  .patch(
    // auth('manageEvents'),
    // validate(productValidation.updateProduct),
    productController.upload,productController.updateProduct)
  .delete(
    // auth(),
    // validate(productValidation.deleteTicket),
    productController.deleteProduct);
module.exports = router;

