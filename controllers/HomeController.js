const emoji = require('node-emoji');

module.exports = {
  async index(req, res) {
    res.render("landing", {
      bookEmoji: emoji.get("book"),
      user: req.user,
    });
  }
}