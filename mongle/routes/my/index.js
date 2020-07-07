var express = require('express');
var router = express.Router();
const myController = require('../../controllers/my');

router.get('/:curatorIdx', myController.getMyInfo);
// router.use('/profile');
//router.put('/:themeIdx', )
//router.put('/:sentenceIdx', )
//router.delete('/:themeIdx', )
//router.delete('/:sentenceIdx', )

module.exports = router;