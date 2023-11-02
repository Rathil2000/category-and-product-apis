const httpStatus = require('http-status');
const mongoose = require('mongoose');
const moment = require('moment');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Ticket = require('../models/product.model');
const { categoryService, userService, ticketService } = require('../services');
const sendSuccessResponse = require('../utils/success');
const { getPreSignedUrl } = require('../middlewares/awsS3Bucket');
const { static_images } = require('../config/config');
const { activity } = require('../config/activities');


const createCategory = catchAsync(async (req, res) => {

  const category = await categoryService.createCategory(req.body);

  category.about = req.body.about || "About category";
  await category.save();

  sendSuccessResponse(httpStatus.CREATED, res, 'Category created successfully.', category);
});

const getCategories = catchAsync(async (req, res) => {

  const data = {
    categoryName: req.body.categoryName,
    description: req.body.description,

  }

  const result = await categoryService.getCategories(data);
  sendSuccessResponse(httpStatus.OK, res, 'Category data fetched successfully.', result);
});

const getCategory = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.categoryId);

  sendSuccessResponse(httpStatus.OK, res, 'Data fetched successfully.', category);
});

const updateCategory = catchAsync(async (req, res) => {


  const category = await categoryService.updateCategoryById(req.params.categoryId, req.body);


  sendSuccessResponse(httpStatus.OK, res, "Data updated successfully.", category)



});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategoryById(req.params.categoryId);
  sendSuccessResponse(httpStatus.OK, res, 'Data deleted successfully.');
});

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory


};
