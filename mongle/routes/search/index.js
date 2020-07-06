var express = require('express');
var router = express.Router();

const SearchController = require('../../controllers/search');

router.get('/curator', SearchController.searchCurator);
// router.use('/theme',require('./theme'));
router.get('/sentence', SearchController.searchSentence);

module.exports = router;