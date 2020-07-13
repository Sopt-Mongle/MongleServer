var express = require('express');
var router = express.Router();
const myController = require('../../controllers/my');

router.get('/profile', myController.getMyProfile);
router.get('/theme', myController.getMyTheme);
router.get('/sentence', myController.getMySentence);
router.get('/subscribe', myController.getMySubscribe);
router.put('/:sentenceIdx', myController.editSentence);
router.delete('/:sentenceIdx', myController.deleteSentence);
router.put('/profile/settings/:curatorIdx/editProfile', myController.editProfile);


module.exports = router;