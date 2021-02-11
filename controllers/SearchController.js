const MainCategory = require('../models/category.js');
const Entry = require('../models/entry.js');

// MainCategory.find(
//   { $or: [{ title: { $regex: req.query.query, $options: 'i' } },
//           { description: { $regex: req.query.query, $options: 'i' } },
//         { category: {  $regex: req.query.query, $options: 'i'} }
//       ] },
//     function(err, categoryResults) {
//       if(err) {
//         console.log(err);
//       } else {
//         Entry.find(
//           { $or: [{description: { $regex: req.query.query, $options: 'i' } },
//                   {title: { $regex: req.query.query, $options: 'i' } },
//                   {category: { $regex: req.query.query, $options: 'i' } },
//                 ] },
//             function(err, entryResults) {
//               if(err) {
//                 console.log(err);
//               } else {
//                 res.render('search', {
//                   query: req.query.query,
//                   categoryResults: categoryResults,
//                   entryResults: entryResults,
//                 })
//               }
//             }
//         )
//       }
//     }
// )

module.exports = {
  async index(req, res) {
    MainCategory.find(
      { $and: [
        {$or: [
          {isPrivate: {$in: false}},
          {user: {$in: req.user._id}},
        ]},
        {$or: [{ title: { $regex: req.query.query, $options: 'i' } },
                { description: { $regex: req.query.query, $options: 'i' } },
              { category: {  $regex: req.query.query, $options: 'i'} }
            ]}
      ]},
        function(err, categoryResults) {
          if(err) {
            console.log(err);
          } else {
            Entry.find(
              { $and: [
                {$or: [
                  {isPrivate: {$in: false}},
                  {user: {$in: req.user._id}},
                ]},
                {$or: [{ title: { $regex: req.query.query, $options: 'i' } },
                        { description: { $regex: req.query.query, $options: 'i' } },
                      { category: {  $regex: req.query.query, $options: 'i'} }
                    ]}
              ]},
                function(err, entryResults) {
                  if(err) {
                    console.log(err);
                  } else {
                    res.render('search', {
                      query: req.query.query,
                      categoryResults: categoryResults,
                      entryResults: entryResults,
                    })
                  }
                }
            )
          }
        }
    )
  },
  async categoryIndex(req, res) {
    MainCategory.find(
      { $or: [{ title: { $regex: req.params.category, $options: 'i' } },
              { description: { $regex: req.params.category, $options: 'i' } },
            { category: {  $regex: req.params.category, $options: 'i'} }
          ] },
        function(err, categoryResults) {
          if(err) {
            console.log(err);
          } else {
            Entry.find(
              { $or: [{description: { $regex: req.params.category, $options: 'i' } },
                      {title: { $regex: req.params.category, $options: 'i' } },
                      {category: { $regex: req.params.category, $options: 'i' } },
                    ] },
                function(err, entryResults) {
                  if(err) {
                    console.log(err);
                  } else {
                    res.render('search', {
                      query: req.params.category,
                      categoryResults: categoryResults,
                      entryResults: entryResults,
                    })
                  }
                }
            )
          }
        }
    )
  }
}
