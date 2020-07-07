var express = require('express');
var router = express.Router();
const mainController = require('../../controllers/main');


// router.use('/curator');
// router.get('/illust', mainController.getIllust);
router.use('/sentences', mainController.getTodaySentence);
router.get('/editorsPick', mainController.editorsPick);
// router.use('/sentences');
// router.use('/themes');

module.exports = router;