const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};



const isEmail = (input) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(input);
};

const validateProductIds = (value, helpers) => {
  // Split the comma-separated string into an array
  const productsArray = value.split(',');
  // Create a Set to automatically handle uniqueness of ticket IDs
  const uniqueProductsSet = new Set();

  for (const id of productsArray) {
    const trimmedId = id.trim();
    const validatedId = objectId(trimmedId, helpers);
    if (validatedId !== trimmedId) {
      // Validation error occurred, return the error
      return validatedId;
    }

    // Add the trimmed ID to the Set (it will automatically handle duplicates)
    uniqueProductsSet.add(trimmedId);
  }

  // Convert the Set back to a comma-separated string of unique IDs
  const validatedIds = Array.from(uniqueProductsSet).join(',');

  return validatedIds;
}

module.exports = {
  objectId,
  password,
  //confirmPassword,
  isEmail,
  validateProductIds
};
