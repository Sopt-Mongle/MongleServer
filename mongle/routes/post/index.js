var express = require('express');
var router = express.Router();
const postController = require('../../controllers/post');
const authUtil = require('../../modules/authUtil');

router.post('/theme', authUtil.checkToken, postController.makeTheme);
router.post('/sentence', authUtil.checkToken, postController.createSentence);
router.post('/setTheme', authUtil.checkToken, postController.setTheme);
router.get('/emptySentence', authUtil.checkToken, postController.getEmptySentence);
router.get('/theme', postController.selectTheme);
router.get('/bookSearch', postController.bookSearch);
router.get('/themeImg', postController.themeImg);

module.exports = router;