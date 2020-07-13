const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const PostModel = require('../models/post');

module.exports = {
    makeTheme: async(req, res) => {
        const {curatorIdx, theme, themeImgIdx} = req.body;
        if(!curatorIdx || !theme || !themeImgIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const result = await PostModel.makeTheme(curatorIdx, theme, themeImgIdx);
        if(result == -1){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.ALREADY_THEME));
        }
        else{
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_THEME));
        }
    },
    
    createSentence : async(req, res) =>{

        const {curatorIdx, sentence, title, author, publisher} = req.body;

        if(!curatorIdx || !sentence || !title || !author || !publisher){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await PostModel.createSentence(req.body);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATE_SENTENCE_SUCCESS));

    },

    selectTheme : async(req, res) => {
        const result = await PostModel.selectTheme();
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATE_SENTENCE_SUCCESS, result));

    },

    getEmptySentence : async(req, res) => {
        const {curatorIdx} = req.body.curatorIdx;
        if(!curatorIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await PostModel.getEmptySentence(curatorIdx);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATE_SENTENCE_SUCCESS, result));   
    }
};