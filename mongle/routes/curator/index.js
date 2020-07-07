var express = require('express');
var router = express.Router();
var CuratorController = require('../../controllers/curator');

router.get('/', CuratorController.getAllCurators);
router.put('/:curatorIdx', CuratorController.subscribe);
router.get('/:curatorIdx', CuratorController.getCuratorInfo);

module.exports = router;