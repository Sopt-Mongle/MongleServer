var express = require('express');
var router = express.Router();
const detailController = require('../../controllers/detail');

//router.get('/:themeIdx', )
router.put('/:themeIdx/themelike', detailController.likeTheme);
router.put('/:themeIdx/themebookmark', detailController.bookmarkTheme);
router.get('/bookSearch', detailController.bookSearch);
router.get('/:sentenceIdx', detailController.getSentence);
router.put('/:sentenceIdx/sentencelike', detailController.likeSentence);
router.put('/:sentenceIdx/sentencebookmark', detailController.bookmarkSentence);

module.exports = router;