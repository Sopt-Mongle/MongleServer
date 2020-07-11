var express = require('express');
var router = express.Router();
const myController = require('../../controllers/my');

router.get('/', myController.getMyInfo);
// router.use('/profile');
//router.put('/:sentenceIdx', )
router.delete('/:sentenceIdx', myController.deleteSentence);

module.exports = router;