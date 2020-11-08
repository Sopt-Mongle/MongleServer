var express = require('express');
var router = express.Router();
const mainController = require('../../controllers/main');
const authUtil = require('../../modules/authUtil');

router.get('/editorsPick', mainController.editorsPick);
router.get('/sentences', mainController.getTodaySentence);
router.get('/themes', mainController.getTodayTheme);
router.get('/curators', mainController.getTodayCurator);
router.get('/waitThemes', mainController.getWaitTheme);
router.get('/nowThemes', mainController.getNowTheme);

module.exports = router;