const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const PostModel = require('../models/post');

module.exports = {
    createTheme : async(req, res) => {
        const {theme, themeImgIdx, curatorIdx} = req.body;
        if(!theme || !themeImgIdx || !curatorIdx){
            return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }

        function Func1(){
            const check = PostModel.checkTheme(theme);
            return check;
        };

        async function Func2(check){
            if(check){//이미 작성된 테마인지 확인
                return await res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.ALREADY_THEME));
            }
            else{
                const result = await PostModel.createTheme(theme, themeImgIdx, curatorIdx);
                return result;
            }
        };

        await Func1(async(elem) =>{
            console.log(elem);
        }).then((res) => Func2(res));

        // if(result.length === 0){
        //     res.status(statusCode.NO_CONTENT).send(util.fail(statusCode.NO_CONTENT, resMessage.NO_CONTENT_CURATOR));
        //     return;
        // }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_THEME));

    },
    
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