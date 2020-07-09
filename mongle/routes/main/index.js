var express = require('express');
var router = express.Router();
const mainController = require('../../controllers/main');


// router.use('/curator');
router.get('/sentences', mainController.getTodaySentence);
router.get('/editorsPick', mainController.editorsPick);
router.get('/themes', mainController.getTodayTheme);
router.get('/curators', mainController.getTodayCurator);

module.exports = router;