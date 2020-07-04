const pool = require('../modules/pool');
const encryption = require('../modules/encryption');
const crypto = require('crypto');
const table = 'sentence';

const detail = {
    getSentence : async(sentenceIdx) =>{
        const query = `SELECT * FROM ${table} WHERE sentenceIdx = "${sentenceIdx}"`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('getSentence err' + err);
        }throw err;
    }
}

module.exports = detail;