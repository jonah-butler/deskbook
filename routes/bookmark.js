const BookMarkController = require('../controllers/BookMarkController.js');
const helpers = require('../assets/helpers/helpers.js');

module.exports = (app) => {
  app.get('/user/:id/bookmarks', helpers.isLoggedIn,
  BookMarkController.bookmarkIndex);

  app.post('/bookmark', helpers.isLoggedIn,
  BookMarkController.postBookMark);

  app.get('/bookmarks', helpers.isLoggedIn,
  BookMarkController.indexRedirect);
}
