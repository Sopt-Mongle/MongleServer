const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');

const MyModel = require('../models/my');

module.exports = {
    getMyInfo : async(req, res) => {
        const {curatorIdx} = req.body;
        if(!curatorIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await MyModel.getMyInfo(curatorIdx);

        if(result.length === 0){
            res.status(statusCode.NO_CONTENT).send(util.fail(statusCode.NO_CONTENT, resMessage.NO_CONTENT_CURATOR));
            return;
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.MYINFO_SUCCESS, result));
    },

    deleteSentence : async(req, res) => {
        const sentenceIdx = req.params.sentenceIdx;
        if(!sentenceIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await MyModel.deleteSentence(sentenceIdx);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DELETE_SENTENCE_SUCCESS, {deleteSentenceIdx:sentenceIdx}));
    }
};