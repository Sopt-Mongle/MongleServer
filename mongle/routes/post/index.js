var express = require('express');
var router = express.Router();
const postController = require('../../controllers/post');

router.post('/theme', postController.createTheme);
// router.use('/sentence',require('./sentence'));

//router.put('/:themeIdx', )

module.exports = router;