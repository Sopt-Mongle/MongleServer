const pool = require('../modules/pool');
const jwt = require('../modules/jwt');
const ThemeData = require('../modules/data/themeData');
const SentenceData = require('../modules/data/sentenceData');

const detail = {
    getSentence : async(curatorIdx, sentenceIdx) =>{
        const query = `SELECT * FROM sentence WHERE sentenceIdx = ?`;
        try{
            const value = [sentenceIdx];
            const firstResult = await pool.queryParam_Parse(query, value);
            let result;
            result = firstResult.map(SentenceData);

            //문장 writer 정보
            if(result.length == 0){
                return -1;
            }
            const writerIdx = firstResult[0].writerIdx;
            const writerQuery = `SELECT name, img FROM curator WHERE curatorIdx = ?`;
            const writerValue = [writerIdx]; 
            const writerResult = await pool.queryParam_Parse(writerQuery, writerValue);
            result[0].writer = writerResult[0].name;
            result[0].writerImg = writerResult[0].img;

            //문장 북마크 여부
            const sentenceIdx2 = firstResult[0].sentenceIdx;
            const sentenceBookmarkedQuery = `SELECT * FROM curator_sentence WHERE curatorIdx = ? AND sentenceIdx = ?`;
            const sentenceBookmarkedValues = [curatorIdx, sentenceIdx2];
            const sentenceBookmarkedResult = await pool.queryParam_Parse(sentenceBookmarkedQuery, sentenceBookmarkedValues);
            if(sentenceBookmarkedResult.length == 0){
                result[0].alreadyBookmarked = false;
            }
            else{
                result[0].alreadyBookmarked = true;
            }

            //문장 좋아요 여부
            const sentenceLikedQuery = `SELECT * FROM curator_sentence_like WHERE curatorIdx = ? AND sentenceIdx = ?`;
            const sentenceLikedValues = [curatorIdx, sentenceIdx];
            const sentenceLikedResult = await pool.queryParam_Parse(sentenceLikedQuery, sentenceLikedValues);
            if(sentenceLikedResult.length == 0){
                result[0].alreadyLiked = false;
            }
            else{
                result[0].alreadyLiked = true;
            }

            //테마 정보
            const themeInfoQuery = `SELECT * FROM theme_sentence WHERE sentenceIdx = ?`;
            const themeInfoValue = [sentenceIdx];
            const themeInfoResult = await pool.queryParam_Parse(themeInfoQuery, themeInfoValue);
            const themeIdx = themeInfoResult[0].themeIdx;
            result[0].themeIdx = themeIdx;
            const themeNameQuery = `SELECT theme FROM theme WHERE themeIdx = ?`;
            const themeNameValue = [themeIdx];
            const themeNameResult = await pool.queryParam_Parse(themeNameQuery, themeNameValue);
            result[0].theme = themeNameResult[0].theme;
            
            return result;
        }catch(err){
            console.log('getSentence err: ' + err);
        }throw err;
    },

    isLike: async(curatorIdx, sentenceIdx) => {
        const query = `SELECT COUNT(*) as cnt FROM curator_sentence_like WHERE curatorIdx = ? and sentenceIdx = ?`;
        try{
            const values = [curatorIdx, sentenceIdx];
            const result = await pool.queryParam_Parse(query, values);
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
        const deleteQuery = `DELETE FROM curator_sentence_like WHERE curatorIdx=? and sentenceIdx=?`;
        const updateQuery = `UPDATE sentence SET likes = likes-1 WHERE sentenceIdx=?`;
        const selectQuery = `SELECT likes FROM sentence WHERE sentenceIdx=?`;
        try{
            const deleteValues = [curatorIdx, sentenceIdx];
            await pool.queryParam_Parse(deleteQuery, deleteValues);
            const updateValue = [sentenceIdx];
            await pool.queryParam_Parse(updateQuery, updateValue);
            const selectValue = [sentenceIdx];
            const selectResult = await pool.queryParam_Parse(selectQuery, selectValue);
            return selectResult;
        }catch(err){
            console.log('deleteLike err: ' + err);
        }throw err;
    },

    addLike: async(curatorIdx, sentenceIdx) =>{
        const fields = `curatorIdx, sentenceIdx`;
        const question = `?,?`;
        const values = [curatorIdx, sentenceIdx];
        
        const insertQuery = `INSERT INTO curator_sentence_like(${fields}) VALUES(${question})`;
        const updateQuery = `UPDATE sentence SET likes = likes+1 WHERE sentenceIdx=?`;
        const selectQuery = `SELECT likes FROM sentence WHERE sentenceIdx=?`;
        try{
            await pool.queryParamArr(insertQuery, values);
            const updateValue = [sentenceIdx];
            await pool.queryParam_Parse(updateQuery, updateValue);
            const selectValue = [sentenceIdx];
            const selectResult = await pool.queryParam_Parse(selectQuery, selectValue);
            return selectResult;
        }catch(err){
            console.log('addLike err: ' + err);
        }throw err;
    },

    isBookmark: async(curatorIdx, sentenceIdx) => {
        const query = `SELECT COUNT(*) as cnt FROM curator_sentence WHERE curatorIdx = ? and sentenceIdx = ?`;
        try{
            const values = [curatorIdx, sentenceIdx];
            const result = await pool.queryParam_Parse(query, values);
            if(result[0].cnt === 0){
                return true;
            }
            else if(result[0].cnt === 1){
                const checkQuery = `SELECT COUNT(*) as cnt2 FROM curator_sentence JOIN sentence ON curator_sentence.sentenceIdx = sentence.sentenceIdx WHERE curator_sentence.curatorIdx = sentence.writerIdx AND curator_sentence.curatorIdx = ?`;
                const checkValue = [curatorIdx];
                const checkResult = await pool.queryParam_Parse(checkQuery, checkValue);
                if(checkResult[0].cnt2 === 0){ //다른 사람 문장 북마크가 된 상태
                    return false;
                }
                else{//내가 쓴 문장이라서 저장된 경우
                    return true;
                }
            }
            else{//내가 쓴 문장이라서 저장 + 북마크까지 한 경우
                return false;
            }
        }catch(err){
            console.log('isBookmark err: ' + err);
        }throw err;
    },

    deleteBookmark: async(curatorIdx, sentenceIdx) =>{
        const query = `SELECT MAX(timestamp) timestamp FROM curator_sentence WHERE curatorIdx = ? AND sentenceIdx = ?`;
                
        try{
            const values = [curatorIdx, sentenceIdx];
            const result = await pool.queryParam_Parse(query, values);
            const timestamp = result[0].timestamp;
            const deleteQuery = `DELETE FROM curator_sentence WHERE timestamp = ?`;
            const deleteValue = [timestamp];
            await pool.queryParam_Parse(deleteQuery, deleteValue);

            const updateQuery = `UPDATE sentence SET saves = saves-1 WHERE sentenceIdx=?`;
            const updateValue = [sentenceIdx];
            await pool.queryParam_Parse(updateQuery, updateValue);

            const selectQuery = `SELECT saves FROM sentence WHERE sentenceIdx=?`;
            const selectValue = [sentenceIdx];
            const selectResult = await pool.queryParam_Parse(selectQuery, selectValue);
            return selectResult;
        }catch(err){
            console.log('DeleteBookmark err: ' + err);
        }throw err;
    },

    addBookmark: async(curatorIdx, sentenceIdx) =>{
        const fields = `curatorIdx, sentenceIdx`;
        const question = `?,?`;
        const values = [curatorIdx, sentenceIdx];
        
        const insertQuery = `INSERT INTO curator_sentence(${fields}) VALUES(${question})`;
        const updateQuery = `UPDATE sentence SET saves = saves+1 WHERE sentenceIdx=?`;
        const selectQuery = `SELECT saves FROM sentence WHERE sentenceIdx=?`;
        try{
            await pool.queryParamArr(insertQuery, values);
            const updateValue = [sentenceIdx];
            await pool.queryParam_Parse(updateQuery, updateValue);
            const selectValue = [sentenceIdx];
            const selectResult = await pool.queryParam_Parse(selectQuery, selectValue);
            return selectResult;
        }catch(err){
            console.log('addBookmark err: ' + err);
        }throw err;
    },

    otherSentence: async(curatorIdx, sentenceIdx)=>{
        const query = `SELECT * FROM sentence WHERE sentence.sentenceIdx IN (SELECT sentenceIdx FROM theme_sentence WHERE theme_sentence.themeIdx IN (SELECT themeIdx FROM theme_sentence WHERE sentenceIdx = ?) AND sentenceIdx != ?) ORDER BY timestamp DESC LIMIT 2`;
        try{
            const values = [sentenceIdx, sentenceIdx];
            let firstResult = await pool.queryParam_Parse(query, values);

            await Promise.all(firstResult.map(async(element) => {
                //writer 정보
                let writerIdx = element.writerIdx;
                let writerQuery = `SELECT name, img FROM curator WHERE curatorIdx = ?`;
                let writerValue = [writerIdx];
                let writerResult = await pool.queryParam_Parse(writerQuery, writerValue);
                element.writer = writerResult[0].name;
                element.writerImg = writerResult[0].img;

            }));

            return firstResult.map(SentenceData);
        }
        catch(err){
            console.log('otherSentence err: ' + err);
        }throw err;
    },

    getTheme : async(curatorIdx, themeIdx) =>{
        const themeQuery = `SELECT * FROM theme WHERE themeIdx = ?`;
        try{
            //--- theme ---
            const themeValue = [themeIdx];
            const themeResult = await pool.queryParam_Parse(themeQuery, themeValue);
            let result = {};
            result.theme = themeResult.map(ThemeData);

            if(themeResult.length == 0){
                return -1;
            }

            //테마 배경 이미지
            const themeImgIdx = themeResult[0].themeImgIdx;
            const themeImgQuery = `SELECT img FROM themeImg WHERE themeImgIdx = ?`;
            const themeImgValue = [themeImgIdx];
            const themeImgResult = await pool.queryParam_Parse(themeImgQuery, themeImgValue);
            result.theme[0].themeImg = themeImgResult[0].img;

            //테마 writer 정보
            const writerIdx = themeResult[0].writerIdx;
            const writerQuery = `SELECT name, img FROM curator WHERE curatorIdx = ?`;
            const writerValue = [writerIdx];
            const writerResult = await pool.queryParam_Parse(writerQuery, writerValue);
            result.theme[0].writer = writerResult[0].name;
            result.theme[0].writerImg = writerResult[0].img;

            //테마 조회수
            const updateQuery = `UPDATE theme SET count = count+1 WHERE themeIdx = ?`;
            const updateValue = [themeIdx];
            await pool.queryParam_Parse(updateQuery, updateValue);

            //북마크 여부
            const alreadyQuery = `SELECT * FROM curator_theme WHERE curatorIdx = ? AND themeIdx = ?`;
            const alreadyValues = [curatorIdx, themeIdx];
            const alreadyResult = await pool.queryParam_Parse(alreadyQuery, alreadyValues);
            if(alreadyResult.length == 0){
                result.theme[0].alreadyBookmarked = false;
            }
            else{
                result.theme[0].alreadyBookmarked = true;
            }

            //안에 문장 수
            const selectQuery = `SELECT COUNT(*) as num FROM theme_sentence WHERE themeIdx = ?`;
            const selectValue = [themeIdx];
            const sentenceNum = await pool.queryParam_Parse(selectQuery, selectValue);
            result.theme[0].sentenceNum = sentenceNum[0].num;
            
            //--- sentences ---
            const sentenceQuery = `SELECT * FROM sentence WHERE sentence.sentenceIdx IN (SELECT sentenceIdx FROM theme_sentence JOIN theme WHERE theme_sentence.themeIdx = theme.themeIdx AND theme.themeIdx = ?)`;
            const sentenceValue = [themeIdx];
            let sentenceResult = await pool.queryParam_Parse(sentenceQuery, sentenceValue);

            await Promise.all(sentenceResult.map(async(element) =>{
                //문장 writer 정보
                let writerIdx = element.writerIdx;
                let writerQuery = `SELECT name, img FROM curator WHERE curatorIdx = ?`;
                let writerValue = [writerIdx];
                let writerResult = await pool.queryParam_Parse(writerQuery, writerValue);
                element.writer = writerResult[0].name;
                element.writerImg = writerResult[0].img;

                //문장 북마크 여부
                let sentenceIdx = element.sentenceIdx;
                let sentenceBookmarkedQuery = `SELECT * FROM curator_sentence WHERE curatorIdx = ? AND sentenceIdx = ?`;
                let sentenceBookmarkedValues = [curatorIdx, sentenceIdx];
                let sentenceBookmarkedResult = await pool.queryParam_Parse(sentenceBookmarkedQuery, sentenceBookmarkedValues);
                if(sentenceBookmarkedResult.length == 0){
                    element.alreadyBookmarked = false;
                }
                else{
                    element.alreadyBookmarked = true;
                }

                //문장 좋아요 여부
                let sentenceLikedQuery = `SELECT * FROM curator_sentence_like WHERE curatorIdx = ? AND sentenceIdx = ?`;
                let sentenceLikedValues = [curatorIdx, sentenceIdx];
                let sentenceLikedResult = await pool.queryParam_Parse(sentenceLikedQuery, sentenceLikedValues);
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

    themeIsBookmark: async(curatorIdx, themeIdx) => {
        const query = `SELECT COUNT(*) as cnt FROM curator_theme WHERE curatorIdx = ? and themeIdx = ?`;
        try{
            const values = [curatorIdx, themeIdx];
            const result = await pool.queryParam_Parse(query, values);
            if(result[0].cnt === 0){
                return true;
            }
            else if(result[0].cnt === 1){
                const checkQuery = `SELECT COUNT(*) as cnt2 FROM curator_theme JOIN theme ON curator_theme.themeIdx = theme.themeIdx WHERE curator_theme.curatorIdx = theme.writerIdx AND curator_theme.curatorIdx = ?`;
                const checkValue = [curatorIdx];
                const checkResult = await pool.queryParam_Parse(checkQuery, checkValue);
                if(checkResult[0].cnt2 === 0){ //다른 사람 테마 북마크가 된 상태
                    return false;
                }
                else{//내가 쓴 테마라서 저장된 경우
                    return true;
                }
            }
            else{//내가 쓴 테마라서 저장 + 내가 북마크까지 한 경우
                return false;
            }
        }catch(err){
            console.log('themeIsBookmark err: ' + err);
        }throw err;
    },

    themeDeleteBookmark: async(curatorIdx, themeIdx) =>{
        const query = `SELECT MAX(timestamp) timestamp FROM curator_theme WHERE curatorIdx = ? AND themeIdx = ?`;
                
        try{
            const values = [curatorIdx, themeIdx];
            const result = await pool.queryParam_Parse(query, values);
            const timestamp = result[0].timestamp;
            const deleteQuery = `DELETE FROM curator_theme WHERE timestamp = ?`;
            const deleteValue = [timestamp];
            await pool.queryParam_Parse(deleteQuery, deleteValue);

            const updateQuery = `UPDATE theme SET saves = saves-1 WHERE themeIdx=?`;
            const updateValue = [themeIdx];
            await pool.queryParam_Parse(updateQuery, updateValue);

            const selectQuery = `SELECT saves FROM theme WHERE themeIdx=?`;
            const selectValue = [themeIdx];
            const selectResult = await pool.queryParam_Parse(selectQuery, selectValue);
            return selectResult;
        }catch(err){
            console.log('themeDeleteBookmark err: ' + err);
        }throw err;
    },

    themeAddBookmark: async(curatorIdx, themeIdx) =>{
        const fields = `curatorIdx, themeIdx`;
        const question = `?,?`;
        const values = [curatorIdx, themeIdx];
        
        const insertQuery = `INSERT INTO curator_theme(${fields}) VALUES(${question})`;
        const updateQuery = `UPDATE theme SET saves = saves+1 WHERE themeIdx=?`;
        const selectQuery = `SELECT saves FROM theme WHERE themeIdx=?`;
        try{
            await pool.queryParamArr(insertQuery, values);
            const updateValue = [themeIdx];
            await pool.queryParam_Parse(updateQuery, updateValue);
            const selectValue = [themeIdx];
            const selectResult = await pool.queryParam_Parse(selectQuery, selectValue);
            return selectResult;
        }catch(err){
            console.log('themeAddBookmark err: ' + err);
        }throw err;
    },
}

module.exports = detail;