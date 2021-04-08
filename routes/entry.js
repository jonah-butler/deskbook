const EntryController = require('../controllers/EntryController.js');
const helpers = require('../assets/helpers/helpers.js');

module.exports = (app) => {
  app.get('/entries', helpers.isLoggedIn,
  EntryController.index);

  app.post('/entries', helpers.isLoggedIn,
  EntryController.post);

  app.get('/entries/:id/new', helpers.isLoggedIn,
  EntryController.new);

  app.get('/entries/:id', helpers.isPublicCategory,
  EntryController.categoryIndex);

  app.get('/entries/:categoryId/:id', helpers.isPublicEntry,
  EntryController.faqIndex);

  app.get("/entries/:headerCategory/:id/edit", helpers.isLoggedIn,
  EntryController.editIndex);

  app.delete("/entries/:category/:id/edit", helpers.isLoggedIn,
  EntryController.editDelete);

  app.put("/entries/:headerCategory/:id", helpers.isLoggedIn,
  EntryController.editUpdate);
}
