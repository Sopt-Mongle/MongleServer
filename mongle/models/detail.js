const pool = require('../modules/pool');
const jwt = require('../modules/jwt');
const ThemeData = require('../modules/data/themeData');
const SentenceData = require('../modules/data/sentenceData');

const detail = {
    getSentence : async(token, sentenceIdx) =>{
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
        let query = `SELECT * FROM sentence WHERE sentenceIdx = "${sentenceIdx}"`;
        try{
            const firstResult = await pool.queryParam(query);
            let result;
            result = firstResult.map(SentenceData);

            //문장 writer 정보
            const writerIdx = firstResult[0].writerIdx;
            query = `SELECT name, img FROM curator WHERE curatorIdx = ${writerIdx}`;
            const writerResult = await pool.queryParam(query);
            result[0].writer = writerResult[0].name;
            result[0].writerImg = writerResult[0].img;

            //문장 북마크 여부
            const sentenceIdx = firstResult[0].sentenceIdx;
            query = `SELECT * FROM curator_sentence WHERE curatorIdx = ${curatorIdx} AND sentenceIdx = ${sentenceIdx}`;
            const sentenceBookmarkedResult = await pool.queryParam(query);
            if(sentenceBookmarkedResult.length == 0){
                result[0].alreadyBookmarked = false;
            }
            else{
                result[0].alreadyBookmarked = true;
            }

            //문장 좋아요 여부
            query = `SELECT * FROM curator_sentence_like WHERE curatorIdx = ${curatorIdx} AND sentenceIdx = ${sentenceIdx}`;
            const sentenceLikedResult = await pool.queryParam(query);
            if(sentenceLikedResult.length == 0){
                result[0].alreadyLiked = false;
            }
            else{
                result[0].alreadyLiked = true;
            }

            //테마 정보
            query = `SELECT * FROM theme_sentence WHERE sentenceIdx = ${sentenceIdx}`;
            const themeInfoResult = await pool.queryParam(query);
            const themeIdx = themeInfoResult[0].themeIdx;
            result[0].themeIdx = themeIdx;
            query = `SELECT theme FROM theme WHERE themeIdx = ${themeIdx}`;
            const themeNameResult = await pool.queryParam(query);
            result[0].theme = themeNameResult[0].theme;
            
            return result;
        }catch(err){
            console.log('getSentence err: ' + err);
        }throw err;
    },

    isLike: async(token, sentenceIdx) => {
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
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

    deleteLike: async(token, sentenceIdx) =>{
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
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

    addLike: async(token, sentenceIdx) =>{
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
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

    isBookmark: async(token, sentenceIdx) => {
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
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

    deleteBookmark: async(token, sentenceIdx) =>{
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
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

    addBookmark: async(token, sentenceIdx) =>{
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
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

    otherSentence: async(token, sentenceIdx)=>{
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
        let query = `SELECT * FROM sentence WHERE sentence.sentenceIdx IN (SELECT sentenceIdx FROM theme_sentence WHERE theme_sentence.themeIdx IN (SELECT themeIdx FROM theme_sentence WHERE sentenceIdx = ${sentenceIdx}) AND sentenceIdx != ${sentenceIdx}) ORDER BY timestamp DESC LIMIT 2`;
        try{
            const firstResult = await pool.queryParam(query);

            await Promise.all(firstResult.map(async(element) => {
                //writer 정보
                let writerIdx = element.writerIdx;
                query = `SELECT name, img FROM curator WHERE curatorIdx = ${writerIdx}`;
                let writerResult = await pool.queryParam(query);
                element.writer = writerResult[0].name;
                element.writerImg = writerResult[0].img;

            }));

            return firstResult.map(SentenceData);
        }
        catch(err){
            console.log('otherSentence err: ' + err);
        }throw err;
    },

    getTheme : async(token, themeIdx) =>{
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
        let query = `SELECT * FROM theme WHERE themeIdx = ${themeIdx}`;
        try{
            //--- theme ---
            const themeResult = await pool.queryParam(query);
            let result = {};
            result.theme = themeResult.map(ThemeData);

            //테마 배경 이미지
            const themeImgIdx = themeResult[0].themeImgIdx;
            query = `SELECT img FROM themeImg WHERE themeImgIdx = ${themeImgIdx}`;
            const themeImgResult = await pool.queryParam(query);
            result.theme[0].themeImg = themeImgResult[0].img;

            //테마 writer 정보
            const writerIdx = themeResult[0].writerIdx;
            query = `SELECT name, img FROM curator WHERE curatorIdx = ${writerIdx}`;
            const writerResult = await pool.queryParam(query);
            result.theme[0].writer = writerResult[0].name;
            result.theme[0].writerImg = writerResult[0].img;

            //테마 조회수
            query = `UPDATE theme SET count = count+1 WHERE themeIdx = ${themeIdx}`;
            await pool.queryParam(query);

            //북마크 여부
            query = `SELECT * FROM curator_theme WHERE curatorIdx = ${curatorIdx} AND themeIdx = ${themeIdx}`;
            const alreadyResult = await pool.queryParam(query);
            if(alreadyResult.length == 0){
                result.theme[0].alreadyBookmarked = false;
            }
            else{
                result.theme[0].alreadyBookmarked = true;
            }

            //안에 문장 수
            query = `SELECT COUNT(*) as num FROM theme_sentence WHERE themeIdx = ${themeIdx}`;
            const sentenceNum = await pool.queryParam(query);
            result.theme[0].sentenceNum = sentenceNum[0].num;
            
            //--- sentences ---
            query = `SELECT * FROM sentence WHERE sentence.sentenceIdx IN (SELECT sentenceIdx FROM theme_sentence JOIN theme WHERE theme_sentence.themeIdx = theme.themeIdx AND theme.themeIdx = ${themeIdx})`;
            const sentenceResult = await pool.queryParam(query);

            await Promise.all(sentenceResult.map(async(element) =>{
                //문장 writer 정보
                let writerIdx = element.writerIdx;
                query = `SELECT name, img FROM curator WHERE curatorIdx = ${writerIdx}`;
                let writerResult = await pool.queryParam(query);
                element.writer = writerResult[0].name;
                element.writerImg = writerResult[0].img;

                //문장 북마크 여부
                let sentenceIdx = element.sentenceIdx;
                query = `SELECT * FROM curator_sentence WHERE curatorIdx = ${curatorIdx} AND sentenceIdx = ${sentenceIdx}`;
                const sentenceBookmarkedResult = await pool.queryParam(query);
                if(sentenceBookmarkedResult.length == 0){
                    element.alreadyBookmarked = false;
                }
                else{
                    element.alreadyBookmarked = true;
                }

                //문장 좋아요 여부
                query = `SELECT * FROM curator_sentence_like WHERE curatorIdx = ${curatorIdx} AND sentenceIdx = ${sentenceIdx}`;
                const sentenceLikedResult = await pool.queryParam(query);
                if(sentenceLikedResult.length == 0){
                    element.alreadyLiked = false;
                }
                else{
                    element.alreadyLiked = true;
                }

            }));

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

    themeIsBookmark: async(token, themeIdx) => {
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
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

    themeDeleteBookmark: async(token, themeIdx) =>{
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
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

    themeAddBookmark: async(token, themeIdx) =>{
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
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