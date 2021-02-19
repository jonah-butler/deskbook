const UserController = require('../controllers/UserController.js');
const helpers = require('../assets/helpers/helpers.js');

module.exports = (app) => {
  app.get('/user', helpers.isLoggedIn,
  UserController.index);

  app.get('/user/:userId', helpers.isLoggedIn,
  UserController.indexLookup);

  app.get('/user/:userId/change-password', helpers.isLoggedIn,
  UserController.changePwdIndex);

  app.post('/user/:userId/change-password', helpers.isLoggedIn,
  UserController.changePwdPost);

  app.get('/user/:userId/reference', helpers.isLoggedIn,
  UserController.referenceIndex);

  app.post('/user/reference', helpers.isLoggedIn,
  UserController.referenceDelete);
}