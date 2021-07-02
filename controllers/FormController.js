const sgMail = require('@sendgrid/mail');
const emoji = require('node-emoji');

require('dotenv').config()

module.exports = {
  async formHome(req, res) {
    res.render('forms/landing', {
      user: req.user,
    })
  },
  async techAssistanceGet(req, res) {
    res.render('forms/tech-assistance', {
      message: req.flash('message'),
      user: req.user,
      emoji: {male: emoji.get('male-technologist'), female: emoji.get('female-technologist')},
    })
  },
  async techAssitancePost(req, res) {
    try{
      const details = req.body.post;
      let skillsText = '';
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      if(!Array.isArray(details.skills)){
        skillsText = details.skills;
      } else {
        details.skills.forEach(skill => {
          skillsText += `${skill} <br>`;
        })
      }

      const msg = {
        to: ['benjamin.himmelfarb@richmondgov.com', 'amanda.ortman@richmondgov.com'],
        // to: 'jonahbutler6@gmail.com',
        from: 'rvalearns@gmail.com',
        subject: `Tech Assistance Request from ${details.firstName} ${details.lastName}`,
        html: `<h1>New Tech Assistance Request!</h1>
        <div>
        <h3>Patron Details</h3>
        <hr>
        <ul>
        <li><strong>Name:</strong> ${details.firstName} ${details.lastName}</li>
        <li><strong>Preferred Pronouns:</strong> ${details.pronouns}</li>
        <li><strong>Phone #:</strong> ${details.phoneNumber}</li>
        <li><strong>Email:</strong> ${details.email}</li>
        <li><strong>Preferred Contact Method:</strong> ${details.contactMethod}</li>
        <li><strong>Skill Level:</strong> ${details.skillLevel}</li>
        <li><strong>Skills Desired:</strong> ${skillsText}</li>
        <li><strong>Additional Details:</strong> ${details.additionalDetails}</li>
        </ul>
        </div>`,
      };
      sgMail
        .send(msg)
        .then(() => {
          req.flash('message', 'Your email was successfully sent! ^_^' );
          res.redirect(`/user/${req.user._id}/forms/tech-assistance`);
        })
        .catch((error) => {
          req.flash('message', 'An unexpected error occurred. :(' );
          res.redirect(`/user/${req.user._id}/forms/tech-assistance`);
        })
    } catch(err) {
      console.log(err);
    }

  },
}
