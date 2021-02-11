const ReferenceController = require('../controllers/ReferenceController.js');
const helpers = require('../assets/helpers/helpers.js');


module.exports = (app) => {
  app.get('/reference', helpers.isLoggedIn,
    ReferenceController.index);

  app.post('/reference', helpers.canSubmit,
    ReferenceController.post);

  app.post('/reference/search', helpers.isLoggedIn,
    ReferenceController.postSearch);
}
