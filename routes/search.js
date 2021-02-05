const SearchController = require('../controllers/SearchController.js');

module.exports = (app) => {
  app.get('/search',
    SearchController.index);

  app.get('/search/category/:category',
  SearchController.categoryIndex);
}
