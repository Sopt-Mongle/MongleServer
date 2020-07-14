var express = require('express');
var router = express.Router();
const UserController = require('../../controllers/user');

router.post('/signup',UserController.signup);
router.post('/signin',UserController.signin);
// router.use('/signout',require('./signout'));
// router.use('/',require('./')); 탈퇴

module.exports = router;