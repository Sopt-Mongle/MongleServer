const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const PostModel = require('../models/post');

module.exports = {
    makeTheme: async(req, res) => {
        const token = req.headers.token;
        if(!token){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        const {theme, themeImgIdx} = req.body;
        if(!theme || !themeImgIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const result = await PostModel.makeTheme(token, theme, themeImgIdx);
        if(result == -1){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.ALREADY_THEME));
        }
        else{
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_THEME));
        }
    },
    
    createSentence : async(req, res) =>{
        const token = req.headers.token;
        const {sentence, title, author, publisher, themeIdx} = req.body;

        if(!token || !sentence || !title || !author || !publisher){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await PostModel.createSentence(token, req.body);

        if(result == -1){
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATE_EMPTY_SENTENCE_SUCCESS));

        }
        else{
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATE_SENTENCE_SUCCESS));
        }
    },

    selectTheme : async(req, res) => {
        const result = await PostModel.selectTheme();
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.THEME_LIST_SUCCESS, result));

    },

    bookSearch : async(req, res) =>{
        const title = req.body.title;
        const sort = 'accuracy';
        const target = 'title';

        if(!title){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        let result = await kakaoAPI.bookSearch(title, sort, target);

        var finalResult = result.documents.map(BookData);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.BOOK_SEARCH_SUCCESS, finalResult));
    },

    getEmptySentence : async(req, res) => {
        const token = req.headers.token;
        if(!token){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await PostModel.getEmptySentence(token);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EMPTY_SENTENCE_LIST_SUCCESS, result));  
    },

    setTheme : async(req, res) => {
        const token = req.headers.token;
        if(!token){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const {themeIdx, sentenceIdx, sentence, title, author, publisher} = req.body;
        if(!themeIdx || !sentenceIdx || !sentence || !title || !author || !publisher){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        const result = await PostModel.setTheme(token, themeIdx, sentenceIdx, sentence, title, author, publisher);
        
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EMPTY_SENTENCE_SET_THEME_SUCCESS));  

    },

    themeImg : async(req, res) => {
        const result = await PostModel.themeImg();
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GET_THEMEIMG_SUCCESS, result));  
    },
};