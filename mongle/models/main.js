const pool = require('../modules/pool');
const SentenceData = require('../modules/data/sentenceData');
const main = {
    editorsPick: async()=>{
        let query = `SELECT * FROM illust`;
        try{
            let result = await pool.queryParam(query);
            return result;
        }
        catch(err){
            console.log('getIllust ERROR : ', err);
            throw err;
        }
    },
    getTodaySentence: async()=>{
        //now에서 24시간전~지금까지 좋아요가 가장 많이 찍힌 순으로 정렬해서 ~
        let themequery = `SELECT * FROM theme JOIN curator_theme ON theme.themeIdx = curator_theme.themeIdx WHERE curator_theme.curatorIdx = ${curatorIdx}`;
        let query = `SELECT * FROM sentence WHERE date(timestamp) >= DATE_SUB(NOW(), INTERVAL 24 HOUR) ORDER BY likes DESC`;
        
        try{
            let result = await pool.queryParam(query);
            return result.map(SentenceData);
        }
        catch(err){
            console.log('getTodaySentence err' + err);
        }throw err;
    }
};

module.exports = main;