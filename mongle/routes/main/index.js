var express = require('express');
var router = express.Router();
const mainController = require('../../controllers/main');
const authUtil = require('../../modules/authUtil');

router.get('/editorsPick', mainController.editorsPick);
router.get('/sentences', authUtil.checkToken, mainController.getTodaySentence);
router.get('/themes', authUtil.checkToken, mainController.getTodayTheme);
router.get('/curators', mainController.getTodayCurator);
router.get('/waitThemes',authUtil.checkToken, mainController.getWaitTheme);
router.get('/nowThemes', authUtil.checkToken, mainController.getNowTheme);

module.exports = router;