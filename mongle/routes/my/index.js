var express = require('express');
var router = express.Router();
const myController = require('../../controllers/my');
const upload = require('../../modules/multer');
// const multer = require('multer');
// const upload = multer({
//     dest: 'upload/'
// });

const authUtil = require('../../modules/authUtil');

router.get('/profile', authUtil.checkToken, myController.getMyProfile);
router.get('/theme', authUtil.checkToken, myController.getMyTheme);
router.get('/sentence', authUtil.checkToken, myController.getMySentence);
router.get('/subscribe', authUtil.checkToken, myController.getMySubscribe);
router.post('/profile', authUtil.checkToken, upload.single('img'), myController.editProfile);
router.put('/:sentenceIdx', authUtil.checkToken, myController.editSentence);
router.delete('/:sentenceIdx', authUtil.checkToken, myController.deleteSentence);


module.exports = router;