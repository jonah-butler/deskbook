const HelpController = require('../controllers/HelpController.js');

module.exports = (app) => {
  app.get('/help',
  HelpController.helpIndex);

  app.post('/help',
  HelpController.helpPost);
}
