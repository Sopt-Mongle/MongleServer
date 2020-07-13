const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');

const CuratorModel = require('../models/curator');

module.exports = {
    /*getAllCurators : async(req, res) => {
        const curatorIdx = req.body.curatorIdx;
        if(!curatorIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await CuratorModel.getAllCurators(curatorIdx);

        if(result.length === 0){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_CURATOR));
            return;
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CURATER_SHOW_ALL, result));
    },*/

    subscribe : async(req, res) => { //고쳐야함!!!!!!!
        const curatorIdx = req.params.curatorIdx; //현재 사용자 큐레이터
        const followedIdx = req.body.followedIdx; //구독 or 구독취소 할 큐레이터

        if(!curatorIdx || !followedIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await CuratorModel.subscribe(curatorIdx, followedIdx);

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUBSCRIBE_SUCCESS, result));
    },

    getCuratorInfo : async(req, res) => {
        const curatorIdx = req.body.curatorIdx; //내 idx
        const curatorIdx2 = req.params.curatorIdx;
        if(!curatorIdx || !curatorIdx2){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await CuratorModel.getCuratorInfo(curatorIdx, curatorIdx2);

        if(result.length === 0){
            res.status(statusCode.NO_CONTENT).send(util.fail(statusCode.NO_CONTENT, resMessage.NO_CURATOR));
            return;
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CURATORINFO_SUCCESS, result));
    },
    getRecommendCurator : async(req, res) => {
        const result = await CuratorModel.getRecommendCurator();

        if(result.length === 0){
            res.status(statusCode.NO_CONTENT).send(util.fail(statusCode.NO_CONTENT, resMessage.NO_CURATOR));
            return;
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CURATORINFO_SUCCESS, result));
    },
    getThemeInCurator : async(req, res) => {
        const {curatorIdx} = req.body;
        if(!curatorIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        const result = await CuratorModel.getThemeInCurator(curatorIdx);
        if(result.length === 0){
            res.status(statusCode.NO_CONTENT).send(util.fail(statusCode.NO_CONTENT, resMessage.NO_CURATOR));
            return;
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CURATORINFO_SUCCESS, result));
    },

    getCuratorByKeyword : async(req, res) => {  
        const keywordIdx = req.params.keywordIdx;
        const {curatorIdx} = req.body;
        if(!keywordIdx || !curatorIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        const result = await CuratorModel.getCuratorByKeyword(keywordIdx, curatorIdx);

        if(result.length === 0){
            res.status(statusCode.NO_CONTENT).send(util.fail(statusCode.NO_CONTENT, resMessage.NO_CURATOR));
            return;
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CURATORINFO_SUCCESS, result));
    },
};