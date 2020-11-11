const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');

const MyModel = require('../models/my');

module.exports = {
    getMyProfile : async(req, res) => {
        const curatorIdx = (await req.decoded).valueOf(0).idx;
        
        if(!curatorIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await MyModel.getMyProfile(curatorIdx);

        if(result.length === 0){
            res.status(statusCode.NO_CONTENT).send(util.fail(statusCode.NO_CONTENT, resMessage.NO_CONTENT_CURATOR));
            return;
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.MY_PROFILE_SUCCESS, result));
    },

    getMyTheme : async(req, res) => {
        const curatorIdx = (await req.decoded).valueOf(0).idx;
        if(!curatorIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await MyModel.getMyTheme(curatorIdx);

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.MY_THEME_SUCCESS, result));
    },

    getMySentence : async(req, res) => {
        const curatorIdx = (await req.decoded).valueOf(0).idx;
        if(!curatorIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await MyModel.getMySentence(curatorIdx);

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.MY_SENTENCE_SUCCESS, result));
    },

    getMySubscribe : async(req, res) => {
        const curatorIdx = (await req.decoded).valueOf(0).idx;
        if(!curatorIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await MyModel.getMySubscribe(curatorIdx);

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.MY_SUBSCRIBE_SUCCESS, result));
    },


    deleteSentence : async(req, res) => {
        const curatorIdx = (await req.decoded).valueOf(0).idx;
        const sentenceIdx = req.params.sentenceIdx;
        if(!curatorIdx || !sentenceIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await MyModel.deleteSentence(curatorIdx, sentenceIdx);

        if(result == -1){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.CURATOR_SENTENCE_UNMATCH));
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DELETE_SENTENCE_SUCCESS, {deleteSentenceIdx:sentenceIdx}));
        
    },

    editSentence : async(req, res) => {
        const curatorIdx = (await req.decoded).valueOf(0).idx;
        const sentenceIdx = req.params.sentenceIdx;
        const {sentence} = req.body;
        if(!curatorIdx || !sentenceIdx || !sentence){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await MyModel.editSentence(curatorIdx, sentenceIdx, sentence);

        if(result == -1){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.CURATOR_SENTENCE_UNMATCH));
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EDIT_SENTENCE_SUCCESS, result));
        
    },

    editProfile : async(req, res) => {
        const curatorIdx = (await req.decoded).valueOf(0).idx;
        const {name, introduce, keywordIdx} = req.body;
        const img = req.files;
        const location = img.map(image => image.location);
        console.log('curatorIdx: ', curatorIdx);
        console.log('name: ', name);
        console.log('introduce: ', introduce);
        console.log('keywordIdx: ', keywordIdx);
        console.log('img: ', img);
        if(img === undefined){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_IMAGE));
            return;
        }

        if(!curatorIdx || !name || !introduce || !keywordIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        const type = req.files[0].mimetype.split('/')[1];
        if(type !== 'jpeg' && type !== 'jpg' && type !== 'png'){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.INCORRECT_IMG_FORM));
            return;
        }

        const result = await MyModel.editProfile(curatorIdx, name, location, introduce, keywordIdx);

        if(result == -1){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.ALREADY_NAME));
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EDIT_PROFILE_SUCCESS, result));
    }
};