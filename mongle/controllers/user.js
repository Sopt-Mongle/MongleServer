const encryption = require('../modules/encryption');
const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const crypto = require('crypto');
const jwt = require('../modules/jwt');

const UserModel = require('../models/user');

module.exports = {
    signup : async(req,res) =>{
        const {email, password, name} = req.body;
        if (!email|| !password || !name ) {            
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        // 사용중인 닉네임이 있는지 확인
        const check = await UserModel.checkUserName(name);
        if (check) {
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.ALREADY_ID));
        }

        const {salt, hashed} = await encryption.encrypt(password);
        // console.log(salt, hashed);
        const idx = await UserModel.signup(email, hashed, name, salt);
        if (idx === -1) {
            return await res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_USER, {userId: idx}));
    },

    signin : async(req, res) =>{
        const {email, password} = req.body;
        if (!email || !password) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        if(await UserModel.checkUserEmail(email) === false)//이메일 있는지 확인
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));

        const user = await UserModel.getUserByEmail(email);
        if(user[0] === undefined){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
        }

        const hashed = await encryption.encryptWithSalt(password, user[0].salt);
        if(hashed !== user[0].password){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.MISS_MATCH_PW));
        }

        const {token, _} = await jwt.sign(user[0]);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, {accessToken : token}));
    }
}