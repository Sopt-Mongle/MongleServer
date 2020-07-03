var express = require('express');
var router = express.Router();
const detailController = require('../../controller/detailController');

//router.get('/:themeIdx', )
//router.put('/:themeIdx/like', )
//router.put('/:themeIdx/save', )
router.get('/:sentenceIdx', detailController.getSentence);
//router.put('/:sentenceIdx/like', )
//router.put('/:sentenceIdx/save', )

module.exports = router;