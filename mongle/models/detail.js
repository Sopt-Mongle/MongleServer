const pool = require('../modules/pool');
const encryption = require('../modules/encryption');
const crypto = require('crypto');
const sentence = 'sentence';
const curator_sentence_like = 'curator_sentence_like';

const sentences = {
    getSentence : async(sentenceIdx) =>{
        const query = `SELECT * FROM ${sentence} WHERE sentenceIdx = "${sentenceIdx}"`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('getSentence err' + err);
        }throw err;
    },

    isLike: async(curatorIdx, sentenceIdx) => {
        let query = `SELECT COUNT(*) as cnt FROM ${curator_sentence_like} WHERE curatorIdx = ${curatorIdx} and sentenceIdx = ${sentenceIdx}`;
        try{
            const result = await pool.queryParam(query);
            if(result[0].cnt === 0){
                return false;
            }
            else{
                return true;
            }
        }catch(err){
            console.log('isLike err' + err);
        }throw err;
    },

    deleteLike: async(curatorIdx, sentenceIdx) =>{
        let query1 = `DELETE FROM ${curator_sentence_like} WHERE curatorIdx="${curatorIdx}" and sentenceIdx="${sentenceIdx}"`;
        let query2 = `UPDATE ${sentence} SET likes = likes-1 WHERE sentenceIdx="${sentenceIdx}"`;
        let query3 = `SELECT likes FROM ${sentence} WHERE sentenceIdx="${sentenceIdx}"`;
        try{
            const result1 = await pool.queryParam(query1);
            const result2 = await pool.queryParam(query2);
            const result3 = await pool.queryParam(query3);
            return result3;
        }catch(err){
            console.log('deleteLike err' + err);
        }throw err;
    },

    addLike: async(curatorIdx, sentenceIdx) =>{
        const fields = `curatorIdx, sentenceIdx`;
        const question = `?,?`;
        const values = [curatorIdx, sentenceIdx];
        
        let query1 = `INSERT INTO ${curator_sentence_like}(${fields}) VALUES(${question})`;
        let query2 = `UPDATE ${sentence} SET likes = likes+1 WHERE sentenceIdx="${sentenceIdx}"`;
        let query3 = `SELECT likes FROM ${sentence} WHERE sentenceIdx="${sentenceIdx}"`;
        try{
            const result1 = await pool.queryParamArr(query1, values);
            const result2 = await pool.queryParam(query2);
            const result3 = await pool.queryParam(query3);
            return result3;
        }catch(err){
            console.log('addLike err' + err);
        }throw err;
    }
}

module.exports = sentences;