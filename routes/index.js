const express = require('express');
const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* router.get('/*', (req, res, next)=>{
  // Check credential and call next to go to nex middleware
  console.log('###### Credential passed');
  next();
}) */

/* GET user page */
router.get('/user', (req, res)=>{
  res.render('user', {name: 'User Page'});
})

/* GET admin page */
router.get('/admin', (req, res)=>{
  res.render('admin', {name: 'Admin Page'})
})

module.exports = router;
