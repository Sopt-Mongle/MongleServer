const pool = require('../modules/pool');
const jwt = require('../modules/jwt');

const SentenceData = require('../modules/data/sentenceData');
const curatorData = require('../modules/data/curatorData');
const ThemeData = require('../modules/data/themeData');

const post = {
    checkTheme : async (theme) =>{
        const query = `SELECT * FROM theme WHERE theme="${theme}"`;
        try{
        const result = await pool.queryParam(query);
        if(result.length === 0)
            {
                return false;
            }
        else
            {
                return true;
            }
        }catch(err){
            console.log('checkTheme err: ', err);
            throw err;
        }
    },

    makeTheme : async(token, theme, themeImgIdx) => {
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
        let query = `SELECT * FROM theme WHERE theme = "${theme}"`;
        try{
            const sameCheckResult = await pool.queryParam(query);
            if(sameCheckResult.length != 0){ //같은 이름의 테마가 있을 때
                return -1;
            }
            else{
                query = `INSERT INTO theme(theme, themeImgIdx, saves, writerIdx, count) VALUES("${theme}", "${themeImgIdx}", 0, ${curatorIdx}, 0)`;
                const themeInsertResult = await pool.queryParam(query);
                const themeIdx = themeInsertResult.insertId;

                query = `INSERT INTO curator_theme(curatorIdx, themeIdx) VALUES(${curatorIdx}, ${themeIdx})`;
                await pool.queryParam(query);

                return 0;
            }
        }
        catch(err){
            console.log('makeTheme err: ' + err);
        }throw err;
    },

    createSentence: async(token, {sentence, title, author, publisher, themeIdx}) => {
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
        const fields = `sentence, title, author, likes, saves, writerIdx, publisher`;
        const questions = `?, ?, ?, ?, ?, ?, ?`;
        const values = [sentence, title, author, 0, 0, curatorIdx, publisher];

        try{
            if(themeIdx === 0){ //테마없는 테마 선택한 문장일 경우
                //empty_sentence 에 insert
                let query = `INSERT INTO empty_sentence(sentence, title, author, publisher, writerIdx) VALUES("${sentence}", "${title}", "${author}", "${publisher}", ${curatorIdx})`;
                const result1 = await pool.queryParam(query);
                let sentenceIdx = result1.insertId;
                query = `INSERT INTO empty_curator_sentence(curatorIdx, sentenceIdx) VALUES(${curatorIdx}, ${sentenceIdx})`;
                await pool.queryParam(query);
                return -1;

            }
            else{ //특정 테마 선택한 문장일 경우
                let query = `INSERT INTO sentence(${fields}) VALUES(${questions})`;
                const result2 = await pool.queryParamArr(query, values);
                let sentenceIdx = result2.insertId;
                query = `INSERT INTO curator_sentence(curatorIdx, sentenceIdx) VALUES(${curatorIdx}, ${sentenceIdx})`;
                await pool.queryParam(query);
                query = `INSERT INTO theme_sentence(sentenceIdx, themeIdx) VALUES(${sentenceIdx}, ${themeIdx})`;
                await pool.queryParam(query);
                return 0;
            }
            
        }
        catch(err){
            console.log('createSentence err: ' + err);
        }throw err;

    },

    selectTheme :   async() =>{
        //최근에 문장이 들어간 테마 순
        let query = `SELECT * FROM theme JOIN (SELECT MAX(themeSentenceIdx) as A, themeIdx FROM theme_sentence GROUP BY themeIdx ORDER BY A DESC) as T ON theme.themeIdx = T.themeIdx;`;
        try{
            const result = await pool.queryParam(query);
            
            await Promise.all(result.map(async(element) =>{
                let themeImgIdx = element.themeImgIdx;
                let writerIdx = element.writerIdx;

                query = `SELECT img FROM themeImg WHERE themeImgIdx = ${themeImgIdx}`;
                let imgResult = await pool.queryParam(query);
                element.themeImg = imgResult[0].img;

                query = `SELECT name, img FROM curator WHERE curatorIdx = ${writerIdx}`;
                let writerResult = await pool.queryParam(query);

                element.writer = writerResult[0].name;
                element.writerImg = writerResult[0].img;

                let themeIdx = element.themeIdx;
                query = `SELECT * FROM curator_theme WHERE curatorIdx = ${writerIdx} AND themeIdx = ${themeIdx}`;
                let alreadyResult = await pool.queryParam(query);

                let alreadyBookmarked;
                if(alreadyResult.length == 0){
                    alreadyBookmarked = false;
                }
                else{
                    alreadyBookmarked = true;
                }

                element.alreadyBookmarked = alreadyBookmarked;

            }));

            return result;

        }
        catch(err){
            console.log('selectTheme err: ' + err);
        }throw err;
    },

    getEmptySentence : async(token) => {
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
        console.log(curatorIdx);
        let query = `SELECT * FROM empty_sentence JOIN empty_curator_sentence ON empty_sentence.sentenceIdx = empty_curator_sentence.sentenceIdx WHERE empty_curator_sentence.curatorIdx = ${curatorIdx}`;
        try{
            let result = {};
            sentenceResult = await pool.queryParam(query);
            const sentenceNum = sentenceResult.length;
            result.num = sentenceNum;
            result.sentences = sentenceResult.map(SentenceData);

            return result;
        }
        catch(err){
            console.log('getEmptySentence err: ' + err);
        }throw err;
    },

    setTheme : async(token, themeIdx, sentenceIdx, sentence, title, author, publisher) => {
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
        const deleteQuery1 = `DELETE FROM empty_sentence WHERE sentenceIdx = ${sentenceIdx}`;
        const insertQuery1 = `INSERT INTO sentence(sentence, title, author, publisher, likes, saves, writerIdx)
                                            VALUES("${sentence}", "${title}", "${author}", "${publisher}", 0, 0, ${curatorIdx})`;
        
        try{
            await pool.queryParam(deleteQuery1);

            const insertResult = await pool.queryParam(insertQuery1);
            const sentenceIdx2 = insertResult.insertId;
            const insertQuery2 = `INSERT INTO theme_sentence(sentenceIdx, themeIdx) VALUES(${sentenceIdx2}, ${themeIdx})`;
            await pool.queryParam(insertQuery2);

            const insertQuery3 = `INSERT INTO curator_sentence(curatorIdx, sentenceIdx) VALUES(${curatorIdx}, ${sentenceIdx2})`;
            await pool.queryParam(insertQuery3);

            return;
            
        }
        catch(err){
            console.log('setTheme err: ' + err);
        }throw err;
    },

    themeImg : async() => {
        const query = `SELECT * FROM themeImg`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }
        catch(err){
            console.log('themeImg err: ' + err);
        }throw err;
    }
};

module.exports = post;