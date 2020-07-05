var express = require('express');
var router = express.Router();
const detailController = require('../../controllers/detail');

//router.get('/:themeIdx', )
router.put('/:themeIdx/themelike', detailController.likeTheme);
router.put('/:themeIdx/themesave', detailController.saveTheme);
router.get('/bookSearch', detailController.bookSearch);
router.get('/:sentenceIdx', detailController.getSentence);
router.put('/:sentenceIdx/sentencelike', detailController.likeSentence);
router.put('/:sentenceIdx/sentencesave', detailController.saveSentence);

module.exports = router;