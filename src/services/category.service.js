const httpStatus = require('http-status');
const moment = require('moment');
const config = require('../config/config');
const { Category, Product } = require('../models');
const ApiError = require('../utils/ApiError');
const { default: axios } = require('axios');


const createCategory = async (categoryData) => {

  return Category.create(categoryData);
};

const getCategories = async () => {
  return Category.find();
}



const getCategoryById = async (id) => {
  return Category.findById(id)

};


const updateCategoryById = async (categoryId, updateBody) => {
  const category = await getCategoryById(categoryId);
  
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'category not found');
  }
  Object.assign(category, updateBody);
  await category.save();
  return category;
};

const deleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'category not found');
  }
  await Category.findByIdAndRemove(categoryId)
  return category;
};




module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
