const pool = require('../modules/pool');
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

    createTheme : async(theme, themeImgIdx, writerIdx) => {
        const fields = `theme, themeImgIdx, saves, writerIdx, count`;
        const question = `?, ?, ?, ?, ?`;
        const values = [theme, themeImgIdx, 0, writerIdx, 0];
        const query1 = `INSERT INTO theme(${fields}) VALUES(${question})`;

        try{
            const result1 = await pool.queryParamArr(query1, values);
            return;
        }catch(err){
            console.log('crateTheme err: ' + err);
        }throw err;
    },

    createSentence: async({curatorIdx, sentence, title, author, publisher}) => {
        const fields = `sentence, title, author, likes, saves, writerIdx, publisher`;
        const questions = `?, ?, ?, ?, ?, ?, ?`;
        const values = [];

        try{
            values.push(sentence);
            values.push(title);
            values.push(author);
            values.push(0);
            values.push(0);
            values.push(curatorIdx);
            values.push(publisher);

            console.log(values);
            query = `INSERT INTO sentence(${fields}) VALUES(${questions})`;

            const result2 = await pool.queryParamArr(query, values);

            const sentenceIdx = result2.insertId;
            query = `INSERT INTO curator_sentence(curatorIdx, sentenceIdx) VALUES(${curatorIdx}, ${sentenceIdx})`;
            await pool.queryParam(query);

            return;
        }
        catch(err){
            console.log('writeSentence err: ' + err);
        }throw err;

    },

    selectTheme : async() =>{
        let query = ``;
        try{

        }
        catch(err){
            console.log('selectTheme err: ' + err);
        }throw err;
    }
};

module.exports = post;