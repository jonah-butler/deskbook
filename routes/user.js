const UserController = require('../controllers/UserController.js');
const helpers = require('../assets/helpers/helpers.js');

module.exports = (app) => {
  app.post('/register', helpers.isAdmin,
  UserController.registerUser);

  app.get('/user', helpers.isLoggedIn,
  UserController.index);

  app.get('/user/:userId', helpers.isLoggedIn,
  UserController.indexLookup);

  app.get('/user/:userId/change-password', helpers.isLoggedIn,
  UserController.changePwdIndex);

  app.post('/user/:userId/change-password', helpers.isAdmin,
  UserController.changePwdPost);

  app.get('/user/:userId/reference', helpers.isLoggedIn,
  UserController.referenceIndex);

  app.post('/user/reference', helpers.isLoggedIn,
  UserController.referenceDelete);

  app.get('/user/:userId/change-avatar', helpers.isLoggedIn,
  UserController.changeAvatarGet);

  app.post('/user/:userId/change-avatar', helpers.isLoggedIn,
  UserController.changeAvatar);

  app.get('/user/:userId/account-details', helpers.isLoggedIn,
  UserController.accountDetailsGet);

  app.post('/user/:userId/account-details', helpers.isLoggedIn,
  UserController.updateUser);
}
