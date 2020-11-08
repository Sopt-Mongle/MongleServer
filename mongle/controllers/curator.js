const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');

const CuratorModel = require('../models/curator');

module.exports = {
    subscribe : async(req, res) => {
        const followedIdx = req.params.followedIdx; //현재 사용자 큐레이터
        const curatorIdx = (await req.decoded).valueOf(0).idx;

        if(!curatorIdx || !followedIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await CuratorModel.subscribe(curatorIdx, followedIdx);

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUBSCRIBE_SUCCESS, result));
    },

    getCuratorInfo : async(req, res) => {
        const curatorIdx = (await req.decoded).valueOf(0).idx;
        const curatorIdx2 = req.params.curatorIdx;
        if(!curatorIdx || !curatorIdx2){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await CuratorModel.getCuratorInfo(curatorIdx, curatorIdx2);

        if(result.length === 0){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_CURATOR));
            return;
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CURATOR_INFO_SUCCESS, result));
    },
    getRecommendCurator : async(req, res) => {
        const result = await CuratorModel.getRecommendCurator();

        if(result.length === 0){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_CURATOR));
            return;
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECOMMEND_CURATOR_SUCCESS, result));
    },
    getThemeInCurator : async(req, res) => {
        const curatorIdx = (await req.decoded).valueOf(0).idx;
        if(!curatorIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        const result = await CuratorModel.getThemeInCurator(curatorIdx);
        if(result.length === 0){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_CURATOR));
            return;
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.THEME_IN_CURATOR_SUCCESS, result));
    },

    getCuratorByKeyword : async(req, res) => {
        const keywordIdx = req.params.keywordIdx;
        const curatorIdx = (await req.decoded).valueOf(0).idx;
        if(!keywordIdx || !curatorIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        const result = await CuratorModel.getCuratorByKeyword(keywordIdx, curatorIdx);

        if(result.length === 0){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_CURATOR));
            return;
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CURATOR_KEYWORD_SUCCESS, result));
    },
};