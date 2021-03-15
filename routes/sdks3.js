const SDKController = require('../controllers/SDKS3.js');
const helpers = require('../assets/helpers/helpers.js');

module.exports = (app) => {
  app.get('/get-signature', helpers.isLoggedIn,
  SDKController.getHash);
  
  app.post('/delete-img', helpers.isLoggedIn,
  SDKController.deleteImg);
}
