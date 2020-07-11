var express = require('express');
var router = express.Router();
var CuratorController = require('../../controllers/curator');

router.get('/', CuratorController.getAllCurators);
router.put('/:curatorIdx', CuratorController.subscribe);
router.get('/recommend', CuratorController.getRecommendCurator);
router.get('/:keywordIdx', CuratorController.getCuratorByKeyword);
router.get('/:curatorIdx', CuratorController.getCuratorInfo);
router.get('/themeInCurator', CuratorController.getThemeInCurator);



module.exports = router;