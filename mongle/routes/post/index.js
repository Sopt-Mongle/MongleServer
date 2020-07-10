var express = require('express');
var router = express.Router();
const postController = require('../../controllers/post');

// router.use('/theme',require('./theme'));
// router.use('/sentence',require('./sentence'));

router.post('/sentence', postController.createSentence);
router.get('/theme', postController.selectTheme);

module.exports = router;