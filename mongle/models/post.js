const pool = require('../modules/pool');
const jwt = require('../modules/jwt');

const SentenceData = require('../modules/data/sentenceData');
const curatorData = require('../modules/data/curatorData');
const ThemeData = require('../modules/data/themeData');
const curator = require('./curator');

const post = {
    checkTheme : async (theme) =>{
        const query = `SELECT * FROM theme WHERE theme="?"`;
        try{
            const value = [theme];
            const result = await pool.queryParam_Parse(query, value);
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

    makeTheme : async(curatorIdx, theme, themeImgIdx) => {
        const fields = `theme, themeImgIdx, saves, writerIdx, count`;
        const questions = `?, ?, ?, ?, ?`;
        const values = [theme, themeImgIdx, 0, curatorIdx, 0];

        try{
            const sameCheckQuery = `SELECT * FROM theme WHERE theme = "?"`;
            const sameCheckValue = [theme];
            const sameCheckResult = await pool.queryParam_Parse(sameCheckQuery, sameCheckValue);
            if(sameCheckResult.length != 0){ //같은 이름의 테마가 있을 때
                return -1;
            }
            else{
                const themeInsertQuery = `INSERT INTO theme(${fields}) VALUES(${questions})`;
                const themeInsertResult = await pool.queryParamArr(themeInsertQuery, values);
                const themeIdx = themeInsertResult.insertId;

                const fields2 = `curatorIdx, themeIdx`;
                const questions2 = `?, ?`;
                const values2 = [curatorIdx, themeIdx];
                const curatorThemeQuery = `INSERT INTO curator_theme(${fields2}) VALUES(${questions2})`;
                await pool.queryParamArr(curatorThemeQuery, values2);

                return 0;
            }
        }
        catch(err){
            console.log('makeTheme err: ' + err);
        }throw err;
    },

    createSentence: async(curatorIdx, {sentence, title, author, publisher, thumbnail, themeIdx}) => {
        const fields = `sentence, title, author, likes, saves, writerIdx, publisher, thumbnail`;
        const questions = `?, ?, ?, ?, ?, ?, ?, ?`;
        const values = [sentence, title, author, 0, 0, curatorIdx, publisher, thumbnail];
        
        try{
            const query = `INSERT INTO sentence(${fields}) VALUES(${questions})`;
            
            const result = await pool.queryParamArr(query, values);
            const sentenceIdx = result.insertId;

            const fields2 = `curatorIdx, sentenceIdx`;
            const questions2 = `?, ?`;
            const values2 = [curatorIdx, sentenceIdx];
            const curatorSentenceQuery = `INSERT INTO curator_sentence(${fields2}) VALUES(${questions2})`;
            await pool.queryParamArr(curatorSentenceQuery, values2);

            const fields3 = `sentenceIdx, themeIdx`;
            const questions3 =`?, ?`;
            const values3 = [sentenceIdx, themeIdx];
            const themeSentenceQuery = `INSERT INTO theme_sentence(${fields3}) VALUES(${questions3})`;
            await pool.queryParamArr(themeSentenceQuery, values3);

            return sentenceIdx;
                       
        }
        catch(err){
            console.log('createSentence err: ' + err);
        }throw err;

    },

    selectTheme :   async() =>{
        //최근에 문장이 들어간 테마 순
        const query = `SELECT * FROM theme JOIN (SELECT MAX(themeSentenceIdx) as A, themeIdx FROM theme_sentence GROUP BY themeIdx ORDER BY A DESC) as T ON theme.themeIdx = T.themeIdx;`;
        try{
            let result = await pool.queryParam(query);
            
            await Promise.all(result.map(async(element) =>{
                let themeImgIdx = element.themeImgIdx;
                let writerIdx = element.writerIdx;

                let imgQuery = `SELECT img FROM themeImg WHERE themeImgIdx = ?`;
                let imgValue = [themeImgIdx];
                let imgResult = await pool.queryParam_Parse(imgQuery, imgValue);
                element.themeImg = imgResult[0].img;

                let writerQuery = `SELECT name, img FROM curator WHERE curatorIdx = ?`;
                let writerValue = [writerIdx];
                let writerResult = await pool.queryParam_Parse(writerQuery, writerValue);

                element.writer = writerResult[0].name;
                element.writerImg = writerResult[0].img;

                let themeIdx = element.themeIdx;
                let alreadyQuery = `SELECT * FROM curator_theme WHERE curatorIdx = ? AND themeIdx = ?`;
                let alreadyValues = [writerIdx, themeIdx];
                let alreadyResult = await pool.queryParam_Parse(alreadyQuery, alreadyValues);

                let alreadyBookmarked;
                if(alreadyResult.length == 0){
                    alreadyBookmarked = false;
                }
                else{
                    alreadyBookmarked = true;
                }

                element.alreadyBookmarked = alreadyBookmarked;

            }));

            let finalResult = result.map(ThemeData);

            return finalResult;

        }
        catch(err){
            console.log('selectTheme err: ' + err);
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