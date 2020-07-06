const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');

const SearchModel = require('../models/search');

module.exports = {
    searchCurator : async(req, res) =>{

    },

    searchTheme : async(req, res) =>{

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
    }

};