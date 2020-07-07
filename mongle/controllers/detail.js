const encryption = require('../modules/encryption');
const detailModel = require('../models/detail');
const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const crypto = require('crypto');
//const jwt = require('../modules/jwt');

const kakaoAPI = require('../modules/kakao');
const BookData = require('../modules/data/bookData');

module.exports = {
    getSentence : async(req,res) =>{
        const sentenceIdx = req.params.sentenceIdx;
        if(!sentenceIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        const data = await detailModel.getSentence(sentenceIdx);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_SENTENCE, data));
    },

    likeSentence : async(req, res) =>{
        const sentenceIdx = req.params.sentenceIdx;
        if(!sentenceIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_SENTENCE));
        }
        const {curatorIdx} = req.body;
        if(!curatorIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_CURATOR));
        }

        function Func1(){
            const isLike = detailModel.isLike(curatorIdx, sentenceIdx);
            return isLike;
            //isLike.then((result) => console.log(result));
            // console.log(isLike);
        };

        let data;
        var result = {};
        async function Func2(isLike){
            if(!isLike){//이미 좋아요이니까 취소
                data = await detailModel.deleteLike(curatorIdx, sentenceIdx);
            }
            else{//좋아요 추가
                data = await detailModel.addLike(curatorIdx, sentenceIdx);
            }
            // console.log(isLike, data[0]);
            result.isLike = isLike;
            result.likes = data[0].likes;
            // console.log(result);
            return result;
        };

        await Func1(async(elem) =>{
            console.log(elem);
        }).then((res) => Func2(res));

        // console.log(tmp);

        // console.log(result);
        return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.LIKE_SENTENCE, result));
    },

    bookmarkSentence : async(req, res) =>{
        const sentenceIdx = req.params.sentenceIdx;
        if(!sentenceIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_SENTENCE));
        }
        const {curatorIdx} = req.body;
        if(!curatorIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_CURATOR));
        }

        function Func1(){
            const isSave = detailModel.isBookmark(curatorIdx, sentenceIdx);
            return isSave;
        };

        let data;
        var result = {};
        async function Func2(isSave){
            if(!isSave){//이미 구독중이니까 구독취소
                data = await detailModel.deleteBookmark(curatorIdx, sentenceIdx);
            }
            else{//구독 추가
                data = await detailModel.addBookmark(curatorIdx, sentenceIdx);
            }
            result.isSave = isSave;
            result.saves = data[0].saves;
            return result;
        };

        await Func1(async(elem) =>{
            console.log(elem);
        }).then((res) => Func2(res));

        return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.BOOKMARK_SENTENCE, result));
    },

    getTheme : async(req, res) =>{
        const themeIdx = req.params.themeIdx;
        
        if(!themeIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_THEME));
        }
        
        const result = await detailModel.getTheme(themeIdx);
        return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_THEME, result));
    },

    likeTheme : async(req, res) =>{
        const themeIdx = req.params.themeIdx;
        if(!themeIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_THEME));
        }
        const {curatorIdx} = req.body;
        if(!curatorIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_CURATOR));
        }

        function Func1(){
            const isLike = detailModel.themeIsLike(curatorIdx, themeIdx);
            return isLike;
        };

        let data;
        var result = {};
        async function Func2(isLike){
            if(!isLike){//이미 좋아요이니까 취소
                data = await detailModel.themeDeleteLike(curatorIdx, themeIdx);
            }
            else{//좋아요 추가
                data = await detailModel.themeAddLike(curatorIdx, themeIdx);
            }
            result.isLike = isLike;
            result.likes = data[0].likes;
            return result;
        };

        await Func1(async(elem) =>{
            console.log(elem);
        }).then((res) => Func2(res));

        return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.LIKE_THEME, result));
    },

    bookmarkTheme : async(req, res) =>{
        const themeIdx = req.params.themeIdx;
        if(!themeIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_THEME));
        }
        const {curatorIdx} = req.body;
        if(!curatorIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_CURATOR));
        }

        function Func1(){
            const isSave = detailModel.themeIsBookmark(curatorIdx, themeIdx);
            return isSave;
        };

        let data;
        var result = {};
        async function Func2(isSave){
            if(!isSave){//이미 구독중이니까 구독취소
                data = await detailModel.themeDeleteBookmark(curatorIdx, themeIdx);
            }
            else{//구독 추가
                data = await detailModel.themeAddBookmark(curatorIdx, themeIdx);
            }
            result.isSave = isSave;
            result.saves = data[0].saves;
            return result;
        };

        await Func1(async(elem) =>{
            console.log(elem);
        }).then((res) => Func2(res));

        return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.BOOKMARK_THEME, result));
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

        // console.log(result.documents.map(BookData));
        var finalResult = result.documents.map(BookData);

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.BOOK_SEARCH_SUCCESS, finalResult));
    }
}