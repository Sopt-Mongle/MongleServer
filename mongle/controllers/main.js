const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');

const MainModel = require('../models/main');
const moment = require('moment');


module.exports = {
    editorsPick: async(req, res)=>{
        const result = await MainModel.editorsPick();

        if(result.length == 0){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_EDITORS_PICK));
            return;
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EDITORS_PICK_SUCCESS, result));
    },

    getTodaySentence: async(req, res)=>{
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

        const result = await MainModel.getTodaySentence(curatorIdx);
        if(result.length == 0){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_TODAY_SENTENCE));
            return;
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.TODAY_SENTENCE_SUCCESS, result));
        
    },
    getTodayCurator: async(req, res)=>{
        const result = await MainModel.getTodayCurator();
        if(result.length == 0){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_CURATOR));
            return;
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.TODAY_CURATOR_SUCCESS, result));
        
    },
    getTodayTheme: async(req, res)=>{
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
        const result = await MainModel.getTodayTheme(curatorIdx);
        if(result.length == 0){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_TODAY_THEME));
            return;
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.TODAY_THEME_SUCCESS, result));        
    },

    getWaitTheme: async(req, res)=>{
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

        const result = await MainModel.getWaitTheme(curatorIdx);

        if(result.length == 0){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_WAIT_THEME));
        }
        else{
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.WAIT_THEME_SUCCESS, result));
        }

    },

    getNowTheme: async(req, res)=>{
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
        const result = await MainModel.getNowTheme(curatorIdx);
        if(result.length == 0){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_NOW_THEME));
            return;
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.NOW_THEME_SUCCESS, result));
    }
};