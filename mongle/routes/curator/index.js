var express = require('express');
var router = express.Router();
var CuratorController = require('../../controllers/curator');

router.get('/', CuratorController.getAllCurators);
//router.put('/:curatorIdx', )
//router.get('/:curatorIdx', )

module.exports = router;