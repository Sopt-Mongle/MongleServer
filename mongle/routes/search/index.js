var express = require('express');
var router = express.Router();

const SearchController = require('../../controllers/search');
const authUtil = require('../../modules/authUtil');

router.get('/curator', authUtil.checkToken, SearchController.searchCurator);
router.get('/theme', authUtil.checkToken, SearchController.searchTheme);
router.get('/sentence', SearchController.searchSentence);
router.get('/recent', authUtil.checkToken, SearchController.recentSearch);
router.get('/recommend', SearchController.recommendSearch);
router.delete('/recent', authUtil.checkToken, SearchController.recentDelete);

module.exports = router;