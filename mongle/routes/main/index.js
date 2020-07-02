var express = require('express');
var router = express.Router();


router.use('/curator',require('./curator'));
router.use('/illust',require('./illust'));
router.use('/sentences',require('./sentences'));
router.use('/themes',require('./themes'));

module.exports = router;