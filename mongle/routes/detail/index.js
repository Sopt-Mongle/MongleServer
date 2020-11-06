var express = require('express');
var router = express.Router();
const detailController = require('../../controllers/detail');
const authUtil = require('../../modules/authUtil');

router.get('/theme/:themeIdx', detailController.getTheme);
router.put('/theme/:themeIdx/bookmark', authUtil.checkToken, detailController.bookmarkTheme);

router.get('/sentence/:sentenceIdx', detailController.getSentence);
router.put('/sentence/:sentenceIdx/like', authUtil.checkToken, detailController.likeSentence);
router.put('/sentence/:sentenceIdx/bookmark', authUtil.checkToken, detailController.bookmarkSentence);
router.get('/sentence/:sentenceIdx/other', detailController.otherSentence);

module.exports = router;