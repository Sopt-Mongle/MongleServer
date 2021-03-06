const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');

const SearchModel = require('../models/search');

module.exports = {
    searchCurator : async(req, res) =>{
        const words = req.query.words;
        let curatorIdx;
        if(req.decoded === "guest"){
            curatorIdx = "guest"; 
        }
        else{
            curatorIdx = (await req.decoded).valueOf(0).idx;
        }
        if(!curatorIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        if(!words){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_SEARCH_WORDS));
            return;
        }

        const result = await SearchModel.searchCurator(curatorIdx, words);

        if(result.length === 0){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_SEARCH_CURATORS));
            return;
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SEARCH_CURATOR_SUCCESS, result));
    },

    searchTheme : async(req, res) =>{
        let curatorIdx;
        if(req.decoded === "guest"){
            curatorIdx = "guest"; 
        }
        else{
            curatorIdx = (await req.decoded).valueOf(0).idx;
        }
        if(!curatorIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        const words = req.query.words;

        if(!words){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_SEARCH_WORDS));
            return;
        } 
        //검색 결과 중 제일 먼저 나오는 쪽에서 최근검색어 테이블에 insert
        const result = await SearchModel.searchTheme(curatorIdx, words);
        
        if(result.length === 0){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_SEARCH_THEMES));
            return;
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SEARCH_THEMES_SUCCESS, result));
    },

    searchSentence : async(req, res)=>{
        const words = req.query.words;

        if(!words){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_SEARCH_WORDS));
            return;
        }

        const result = await SearchModel.searchSentence(words);
        
        if(result.length === 0){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_SEARCH_SENTENCES));
            return;
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SEARCH_SENTENCES_SUCCESS, result));
    },

    recentSearch : async(req, res) =>{
        let curatorIdx;
        if(req.decoded === "guest"){
            curatorIdx = "guest"; 
        }
        else{
            curatorIdx = (await req.decoded).valueOf(0).idx;
        }
        if(!curatorIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        const result = await SearchModel.recentSearch(curatorIdx);

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECENT_SEARCH_SUCCESS, result));
    },

    recentDelete : async(req, res) => {
        const curatorIdx = (await req.decoded).valueOf(0).idx;
        if(!curatorIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await SearchModel.recentDelete(curatorIdx);

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECENT_DELETE_SUCCESS));

    },

    recommendSearch : async(req, res) => {
        const result = await SearchModel.recommendSearch();
        if(result.length == 0){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_SEARCH_RECOMMEND));
        }
        
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECOMMEND_SEARCH_SUCCESS, result));

    }
};