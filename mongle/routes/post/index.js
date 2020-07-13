var express = require('express');
var router = express.Router();
const postController = require('../../controllers/post');

// router.post('/theme', postController.createTheme);
router.post('/theme', postController.makeTheme);
// router.use('/sentence',require('./sentence'));

router.post('/sentence', postController.createSentence);
router.get('/theme', postController.selectTheme);
router.get('/bookSearch', postController.bookSearch);

module.exports = router;