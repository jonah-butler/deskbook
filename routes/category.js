const CategoryController = require('../controllers/CategoryController.js');
const helpers = require('../assets/helpers/helpers.js');

module.exports = (app) => {
  app.get('/category/:id/new', helpers.isLoggedIn,
  CategoryController.newGet);

  app.get('/category/new-parent', helpers.isLoggedIn,
  CategoryController.newParent);

  app.get('/category/public/', helpers.isLoggedIn,
  CategoryController.publicIndex);

  app.post('/category/new', helpers.isLoggedIn,
  CategoryController.newPost);

  app.get('/category/:categoryId/edit', helpers.isLoggedIn,
  CategoryController.editGet);

  app.put('/category/:categoryId/edit', helpers.isLoggedIn, 
  CategoryController.editUpdate);

  app.delete('/category/:categoryId/edit', helpers.isLoggedIn,
  CategoryController.delete);
}