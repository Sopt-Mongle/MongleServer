const util = require('../modules/util');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');

const detailModel = require('../models/detail');

module.exports = {
    getSentence : async(req,res) =>{
        const sentenceIdx = req.params.sentenceIdx;
        if(!sentenceIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_SENTENCE));
        }

        const token = req.headers.token;
        if(!token){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const data = await detailModel.getSentence(token, sentenceIdx);
        if(data == -1){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.READ_SENTENCE_FAIL));
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_SENTENCE, data));
    },

    likeSentence : async(req, res) =>{
        const sentenceIdx = req.params.sentenceIdx;
        if(!sentenceIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_SENTENCE));
        }
        const token = req.headers.token;
        if(!token){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        function Func1(){
            const isLike = detailModel.isLike(token, sentenceIdx);
            return isLike;
        };

        let data;
        var result = {};
        async function Func2(isLike){
            if(!isLike){//이미 좋아요이니까 취소
                data = await detailModel.deleteLike(token, sentenceIdx);
            }
            else{//좋아요 추가
                data = await detailModel.addLike(token, sentenceIdx);
            }
            
            result.isLike = isLike;
            result.likes = data[0].likes;
            
            return result;
        };

        await Func1(async(elem) =>{
            console.log(elem);
        }).then((res) => Func2(res));

        return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.LIKE_SENTENCE, result));
    },

    bookmarkSentence : async(req, res) =>{
        const sentenceIdx = req.params.sentenceIdx;
        if(!sentenceIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_SENTENCE));
        }
        const token = req.headers.token;
        if(!token){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        function Func1(){
            const isSave = detailModel.isBookmark(token, sentenceIdx);
            return isSave;
        };

        let data;
        var result = {};
        async function Func2(isSave){
            if(!isSave){//이미 구독중이니까 구독취소
                data = await detailModel.deleteBookmark(token, sentenceIdx);
            }
            else{//구독 추가
                data = await detailModel.addBookmark(token, sentenceIdx);
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

    otherSentence : async(req, res) =>{
        const sentenceIdx = req.params.sentenceIdx;
        if(!sentenceIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_SENTENCE));
        }

        const token = req.headers.token;
        if(!token){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await detailModel.otherSentence(token, sentenceIdx);
        return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SHOW_OTHER_SENTENCE, result));
    },

    getTheme : async(req, res) =>{
        const themeIdx = req.params.themeIdx;
        if(!themeIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_THEME));
        }

        const token = req.headers.token;
        if(!token){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        
        const result = await detailModel.getTheme(token, themeIdx);
        if(result == -1){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.READ_THEME_FAIL));
        }
        return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_THEME, result));
    },

    bookmarkTheme : async(req, res) =>{
        const themeIdx = req.params.themeIdx;
        if(!themeIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_THEME));
        }
        const token = req.headers.token;
        if(!token){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        function Func1(){
            const isSave = detailModel.themeIsBookmark(token, themeIdx);
            return isSave;
        };

        let data;
        var result = {};
        async function Func2(isSave){
            if(!isSave){//이미 구독중이니까 구독취소
                data = await detailModel.themeDeleteBookmark(token, themeIdx);
            }
            else{//구독 추가
                data = await detailModel.themeAddBookmark(token, themeIdx);
            }
            result.isSave = isSave;
            result.saves = data[0].saves;
            return result;
        };

        await Func1(async(elem) =>{
            console.log(elem);
        }).then((res) => Func2(res));

        return await res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.BOOKMARK_THEME, result));
    }
}