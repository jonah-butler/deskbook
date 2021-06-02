const PublicController = require('../controllers/PublicController.js');
const helpers = require('../assets/helpers/helpers.js');

module.exports = (app) => {
  app.get('/public',
  PublicController.publicLanding);

  app.get('/public/category/new', helpers.isLoggedIn,
  PublicController.publicNewCategoryIndex);

  app.get('/public/category/:categoryId',
  PublicController.publicCategoryIndex);

  app.get('/public/category/:categoryId/:faqId',
  PublicController.publicFaqIndex);

  app.get('/public/search/',
  PublicController.publicSearch);
}
