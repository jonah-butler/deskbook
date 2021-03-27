const CategoryController = require('../controllers/CategoryController.js');
const helpers = require('../assets/helpers/helpers.js');

module.exports = (app) => {
  app.get('/category/:id/new', helpers.isLoggedIn,
  CategoryController.newGet);

  app.get('/category/:id/move', helpers.isLoggedIn,
  CategoryController.getMove);

  app.post('/category/:id/move', helpers.isLoggedIn,
  CategoryController.move);

  app.get('/category/new-parent', helpers.isLoggedIn,
  CategoryController.newParent);

  app.get('/category/new-parent-private', helpers.isLoggedIn,
  CategoryController.newPrivateParent);

  app.get('/category/public/', helpers.isLoggedIn,
  CategoryController.publicIndex);

  app.get('/category/private/', helpers.isLoggedIn,
  CategoryController.privateIndex);

  app.post('/category/new', helpers.isLoggedIn,
  CategoryController.newPost);

  app.get('/category/:categoryId/edit', helpers.isLoggedIn,
  CategoryController.editGet);

  app.put('/category/:categoryId/edit', helpers.isLoggedIn,
  CategoryController.editUpdate);

  app.delete('/category/:categoryId/edit', helpers.isLoggedIn,
  CategoryController.delete);
}
