const pool = require('../modules/pool');

const CuratorData = require('../modules/data/curatorData');
const ThemeData = require('../modules/data/themeData');
const SentenceData = require('../modules/data/sentenceData');

const my = {
    getMyInfo: async(curatorIdx) =>{
        let profilequery = `SELECT curatorIdx, name, img, subscribe FROM curator WHERE curatorIdx = ${curatorIdx}`;
        let themequery = `SELECT * FROM theme JOIN curator_theme ON theme.themeIdx = curator_theme.themeIdx WHERE curator_theme.curatorIdx = ${curatorIdx}`;
        let sentencequery = `SELECT * FROM sentence JOIN curator_sentence ON sentence.sentenceIdx = curator_sentence.sentenceIdx 
                            WHERE curator_sentence.curatorIdx = ${curatorIdx}`;

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
    }
};

module.exports = my;