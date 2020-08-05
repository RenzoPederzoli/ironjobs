var express = require('express');
var router = express.Router();
const User = require('../models/User');

/* POST job to user */
router.post('/addjob', isAuth, function(req, res, next) {
  let updated = [...req.user.addedJobs]
  updated.push(req.body)
  User.findByIdAndUpdate(req.user._id, {addedJobs: updated}, {new: true})
    .then((user) => {
      res.status(200).send({user})
    })
    .catch((err) => {
      console.log(req.user)
      res.json({err})
    })
});

/* POST remove job */
router.post('/removejob', isAuth, function(req,res,next) {
  let updated = [...req.user.addedJobs].filter(each => {
    return each.title != req.body.title
  })
  User.findByIdAndUpdate(req.user._id, {addedJobs: updated}, {new: true})
  .then((user) => {
    res.status(200).send({user})
  })
  .catch((err) => {
    console.log(req.user)
    res.json({err})
  })
})

function isAuth(req, res, next) {
  req.isAuthenticated() ? next() : res.status(401).json({ msg: 'Log in first' });
}

module.exports = router;
