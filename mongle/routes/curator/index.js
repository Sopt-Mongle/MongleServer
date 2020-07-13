var express = require('express');
var router = express.Router();
var CuratorController = require('../../controllers/curator');

router.get('/', CuratorController.getAllCurators);
router.put('/:curatorIdx', CuratorController.subscribe);
router.get('/recommend', CuratorController.getRecommendCurator);
router.get('/themeInCurator', CuratorController.getThemeInCurator);
router.get('/:keywordIdx', CuratorController.getCuratorByKeyword);
router.get('/:curatorIdx', CuratorController.getCuratorInfo);




module.exports = router;