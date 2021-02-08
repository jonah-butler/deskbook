const SearchController = require('../controllers/SearchController.js');
const helpers = require('../assets/helpers/helpers.js');

module.exports = (app) => {
  app.get('/search', helpers.isLoggedIn,
    SearchController.index);

  app.get('/search/category/:category', helpers.isLoggedIn,
  SearchController.categoryIndex);
}
