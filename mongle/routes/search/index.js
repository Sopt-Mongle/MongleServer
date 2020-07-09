var express = require('express');
var router = express.Router();

const SearchController = require('../../controllers/search');

router.get('/curator', SearchController.searchCurator);
router.get('/theme', SearchController.searchTheme);
router.get('/sentence', SearchController.searchSentence);
router.get('/recent', SearchController.recentSearch);

module.exports = router;