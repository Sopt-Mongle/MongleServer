var express = require('express');
var router = express.Router();
var CuratorController = require('../../controllers/curator');

router.get('/themeInCurator', CuratorController.getThemeInCurator);
router.get('/recommend', CuratorController.getRecommendCurator);
router.get('/:curatorIdx', CuratorController.getCuratorInfo);
router.put('/:followedIdx', CuratorController.subscribe);
router.get('/:keywordIdx/keyword', CuratorController.getCuratorByKeyword);

module.exports = router;