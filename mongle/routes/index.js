var express = require('express');
var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// router.use('/main',require('./main'));
// router.use('/my',require('./my'));
router.use('/curator',require('./curator'));
// router.use('/detail',require('./detail'));
// router.use('/search',require('./search'));
// router.use('/users',require('./users'));
// router.use('/post',require('./post'));
router.use('/main',require('./main'));
//router.use('/my',require('./my'));
//router.use('/curator',require('./curator'));
router.use('/detail',require('./detail'));
//router.use('/search',require('./search'));
//router.use('/users',require('./users'));
//router.use('/post',require('./post'));

module.exports = router;