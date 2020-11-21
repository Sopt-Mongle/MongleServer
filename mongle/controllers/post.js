const util = require('../modules/util');

const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const PostModel = require('../models/post');

const kakaoAPI = require('../modules/kakao');
const BookData = require('../modules/data/bookData');

module.exports = {
    makeTheme: async(req, res) => {
        const curatorIdx = (await req.decoded).valueOf(0).idx;
        if(!curatorIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        const {theme, themeImgIdx} = req.body;
        if(!theme || !themeImgIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        // console.log("themeImgIdx: ", themeImgIdx);
        const result = await PostModel.makeTheme(curatorIdx, theme, themeImgIdx);
        if(result == -1){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.ALREADY_THEME));
        }
        else{
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_THEME, result));
        }
    },
    
    createSentence : async(req, res) =>{
        const curatorIdx = (await req.decoded).valueOf(0).idx;
        const {sentence, title, author, publisher, thumbnail, themeIdx} = req.body;

        if(!curatorIdx || !sentence || !title || !author || !publisher || !themeIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await PostModel.createSentence(curatorIdx, req.body);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATE_SENTENCE_SUCCESS, result));
        
    },

    selectTheme : async(req, res) => {
        const result = await PostModel.selectTheme();
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.THEME_LIST_SUCCESS, result));

    },

    bookSearch : async(req, res) =>{
        const title = req.query.query;

        if(!title){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        let result = await kakaoAPI.bookSearch(title);
        
        var finalResult = result.documents.map(BookData);
        
        if(finalResult.length===0){
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.BOOK_SEARCH_FAIL));
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.BOOK_SEARCH_SUCCESS, finalResult));
    },
    
    themeImg : async(req, res) => {
        const result = await PostModel.themeImg();
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GET_THEMEIMG_SUCCESS, result));  
    },
};