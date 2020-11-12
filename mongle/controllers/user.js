const encryption = require('../modules/encryption');
const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const jwt = require('../modules/jwt');

const UserModel = require('../models/user');
const Mail = require('../modules/nodemailer');

module.exports = {
    duplicate : async(req, res) =>{
        const {email, name} = req.body;
        if(!email || !name){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const alreadyEmail = await UserModel.checkUserEmail(email);
        if(alreadyEmail){
            return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ALREADY_EMAIL, {duplicate : 'email'}));
        }

        const alreadyName = await UserModel.checkUserName(name);
        if (alreadyName){
            return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ALREADY_NAME, {duplicate : 'name'}));
        }

        return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.NO_DUPLICATE, {duplicate : 'available'}));
        
    },

    signup : async(req,res) =>{
        const {email, password, name} = req.body;
        if (!email|| !password || !name ) {            
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const {salt, hashed} = await encryption.encrypt(password);
        const idx = await UserModel.signup(email, hashed, name, salt);
        if (idx === -1) {
            return await res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_USER));
    },

    signin : async(req, res) =>{
        const {email, password} = req.body;
        
        if (!email || !password) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const alreadyEmail = await UserModel.checkUserEmail(email);
        if(alreadyEmail === false){//이메일 있는지 확인
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
        }

        const user = await UserModel.getUserByEmail(email);

        const hashed = await encryption.encryptWithSalt(password, user[0].salt);
        if(hashed !== user[0].password){//비밀번호 확인
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.MISS_MATCH_PW));
        }

        const {token, _} = await jwt.sign(user[0]);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, {accessToken : token}));
    },

    auth : async(req, res) => {
        const email = req.body;

        if(!email){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const authNum = await Mail.auth(email);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EMAIL_SEND_SUCCESS, {authNum : authNum}));

    },

    withdraw : async(req, res) => {
        const curatorIdx = (await req.decoded).valueOf(0).idx;
        const {email, password} = req.body;
        if (!curatorIdx || !email || !password) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        const user = await UserModel.getUserByEmail(email);
        const hashed = await encryption.encryptWithSalt(password, user[0].salt);
        if(hashed !== user[0].password){//비밀번호 확인
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.MISS_MATCH_PW));
        }

        const result = await UserModel.withdraw(curatorIdx);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.WITHDRAW_SUCCESS));
    },

    changePassword : async(req, res) =>{
        const curatorIdx = (await req.decoded).valueOf(0).idx;
        const{password} = req.body;
        if (!curatorIdx || !password) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        const {salt, hashed} = await encryption.encrypt(password);
        
        const idx = await UserModel.changePassword(curatorIdx, hashed, salt);
        if (idx === -1) {
            return await res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CHANGE_PASSWORD_SUCCESS));
    }
    
}