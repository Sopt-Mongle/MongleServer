const pool = require('../modules/pool');

const ThemeData = require('../modules/data/themeData');
const SentenceData = require('../modules/data/sentenceData');

const detail = {
    getSentence : async(curatorIdx, sentenceIdx) =>{
        let query = `SELECT * FROM sentence WHERE sentenceIdx = "${sentenceIdx}"`;
        try{
            const firstResult = await pool.queryParam(query);

            query = `SELECT * FROM curator_sentence WHERE curatorIdx = ${curatorIdx} AND sentenceIdx = ${sentenceIdx}`;
            const alreadyResult = await pool.queryParam(query);

            let alreadyBookmarked;
            if(alreadyResult.length == 0){
                alreadyBookmarked = false;
            }
            else{
                alreadyBookmarked = true;
            }

            let result;
            result = firstResult.map(SentenceData);
            result[0].alreadyBookmarked = alreadyBookmarked;
            
            return result;
        }catch(err){
            console.log('getSentence err: ' + err);
        }throw err;
    },

    isLike: async(curatorIdx, sentenceIdx) => {
        let query = `SELECT COUNT(*) as cnt FROM curator_sentence_like WHERE curatorIdx = ${curatorIdx} and sentenceIdx = ${sentenceIdx}`;
        try{
            const result = await pool.queryParam(query);
            if(result[0].cnt === 0){
                return true;
            }
            else{
                return false;
            }
        }catch(err){
            console.log('isLike err: ' + err);
        }throw err;
    },

    deleteLike: async(curatorIdx, sentenceIdx) =>{
        let query1 = `DELETE FROM curator_sentence_like WHERE curatorIdx="${curatorIdx}" and sentenceIdx="${sentenceIdx}"`;
        let query2 = `UPDATE sentence SET likes = likes-1 WHERE sentenceIdx="${sentenceIdx}"`;
        let query3 = `SELECT likes FROM sentence WHERE sentenceIdx="${sentenceIdx}"`;
        try{
            const result1 = await pool.queryParam(query1);
            const result2 = await pool.queryParam(query2);
            const result3 = await pool.queryParam(query3);
            return result3;
        }catch(err){
            console.log('deleteLike err: ' + err);
        }throw err;
    },

    addLike: async(curatorIdx, sentenceIdx) =>{
        const fields = `curatorIdx, sentenceIdx`;
        const question = `?,?`;
        const values = [curatorIdx, sentenceIdx];
        
        let query1 = `INSERT INTO curator_sentence_like(${fields}) VALUES(${question})`;
        let query2 = `UPDATE sentence SET likes = likes+1 WHERE sentenceIdx="${sentenceIdx}"`;
        let query3 = `SELECT likes FROM sentence WHERE sentenceIdx="${sentenceIdx}"`;
        try{
            const result1 = await pool.queryParamArr(query1, values);
            const result2 = await pool.queryParam(query2);
            const result3 = await pool.queryParam(query3);
            return result3;
        }catch(err){
            console.log('addLike err: ' + err);
        }throw err;
    },

    isBookmark: async(curatorIdx, sentenceIdx) => {
        let query = `SELECT COUNT(*) as cnt FROM curator_sentence WHERE curatorIdx = ${curatorIdx} and sentenceIdx = ${sentenceIdx}`;
        try{
            const result = await pool.queryParam(query);
            if(result[0].cnt === 0){
                return true;
            }
            else{
                return false;
            }
        }catch(err){
            console.log('isBookmark err: ' + err);
        }throw err;
    },

    deleteBookmark: async(curatorIdx, sentenceIdx) =>{
        let query1 = `DELETE FROM curator_sentence WHERE curatorIdx="${curatorIdx}" and sentenceIdx="${sentenceIdx}"`;
        let query2 = `UPDATE sentence SET saves = saves-1 WHERE sentenceIdx="${sentenceIdx}"`;
        let query3 = `SELECT saves FROM sentence WHERE sentenceIdx="${sentenceIdx}"`;
        try{
            const result1 = await pool.queryParam(query1);
            const result2 = await pool.queryParam(query2);
            const result3 = await pool.queryParam(query3);
            return result3;
        }catch(err){
            console.log('deleteBookmark err: ' + err);
        }throw err;
    },

    addBookmark: async(curatorIdx, sentenceIdx) =>{
        const fields = `curatorIdx, sentenceIdx`;
        const question = `?,?`;
        const values = [curatorIdx, sentenceIdx];
        
        let query1 = `INSERT INTO curator_sentence(${fields}) VALUES(${question})`;
        let query2 = `UPDATE sentence SET saves = saves+1 WHERE sentenceIdx="${sentenceIdx}"`;
        let query3 = `SELECT saves FROM sentence WHERE sentenceIdx="${sentenceIdx}"`;
        try{
            const result1 = await pool.queryParamArr(query1, values);
            const result2 = await pool.queryParam(query2);
            const result3 = await pool.queryParam(query3);
            return result3;
        }catch(err){
            console.log('addBookmark err: ' + err);
        }throw err;
    },

    otherSentence: async(curatorIdx, sentenceIdx)=>{
        let query = `SELECT * FROM sentence WHERE sentence.sentenceIdx IN (SELECT sentenceIdx FROM theme_sentence WHERE theme_sentence.themeIdx IN (SELECT themeIdx FROM theme_sentence WHERE sentenceIdx = ${sentenceIdx}) AND sentenceIdx != ${sentenceIdx}) ORDER BY timestamp DESC LIMIT 2`;
        try{
            const firstResult = await pool.queryParam(query);

            await Promise.all(firstResult.map(async(element) => {
                let elemSentenceIdx = element.sentenceIdx;
                query = `SELECT * FROM curator_sentence WHERE curatorIdx = ${curatorIdx} AND sentenceIdx = ${elemSentenceIdx}`;
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

            return firstResult.map(SentenceData);
        }
        catch(err){
            console.log('otherSentence err: ' + err);
        }throw err;
    },

    getTheme : async(curatorIdx, themeIdx) =>{
        let query = `SELECT * FROM theme WHERE themeIdx = ${themeIdx}`;
        try{
            const themeResult = await pool.queryParam(query);

            query = `UPDATE theme SET count = count+1 WHERE themeIdx = ${themeIdx}`;
            await pool.queryParam(query);

            query = `SELECT * FROM curator_theme WHERE curatorIdx = ${curatorIdx} AND themeIdx = ${themeIdx}`;
            const alreadyResult = await pool.queryParam(query);

            let alreadyBookmarked;
            if(alreadyResult.length == 0){
                alreadyBookmarked = false;
            }
            else{
                alreadyBookmarked = true;
            }
            
            query = `SELECT * FROM sentence WHERE sentence.sentenceIdx IN (SELECT sentenceIdx FROM theme_sentence JOIN theme WHERE theme_sentence.themeIdx = theme.themeIdx AND theme.themeIdx = ${themeIdx})`;
            const sentenceResult = await pool.queryParam(query);
;
            let result = {};
            result.theme = themeResult.map(ThemeData);
            result.theme[0].alreadyBookmarked = alreadyBookmarked;
            result.sentence = sentenceResult.map(SentenceData);

            return result;
        }
        catch(err){
            console.log('getTheme err: ' + err);
        }throw err;
    },

    themeIsLike: async(curatorIdx, themeIdx) => {
        let query = `SELECT COUNT(*) as cnt FROM curator_theme_like WHERE curatorIdx = ${curatorIdx} and themeIdx = ${themeIdx}`;
        try{
            const result = await pool.queryParam(query);
            if(result[0].cnt === 0){
                return true;
            }
            else{
                return false;
            }
        }catch(err){
            console.log('themeIsLike err: ' + err);
        }throw err;
    },

    themeDeleteLike: async(curatorIdx, themeIdx) =>{
        let query1 = `DELETE FROM curator_theme_like WHERE curatorIdx="${curatorIdx}" and themeIdx="${themeIdx}"`;
        let query2 = `UPDATE theme SET likes = likes-1 WHERE themeIdx="${themeIdx}"`;
        let query3 = `SELECT likes FROM theme WHERE themeIdx="${themeIdx}"`;
        try{
            const result1 = await pool.queryParam(query1);
            const result2 = await pool.queryParam(query2);
            const result3 = await pool.queryParam(query3);
            return result3;
        }catch(err){
            console.log('themeDeleteLike err: ' + err);
        }throw err;
    },

    themeAddLike: async(curatorIdx, themeIdx) =>{
        const fields = `curatorIdx, themeIdx`;
        const question = `?,?`;
        const values = [curatorIdx, themeIdx];
        
        let query1 = `INSERT INTO curator_theme_like(${fields}) VALUES(${question})`;
        let query2 = `UPDATE theme SET likes = likes+1 WHERE themeIdx="${themeIdx}"`;
        let query3 = `SELECT likes FROM theme WHERE themeIdx="${themeIdx}"`;
        try{
            const result1 = await pool.queryParamArr(query1, values);
            const result2 = await pool.queryParam(query2);
            const result3 = await pool.queryParam(query3);
            return result3;
        }catch(err){
            console.log('themeAddLike err: ' + err);
        }throw err;
    },

    themeIsBookmark: async(curatorIdx, themeIdx) => {
        let query = `SELECT COUNT(*) as cnt FROM curator_theme WHERE curatorIdx = ${curatorIdx} and themeIdx = ${themeIdx}`;
        try{
            const result = await pool.queryParam(query);
            if(result[0].cnt === 0){
                return true;
            }
            else{
                return false;
            }
        }catch(err){
            console.log('themeIsBookmark err: ' + err);
        }throw err;
    },

    themeDeleteBookmark: async(curatorIdx, themeIdx) =>{
        let query1 = `DELETE FROM curator_theme WHERE curatorIdx="${curatorIdx}" and themeIdx="${themeIdx}"`;
        let query2 = `UPDATE theme SET saves = saves-1 WHERE themeIdx="${themeIdx}"`;
        let query3 = `SELECT saves FROM theme WHERE themeIdx="${themeIdx}"`;
        try{
            const result1 = await pool.queryParam(query1);
            const result2 = await pool.queryParam(query2);
            const result3 = await pool.queryParam(query3);
            return result3;
        }catch(err){
            console.log('themeDeleteBookmark err: ' + err);
        }throw err;
    },

    themeAddBookmark: async(curatorIdx, themeIdx) =>{
        const fields = `curatorIdx, themeIdx`;
        const question = `?,?`;
        const values = [curatorIdx, themeIdx];
        
        let query1 = `INSERT INTO curator_theme(${fields}) VALUES(${question})`;
        let query2 = `UPDATE theme SET saves = saves+1 WHERE themeIdx="${themeIdx}"`;
        let query3 = `SELECT saves FROM theme WHERE themeIdx="${themeIdx}"`;
        try{
            const result1 = await pool.queryParamArr(query1, values);
            const result2 = await pool.queryParam(query2);
            const result3 = await pool.queryParam(query3);
            return result3;
        }catch(err){
            console.log('themeAddBookmark err: ' + err);
        }throw err;
    },
}

module.exports = detail;