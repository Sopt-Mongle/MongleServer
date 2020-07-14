const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');

const MyModel = require('../models/my');

module.exports = {
    getMyProfile : async(req, res) => {
        // console.log(req);
        const token = req.headers.token;
        // const curatorIdx = req.body.curatorIdx;
        if(!token){
            console.log('no token!!');
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await MyModel.getMyProfile(token);

        if(result.length === 0){
            res.status(statusCode.NO_CONTENT).send(util.fail(statusCode.NO_CONTENT, resMessage.NO_CONTENT_CURATOR));
            return;
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.MY_PROFILE_SUCCESS, result));
    },

    getMyTheme : async(req, res) => {
        const curatorIdx = req.body.curatorIdx;
        if(!curatorIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await MyModel.getMyTheme(curatorIdx);

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.MY_THEME_SUCCESS, result));
    },

    getMySentence : async(req, res) => {
        const curatorIdx = req.body.curatorIdx;
        if(!curatorIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await MyModel.getMySentence(curatorIdx);

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.MY_SENTENCE_SUCCESS, result));
    },

    getMySubscribe : async(req, res) => {
        const curatorIdx = req.body.curatorIdx;
        if(!curatorIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await MyModel.getMySubscribe(curatorIdx);

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.MY_SUBSCRIBE_SUCCESS, result));
    },


    deleteSentence : async(req, res) => {
        const sentenceIdx = req.params.sentenceIdx;
        if(!sentenceIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await MyModel.deleteSentence(sentenceIdx);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DELETE_SENTENCE_SUCCESS, {deleteSentenceIdx:sentenceIdx}));
    },

    editSentence : async(req, res) => {
        const sentenceIdx = req.params.sentenceIdx;
        const {sentence} = req.body;
        if(!sentenceIdx || !sentence){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await MyModel.editSentence(sentenceIdx, sentence);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EDIT_SENTENCE_SUCCESS, result));
    },

    editProfile : async(req, res) => {
        const {curatorIdx, name, introduce, keywordIdx} = req.body;
        if(!curatorIdx || !name || !introduce || !keywordIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await MyModel.editProfile(curatorIdx, name, introduce, keywordIdx);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EDIT_PROFILE_SUCCESS, result));
    }
};