const pool = require('../modules/pool');

const SentenceData = require('../modules/data/sentenceData');
const curatorData = require('../modules/data/curatorData');
const ThemeData = require('../modules/data/themeData');
const jwt = require('../modules/jwt');

const main = {
    editorsPick: async()=>{
        const query = `SELECT * FROM editorpick`;
        try{
            let result = await pool.queryParam(query);
            await Promise.all(result.map(async(element) =>{
                let themeIdx = element.themeIdx;
                let countQuery = `SELECT COUNT(*) as num FROM theme_sentence WHERE themeIdx = ?`;
                let countValue = [themeIdx];
                let sentenceNum = await pool.queryParam_Parse(countQuery, countValue);
                element.sentenceNum = sentenceNum[0].num;
            }));
            return result;
        }
        catch(err){
            console.log('getIllust ERROR : ', err);
            
        }throw err;
    },
    getTodaySentence: async(curatorIdx)=>{
        //now에서 24시간전~지금까지 좋아요가 가장 많이 찍힌 순으로 정렬해서 ~
        const query = `SELECT sentence.sentenceIdx, sentence.sentence, sentence.title FROM sentence JOIN curator_sentence_like ON sentence.sentenceIdx = curator_sentence_like.sentenceIdx
        WHERE (curator_sentence_like.timestamp) >= DATE_SUB(NOW(), INTERVAL 24 HOUR) GROUP BY curator_sentence_like.sentenceIdx ORDER BY count(curator_sentence_like.sentenceIdx) DESC LIMIT 10`;
        try{
            let result = await pool.queryParam(query);

            await Promise.all(result.map(async(element) =>{
                let sentenceIdx = element.sentenceIdx;
                if(curatorIdx === "guest"){
                    element.alreadyBookmarked = false;
                }
                else{
                    let sentenceBookmarkedQuery = `SELECT * FROM curator_sentence WHERE curatorIdx = ? AND sentenceIdx = ?`;
                    let sentenceBookmarkedValues = [curatorIdx, sentenceIdx];
                    let sentenceBookmarkedResult = await pool.queryParam_Parse(sentenceBookmarkedQuery, sentenceBookmarkedValues);
                    if(sentenceBookmarkedResult.length == 0){
                        element.alreadyBookmarked = false;
                    }
                    else{
                        element.alreadyBookmarked = true;
                    }
                }
            }));

            return result.map(SentenceData);
        }
        catch(err){
            console.log('getTodaySentence err' + err);
        }throw err;
    },

    getTodayCurator: async()=>{
        //24시간전~지금까지 구독수가 가장 많이 찍힌 큐레이터 순으로~
        const query = `SELECT * FROM curator JOIN follow ON curator.curatorIdx = follow.followedIdx
        WHERE (follow.timestamp) >= DATE_SUB(NOW(), INTERVAL 24 HOUR) GROUP BY follow.followedIdx ORDER BY count(follow.followedIdx) DESC LIMIT 10`;
        try{
            let result = await pool.queryParam(query);
            let keyword;
            await Promise.all(result.map(async(element) =>{
                let curatorIdx = element.curatorIdx;
                let keywordQuery = `SELECT keyword FROM keyword JOIN curator ON keyword.keywordIdx = curator.keywordIdx WHERE curatorIdx = ?`;
                let keywordValue = [curatorIdx];
                keyword = await pool.queryParam_Parse(keywordQuery, keywordValue);
                if(keyword.length !== 0){
                    element.keyword = keyword[0].keyword;
                }
                
            }))

            return result.map(curatorData);
        }
        catch(err){
            console.log('getTodayCurator err' + err);
        }throw err;
    },

    getTodayTheme: async(curatorIdx)=>{
        //now에서 24시간전~지금까지 테마의 북마크가 가장 많이 된 순으로 정렬해서 ~
        const query = `SELECT * FROM theme JOIN curator_theme ON theme.themeIdx = curator_theme.themeIdx
        WHERE curator_theme.timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR) GROUP BY curator_theme.themeIdx ORDER BY count(curator_theme.themeIdx) DESC LIMIT 10`;
        try{
            let result = await pool.queryParam(query);

            await Promise.all(result.map(async(element) =>{
                let themeImgIdx = element.themeImgIdx;
                let themeImgQuery = `SELECT img FROM themeImg WHERE themeImgIdx = ?`;
                let themeImgValue = [themeImgIdx];
                let themeImgResult = await pool.queryParam_Parse(themeImgQuery, themeImgValue);
                element.themeImg = themeImgResult[0].img;

                let themeIdx = element.themeIdx;
                if(curatorIdx === "guest"){
                    element.alreadyBookmarked = false;
                }
                else{
                    let alreadyQuery = `SELECT * FROM curator_theme WHERE curatorIdx = ? AND themeIdx = ?`;
                    let alreadyValues = [curatorIdx, themeIdx];
                    let alreadyResult = await pool.queryParam_Parse(alreadyQuery, alreadyValues);
                    if(alreadyResult.length == 0){
                        element.alreadyBookmarked = false;
                    }
                    else{
                        element.alreadyBookmarked = true;
                    }
                }

                let countQuery = `SELECT COUNT(*) as num FROM theme_sentence WHERE themeIdx = ?`;
                let countValue = [themeIdx];
                let sentenceNum = await pool.queryParam_Parse(countQuery, countValue);
                element.sentenceNum = sentenceNum[0].num;

            }));

            return result.map(ThemeData);
        }
        catch(err){
            console.log('getTodayTheme err' + err);
        }throw err;
    },

    getWaitTheme: async(curatorIdx)=>{
        //저장된 문장이 2개 미만인 테마들
        const query = `SELECT * FROM theme LEFT JOIN theme_sentence ON theme.themeIdx = theme_sentence.themeIdx
        group by theme.themeIdx having count(theme_sentence.sentenceIdx) < 2`;
        try{
            let result = await pool.queryParam(query);

            await Promise.all(result.map(async(element) =>{
                let themeImgIdx = element.themeImgIdx;
                let themeImgQuery = `SELECT img FROM themeImg WHERE themeImgIdx = ?`;
                let themeImgValue = [themeImgIdx];
                let themeImgResult = await pool.queryParam_Parse(themeImgQuery, themeImgValue);
                element.themeImg = themeImgResult[0].img;

                let themeIdx = element.themeIdx;
                if(curatorIdx === "guest"){
                    element.alreadyBookmarked = false;
                }
                else{
                    let alreadyQuery = `SELECT * FROM curator_theme WHERE curatorIdx = ? AND themeIdx = ?`;
                    let alreadyValues = [curatorIdx, themeIdx];
                    let alreadyResult = await pool.queryParam_Parse(alreadyQuery, alreadyValues);
                    if(alreadyResult.length == 0){
                        element.alreadyBookmarked = false;
                    }
                    else{
                        element.alreadyBookmarked = true;
                    }
                }

                let countQuery = `SELECT COUNT(*) as num FROM theme_sentence WHERE themeIdx = ?`;
                let countValue = [themeIdx];
                let sentenceNum = await pool.queryParam_Parse(countQuery, countValue);
                element.sentenceNum = sentenceNum[0].num;

            }));

            return result.map(ThemeData);
        }
        catch(err){
            console.log('getWaitTheme err' + err);
        }throw err;
    },

    getNowTheme: async(curatorIdx)=>{
        //최근 3일동안 생성된 테마들을 조회수 순으로 정렬~
        const query = `SELECT * FROM theme WHERE (createdAt) >= DATE_SUB(NOW(), INTERVAL 72 HOUR) ORDER BY count DESC LIMIT 10`;
        try{
            let result = await pool.queryParam(query);
            await Promise.all(result.map(async(element) =>{
                let themeImgIdx = element.themeImgIdx;
                let themeImgQuery = `SELECT img FROM themeImg WHERE themeImgIdx = ?`;
                let themeImgValue = [themeImgIdx];
                let themeImgResult = await pool.queryParam_Parse(themeImgQuery, themeImgValue);
                element.themeImg = themeImgResult[0].img;

                let themeIdx = element.themeIdx;
                if(curatorIdx === "guest"){
                    element.alreadyBookmarked = false;
                }
                else{
                    let alreadyQuery = `SELECT * FROM curator_theme WHERE curatorIdx = ? AND themeIdx = ?`;
                    let alreadyValues = [curatorIdx, themeIdx];
                    let alreadyResult = await pool.queryParam_Parse(alreadyQuery, alreadyValues);
                    if(alreadyResult.length == 0){
                        element.alreadyBookmarked = false;
                    }
                    else{
                        element.alreadyBookmarked = true;
                    }
                }

                let countQuery = `SELECT COUNT(*) as num FROM theme_sentence WHERE themeIdx = ?`;
                let countValue = [themeIdx];
                let sentenceNum = await pool.queryParam_Parse(countQuery, countValue);
                element.sentenceNum = sentenceNum[0].num;
            }));
            return result.map(ThemeData);
        }
        catch(err){
            console.log('getNowTheme err' + err);
        }throw err;
    }
};

module.exports = main;