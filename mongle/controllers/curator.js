const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');

const CuratorModel = require('../models/curator');

module.exports = {
    getAllCurators : async(req, res) => {
        const curatorIdx = req.body.curatorIdx;
        if(!curatorIdx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        
        const result = await CuratorModel.getAllCurators(curatorIdx);

        if(result.length === 0){
            res.status(statusCode.NO_CONTENT).send(util.fail(statusCode.NO_CONTENT, resMessage.NO_CONTENT_CURATOR));
            return;
        }

        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CURATER_SHOW_ALL, result));
    }
};