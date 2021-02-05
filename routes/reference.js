const ReferenceController = require('../controllers/ReferenceController.js');

module.exports = (app) => {
  app.get('/reference',
    ReferenceController.index);

  app.post('/reference',
    ReferenceController.post);

  app.post('/reference/search',
    ReferenceController.postSearch);
}
