const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');

const MyModel = require('../models/my');

module.exports = {
    getMyProfile : async(req, res) => {
        const token = req.headers.token;
        if(!token){
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
        const token = req.headers.token;
        if(!token){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await MyModel.getMyTheme(token);

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.MY_THEME_SUCCESS, result));
    },

    getMySentence : async(req, res) => {
        const token = req.headers.token;
        if(!token){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await MyModel.getMySentence(token);

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.MY_SENTENCE_SUCCESS, result));
    },

    getMySubscribe : async(req, res) => {
        const token = req.headers.token;
        if(!token){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await MyModel.getMySubscribe(token);

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.MY_SUBSCRIBE_SUCCESS, result));
    },


    deleteSentence : async(req, res) => {
        const token = req.headers.token;
        const sentenceIdx = req.params.sentenceIdx;
        if(!token || !sentenceIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await MyModel.deleteSentence(token, sentenceIdx);

        if(result == -1){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.CURATOR_SENTENCE_UNMATCH));
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DELETE_SENTENCE_SUCCESS, {deleteSentenceIdx:sentenceIdx}));
        
    },

    editSentence : async(req, res) => {
        const token = req.headers.token;
        const sentenceIdx = req.params.sentenceIdx;
        const {sentence} = req.body;
        if(!token || !sentenceIdx || !sentence){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await MyModel.editSentence(token, sentenceIdx, sentence);

        if(result == -1){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.CURATOR_SENTENCE_UNMATCH));
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EDIT_SENTENCE_SUCCESS, result));
        
    },

    editProfile : async(req, res) => {
        const token = req.headers.token;
        const {name, introduce, keywordIdx} = req.body;
        if(!token || !name || !introduce || !keywordIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await MyModel.editProfile(token, name, introduce, keywordIdx);

        if(result == -1){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.ALREADY_ID));
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EDIT_PROFILE_SUCCESS, result));
    }
};