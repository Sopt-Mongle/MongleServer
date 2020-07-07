var express = require('express');
var router = express.Router();
const mainController = require('../../controllers/main');


// router.use('/curator');
router.get('/illust', mainController.getIllust);
router.use('/sentences', mainController.getTodaySentence);
// router.use('/themes');

module.exports = router;