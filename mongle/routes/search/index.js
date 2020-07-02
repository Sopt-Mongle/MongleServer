var express = require('express');
var router = express.Router();

router.use('/curator',require('./curator'));
router.use('/theme',require('./theme'));
router.use('/sentence',require('./sentence'));

module.exports = router;