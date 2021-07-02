const FormController = require('../controllers/FormController.js');
const helpers = require('../assets/helpers/helpers.js');

module.exports = (app) => {
  app.get('/user/:id/forms', helpers.isLoggedIn,
  FormController.formHome);

  app.get('/user/:id/forms/tech-assistance', helpers.isLoggedIn,
  FormController.techAssistanceGet);

  app.post('/user/:id/forms/tech-assistance', helpers.isLoggedIn,
  FormController.techAssitancePost);
}
