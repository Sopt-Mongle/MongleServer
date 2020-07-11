const pool = require('../modules/pool');

const CuratorData = require('../modules/data/curatorData');
const ThemeData = require('../modules/data/themeData');
const SentenceData = require('../modules/data/sentenceData');

const my = {
    getMyInfo: async(curatorIdx) =>{
        let profilequery = `SELECT curatorIdx, name, img, subscribe FROM curator WHERE curatorIdx = ${curatorIdx}`;//프로필조회
        let themequery = `SELECT * FROM theme JOIN curator_theme ON theme.themeIdx = curator_theme.themeIdx WHERE curator_theme.curatorIdx = ${curatorIdx}`;//테마조회
        let sentencequery = `SELECT * FROM sentence JOIN curator_sentence ON sentence.sentenceIdx = curator_sentence.sentenceIdx 
                            WHERE curator_sentence.curatorIdx = ${curatorIdx}`;//문장조회

        try{
            let profileResult = await pool.queryParam(profilequery);
            let themeResult = await pool.queryParam(themequery);
            let sentenceResult = await pool.queryParam(sentencequery);
            let resultArray = new Array();
            let keyword;
            await Promise.all(profileResult.map(async(element) =>{
                let curatorIdx = element.curatorIdx;
                query = `SELECT keyword FROM keyword JOIN curator ON keyword.keywordIdx = curator.keywordIdx WHERE curatorIdx = ${curatorIdx}`;
                keyword = await pool.queryParam(query);
                element.keyword = keyword[0].keyword;
            }));

            resultArray.push(profileResult.map(CuratorData));
            resultArray.push(themeResult.map(ThemeData));
            resultArray.push(sentenceResult.map(SentenceData));
            return resultArray;
        }
        catch(err){
            console.log('getMyInfo err : ', err);
            throw err;
        }
    },

    deleteSentence: async(sentenceIdx) => {
        let query = `DELETE FROM sentence WHERE sentenceIdx = ${sentenceIdx}`;
        try{
            let result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('deleteSentence err: ', err);
        }throw err;
    },

    editSentence: async(sentenceIdx, sentence) => {
        let query = `UPDATE sentence SET sentence = "${sentence}" WHERE sentenceIdx = ${sentenceIdx}`;
        try{
            let result = await pool.queryParam(query);
            let query1 = `SELECT sentence FROM sentence WHERE sentenceIdx = ${sentenceIdx}`;//수정한 문장 리턴
            let result1 = await pool.queryParam(query1);
            return result1;
        }catch(err){
            console.log('editSentence err: ', err);
        }throw err;
    }
};

module.exports = my;