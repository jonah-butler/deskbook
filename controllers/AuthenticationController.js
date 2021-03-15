const passport          = require('passport');

module.exports = {
  async loginIndex(req, res) {
    res.render("login", {
      userAuthenticated: req.isAuthenticated(),
    });
  },
  async loginPost(req, res) {
    passport.authenticate("local", {
      successRedirect: "/entries",
      failureRedirect: "/login"
    }), (req, res) => {
    }
  },
}
