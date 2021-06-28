const CMSController = require('../controllers/CMSController.js');
const helpers = require('../assets/helpers/helpers.js');

module.exports = (app) => {

  app.get('/media/:prefix?', helpers.isLoggedIn,
  CMSController.getBucket);

  app.post('/media/signed-url', helpers.isLoggedIn,
  CMSController.getSignedURL);

  app.post('/media/new-folder', helpers.isLoggedIn,
  CMSController.newFolder);

  app.post('/media/upload', helpers.isLoggedIn,
  CMSController.upload);

  app.post('/media/delete', helpers.isLoggedIn,
  CMSController.delete);

  app.post('/media/delete-folder', helpers.isLoggedIn,
  CMSController.deleteFolder);
}
