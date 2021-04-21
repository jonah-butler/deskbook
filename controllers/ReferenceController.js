const ReferenceQuestion = require('../models/question');
const helpers           = require('../assets/helpers/helpers') ;

module.exports = {
  async index(req, res) {
    try {
      res.render('reference');
    } catch(err) {
      console.log('reference page index', err);
    }
  },
  async post(req, res) {
    // try{
    //   req.body.user = req.user._id;
    //   const question = await ReferenceQuestion.create(req.body);
    //   res.send(question);
    // } catch(err) {
    //   console.log('new reference post', err);
    // }
    try{
      console.log(req.body);
      res.send({received: 'received'});
    } catch(err) {
      console.log(err);
    }
  },
  async postSearch(req, res) {
    req.body.createdAt[1] = helpers.findNextDay(req.body.createdAt[1]);
    if(req.body.library == 'all') {
      const questions = await ReferenceQuestion.find(
        {createdAt: {
          $gte: new Date(req.body.createdAt[0]),
          $lte: new Date(req.body.createdAt[1]),
        }}
      )
      res.send(questions);
    } else if(req.body.library){
      const questions = await ReferenceQuestion.find(
        {
          $and: [
            {createdAt: {
              $gte: new Date(req.body.createdAt[0]),
              $lte: new Date(req.body.createdAt[1]),
            }},
            {library: {
              $in: req.body.library,
            }}
          ],
        }
      )
      res.send(questions);
    } else {
      const questions = await ReferenceQuestion.find(
        {
          $and: [
            {createdAt: {
              $gte: new Date(req.body.createdAt[0]),
              $lte: new Date(req.body.createdAt[1]),
            }},
            {user: {
              $in: req.user._id,
            }}
          ],
        }
      )
      res.send(questions);
    }
  },
}
