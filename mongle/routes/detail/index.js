var express = require('express');
var router = express.Router();
const detailController = require('../../controllers/detail');
const authUtil = require('../../modules/authUtil');
const { auth } = require('../../modules/nodemailer');

router.get('/theme/:themeIdx', authUtil.checkToken, detailController.getTheme);
router.put('/theme/:themeIdx/bookmark', authUtil.checkToken, detailController.bookmarkTheme);
router.get('/sentence/:sentenceIdx', authUtil.checkToken, detailController.getSentence);
router.put('/sentence/:sentenceIdx/like', authUtil.checkToken, detailController.likeSentence);
router.put('/sentence/:sentenceIdx/bookmark', authUtil.checkToken, detailController.bookmarkSentence);
router.get('/sentence/:sentenceIdx/other', detailController.otherSentence);
router.post('/report', authUtil.checkToken, detailController.report);

module.exports = router;