var express = require('express');
var router = express.Router();
const detailController = require('../../controllers/detail');

router.get('/theme/:themeIdx', detailController.getTheme);
router.put('/theme/:themeIdx/bookmark', detailController.bookmarkTheme);

router.get('/sentence/:sentenceIdx', detailController.getSentence);
router.put('/sentence/:sentenceIdx/like', detailController.likeSentence);
router.put('/sentence/:sentenceIdx/bookmark', detailController.bookmarkSentence);
router.get('/sentence/:sentenceIdx/other', detailController.otherSentence);

module.exports = router;