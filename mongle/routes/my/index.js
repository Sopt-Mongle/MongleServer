var express = require('express');
var router = express.Router();
const myController = require('../../controllers/my');
const upload = require('../../modules/multer');
// const multer = require('multer');
// const upload = multer({
//     dest: 'upload/'
// });

router.get('/profile', myController.getMyProfile);
router.get('/theme', myController.getMyTheme);
router.get('/sentence', myController.getMySentence);
router.get('/subscribe', myController.getMySubscribe);
router.post('/profile', upload.single('img'), myController.editProfile);
router.put('/:sentenceIdx', myController.editSentence);
router.delete('/:sentenceIdx', myController.deleteSentence);


module.exports = router;