const allRoles = {
  // user: [],  //old
  admin: ['getUsers', 'manageCategories','getCategories'],
  player: ['purchaseProduct'],  //old
  categoryProducer: ['getUsers', 'manageUsers', 'getCategories', 'manageCategories', 'deleteCategories'],

};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

const timeIntervals = ["month", "year"]

module.exports = {
  roles,
  roleRights,
  timeIntervals,
};
