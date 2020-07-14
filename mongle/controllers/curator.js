const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');

const CuratorModel = require('../models/curator');

module.exports = {
    subscribe : async(req, res) => {
        const followedIdx = req.params.followedIdx; //현재 사용자 큐레이터
        const token = req.headers.token;

        if(!token || !followedIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await CuratorModel.subscribe(token, followedIdx);

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUBSCRIBE_SUCCESS, result));
    },

    getCuratorInfo : async(req, res) => {
        const token = req.headers.token;
        const curatorIdx2 = req.params.curatorIdx;
        if(!token || !curatorIdx2){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await CuratorModel.getCuratorInfo(token, curatorIdx2);

        if(result.length === 0){
            res.status(statusCode.NO_CONTENT).send(util.fail(statusCode.NO_CONTENT, resMessage.NO_CURATOR));
            return;
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CURATOR_INFO_SUCCESS, result));
    },
    getRecommendCurator : async(req, res) => {
        const result = await CuratorModel.getRecommendCurator();

        if(result.length === 0){
            res.status(statusCode.NO_CONTENT).send(util.fail(statusCode.NO_CONTENT, resMessage.NO_CURATOR));
            return;
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECOMMEND_CURATOR_SUCCESS, result));
    },
    getThemeInCurator : async(req, res) => {
        const token = req.headers.token;
        if(!token){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        const result = await CuratorModel.getThemeInCurator(token);
        if(result.length === 0){
            res.status(statusCode.NO_CONTENT).send(util.fail(statusCode.NO_CONTENT, resMessage.NO_CURATOR));
            return;
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.THEME_IN_CURATOR_SUCCESS, result));
    },

    getCuratorByKeyword : async(req, res) => {  
        const keywordIdx = req.params.keywordIdx;
        const token = req.headers.token;
        if(!keywordIdx || !token){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        const result = await CuratorModel.getCuratorByKeyword(keywordIdx, token);

        if(result.length === 0){
            res.status(statusCode.NO_CONTENT).send(util.fail(statusCode.NO_CONTENT, resMessage.NO_CURATOR));
            return;
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CURATOR_KEYWORD_SUCCESS, result));
    },
};