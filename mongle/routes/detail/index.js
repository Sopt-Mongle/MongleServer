var express = require('express');
var router = express.Router();
const detailController = require('../../controllers/detail');

router.get('/bookSearch', detailController.bookSearch);

router.get('/theme/:themeIdx', detailController.getTheme);
router.put('/theme/:themeIdx/like', detailController.likeTheme);
router.put('/theme/:themeIdx/bookmark', detailController.bookmarkTheme);

router.get('/sentence/:sentenceIdx', detailController.getSentence);
router.put('/sentence/:sentenceIdx/like', detailController.likeSentence);
router.put('/sentence/:sentenceIdx/bookmark', detailController.bookmarkSentence);

module.exports = router;