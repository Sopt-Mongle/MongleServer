var express = require('express');
var router = express.Router();
const UserController = require('../../controllers/user');
const authUtil = require('../../modules/authUtil');

router.post('/duplicate', UserController.duplicate);
router.post('/signup', UserController.signup);
router.post('/signin', UserController.signin);
router.post('/auth', UserController.auth);
router.delete('/withdraw', authUtil.checkToken, UserController.withdraw);
router.put('/changePassword', authUtil.checkToken, UserController.changePassword);

module.exports = router;