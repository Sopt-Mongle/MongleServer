const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');

const SearchModel = require('../models/search');

module.exports = {
    searchCurator : async(req, res) =>{

    },

    searchTheme : async(req, res) =>{
        const curatorIdx = req.body.curatorIdx;
        const words = req.body.words;
        // console.log(req.body);

        if(!words){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_SEARCH_WORDS));
            return;
        }
        if(!curatorIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_CURATOR));
        }

        const result = await SearchModel.searchTheme(curatorIdx, words);
        
        if(result.length === 0){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_SEARCH_THEMES));
            return;
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SEARCH_THEMES_SUCCESS, result));
    },

    searchSentence : async(req, res)=>{
        const words = req.body.words;
        // console.log(words);

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
        const curatorIdx = req.body.curatorIdx;

        if(!curatorIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE_CURATOR));
        }

        const result = await SearchModel.recentSearch(curatorIdx);

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SEARCH_SENTENCES_SUCCESS, result));
    }

};