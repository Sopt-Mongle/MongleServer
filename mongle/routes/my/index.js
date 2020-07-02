var express = require('express');
var router = express.Router();

router.use('/',require('./'));
router.use('/profile',require('./profile'));
//router.put('/:themeIdx', )
//router.put('/:sentenceIdx', )
//router.delete('/:themeIdx', )
//router.delete('/:sentenceIdx', )

module.exports = router;