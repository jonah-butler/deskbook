const HomeController = require('../controllers/HomeController.js');
const helpers = require('../assets/helpers/helpers.js');

module.exports = (app) => {
  app.get('/', helpers.isLoggedIn, helpers.shouldUserUpdateLibraryLocation,
  HomeController.index);
}
