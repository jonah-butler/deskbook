const emoji = require('node-emoji');
const sgMail = require('@sendgrid/mail');

require('dotenv').config()

module.exports = {
  async helpIndex(req, res) {
    let previousRoute = req.headers.referer;
    let isPublic;
    if(previousRoute.split(' ')[0].indexOf('public') != -1){
      isPublic = true;
    } else {
      isPublic = false;
    }
    res.render('help', {
      message: req.flash('message'),
      emoji: emoji.get('thinking_face'),
      user: req.user,
      isPublic: isPublic,
      referer: previousRoute,
      lastRoute: req.flash('lastRoute'),
    });
  },
  async helpPost(req, res) {
    try{
      const lastRoute = req.body.post.referer;

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: 'jonah.butler@richmondgov.com',
        from: 'rvalearns@gmail.com',
        subject: 'Deskbook Guide Request',
        text: `New Deskbook guide request from ${req.body.post.submitter}.

        Location in ${req.body.post.location}

        Respond to ${req.body.post.submitter} through ${req.body.post.email}.

        Guide Being Requested:
        _______________________
        ${req.body.post.guide}
        `
      };

      sgMail
        .send(msg)
        .then(() => {
          req.flash('message', 'Your email was successfully sent!' );
          req.flash('lastRoute', lastRoute);
          res.redirect('/help');
        })
        .catch((error) => {
          req.flash('message', 'an unexpected error occurred. contact the administrator');
          req.flash('lastRoute', lastRoute);
          res.redirect('/help');
        })
      } catch(err) {
        req.flash('message', 'weird. something strange happened on the server.');
        req.flash('lastRoute', lastRoute);
        res.redirect('/help');
      }
  },
}
