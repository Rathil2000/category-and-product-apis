const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const categoryValidation = require('../../validation/category.validation');
const categoryController = require('../../controllers/category.controller');
const { upload } = require('../../middlewares/awsS3Bucket');


const router = express.Router();

router
  .route('/')
  .post(
   
    validate(categoryValidation.createCategory),
    categoryController.createCategory,)

router
  .route('/list')
  .get(
    categoryController.getCategories)

router
  .route('/:categoryId')
  .get(
 
    categoryController.getCategory)
  .patch(
 
    categoryController.updateCategory)
  .delete(

    categoryController.deleteCategory);


module.exports = router;

