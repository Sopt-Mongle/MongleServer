const jwt = require('../modules/jwt');
let util = require('../modules/util');
let statusCode = require('../modules/statusCode');
let resMessage = require('../modules/responseMessage');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const authUtil = {
    checkToken: async (req, res, next) => {
        var token = req.headers.token;
        const user = jwt.verify(token);
        if(token == "guest"){
            req.decoded = "guest";
        }
        else if (!token) {
            return res.json(util.fail(statusCode.BAD_REQUEST, resMessage.EMPTY_TOKEN));
        }
        else if (user == TOKEN_EXPIRED) {
            return res.json(util.fail(statusCode.UNAUTHORIZED, resMessage.EXPIRED_TOKEN));
        }
        else if (user == TOKEN_INVALID) {
            return res.json(util.fail(statusCode.UNAUTHORIZED, resMessage.INVALID_TOKEN));
        }
        else if ((await user).valueOf(0).idx == undefined) {
            return res.json(util.fail(statusCode.UNAUTHORIZED, resMessage.INVALID_TOKEN));
        }
        else{
            req.decoded = user;
        }
        next();
    }
}
module.exports = authUtil;