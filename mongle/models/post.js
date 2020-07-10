const pool = require('../modules/pool');

const my = {
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

module.exports = my;