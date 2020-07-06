const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');

const MainModel = require('../models/main');

module.exports = {
    getIllust: async(req, res)=>{
        const result = await MainModel.getIllust();

        if(result.length == 0){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_ILLUST));
            return;
        }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ILLUST_CONTENTS_SUCCESS, result));
    }

};