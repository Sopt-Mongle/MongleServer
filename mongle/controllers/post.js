const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');

const PostModel = require('../models/post');

module.exports = {
    createSentence : async(req, res) =>{

        const {curatorIdx, sentence, title, author, publisher} = req.body;

        if(!curatorIdx || !sentence || !title || !author || !publisher){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await PostModel.createSentence(req.body);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATE_SENTENCE_SUCCESS));

    },

    selectTheme : async(req, res) => {

        const result = await PostModel.selectTheme();
    }
};