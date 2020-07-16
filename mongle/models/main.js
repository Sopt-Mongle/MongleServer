const pool = require('../modules/pool');

const SentenceData = require('../modules/data/sentenceData');
const curatorData = require('../modules/data/curatorData');
const ThemeData = require('../modules/data/themeData');
const jwt = require('../modules/jwt');

const main = {
    editorsPick: async()=>{
        let query = `SELECT * FROM editorpick`;
        try{
            let result = await pool.queryParam(query);
            await Promise.all(result.map(async(element) =>{
                let themeIdx = element.themeIdx;
                //안에 문장 수
                query = `SELECT COUNT(*) as num FROM theme_sentence WHERE themeIdx = ${themeIdx}`;
                const sentenceNum = await pool.queryParam(query);
                element.sentenceNum = sentenceNum[0].num;
            }));
            return result;
        }
        catch(err){
            console.log('getIllust ERROR : ', err);
            throw err;
        }
    },
    getTodaySentence: async(token)=>{
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
        //now에서 24시간전~지금까지 좋아요가 가장 많이 찍힌 순으로 정렬해서 ~
        let query = `SELECT sentence.sentenceIdx, sentence.sentence, sentence.title FROM sentence JOIN curator_sentence_like ON sentence.sentenceIdx = curator_sentence_like.sentenceIdx
        WHERE (curator_sentence_like.timestamp) >= DATE_SUB(NOW(), INTERVAL 24 HOUR) GROUP BY curator_sentence_like.sentenceIdx ORDER BY count(curator_sentence_like.sentenceIdx) DESC LIMIT 10`;
        try{
            let result = await pool.queryParam(query);

            await Promise.all(result.map(async(element) =>{
                //writer 정보
                // const writerIdx = element.writerIdx;
                // query = `SELECT name, img FROM curator WHERE curatorIdx = ${writerIdx}`;
                // const writerResult = await pool.queryParam(query);
                // element.writer = writerResult[0].name;
                // element.writerImg = writerResult[0].img;

                //북마크 여부
                const sentenceIdx = element.sentenceIdx;
                query = `SELECT * FROM curator_sentence WHERE curatorIdx = ${curatorIdx} AND sentenceIdx = ${sentenceIdx}`;
                const sentenceBookmarkedResult = await pool.queryParam(query);
                if(sentenceBookmarkedResult.length == 0){
                    element.alreadyBookmarked = false;
                }
                else{
                    element.alreadyBookmarked = true;
                }

                //좋아요 여부
                // query = `SELECT * FROM curator_sentence_like WHERE curatorIdx = ${curatorIdx} AND sentenceIdx = ${sentenceIdx}`;
                // const sentenceLikedResult = await pool.queryParam(query);
                // if(sentenceLikedResult.length == 0){
                //     element.alreadyLiked = false;
                // }
                // else{
                //     element.alreadyLiked = true;
                // }
            }));

            return result.map(SentenceData);
        }
        catch(err){
            console.log('getTodaySentence err' + err);
        }throw err;
    },

    getTodayCurator: async()=>{
        //24시간전~지금까지 구독수가 가장 많이 찍힌 큐레이터 순으로~
        let query = `SELECT * FROM curator JOIN follow ON curator.curatorIdx = follow.followedIdx
        WHERE (follow.timestamp) >= DATE_SUB(NOW(), INTERVAL 24 HOUR) GROUP BY follow.followedIdx ORDER BY count(follow.followedIdx) DESC LIMIT 10`;
        try{
            let result = await pool.queryParam(query);
            let keyword;
            await Promise.all(result.map(async(element) =>{
                let curatorIdx = element.curatorIdx;
                query = `SELECT keyword FROM keyword JOIN curator ON keyword.keywordIdx = curator.keywordIdx WHERE curatorIdx = ${curatorIdx}`;
                keyword = await pool.queryParam(query);
                // console.log(keyword[0].keyword);
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

    getTodayTheme: async(token)=>{
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
        //now에서 24시간전~지금까지 테마의 북마크가 가장 많이 된 순으로 정렬해서 ~
        let query = `SELECT * FROM theme JOIN curator_theme ON theme.themeIdx = curator_theme.themeIdx
        WHERE curator_theme.timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR) GROUP BY curator_theme.themeIdx ORDER BY count(curator_theme.themeIdx) DESC LIMIT 10`;
        try{
            let result = await pool.queryParam(query);

            await Promise.all(result.map(async(element) =>{
                //테마 배경 이미지
                let themeImgIdx = element.themeImgIdx;
                query = `SELECT img FROM themeImg WHERE themeImgIdx = ${themeImgIdx}`;
                let themeImgResult = await pool.queryParam(query);
                element.themeImg = themeImgResult[0].img;

                //테마 writer 정보
                // let writerIdx = element.writerIdx;
                // query = `SELECT name, img FROM curator WHERE curatorIdx = ${writerIdx}`;
                // let writerResult = await pool.queryParam(query);
                // element.writer = writerResult[0].name;
                // element.writerImg = writerResult[0].img;

                //테마 북마크 여부
                let themeIdx = element.themeIdx;
                query = `SELECT * FROM curator_theme WHERE curatorIdx = ${curatorIdx} AND themeIdx = ${themeIdx}`;
                let alreadyResult = await pool.queryParam(query);
                if(alreadyResult.length == 0){
                    element.alreadyBookmarked = false;
                }
                else{
                    element.alreadyBookmarked = true;
                }

                //안에 문장 수
                query = `SELECT COUNT(*) as num FROM theme_sentence WHERE themeIdx = ${themeIdx}`;
                const sentenceNum = await pool.queryParam(query);
                element.sentenceNum = sentenceNum[0].num;

            }));

            return result.map(ThemeData);
        }
        catch(err){
            console.log('getTodayTheme err' + err);
        }throw err;
    },

    getWaitTheme: async(token)=>{
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
        //저장된 문장이 2개 미만인 테마들
        let query = `SELECT * FROM theme LEFT JOIN theme_sentence ON theme.themeIdx = theme_sentence.themeIdx
        group by theme.themeIdx having count(theme_sentence.sentenceIdx) < 2`;
        try{
            let result = await pool.queryParam(query);

            await Promise.all(result.map(async(element) =>{
                //테마 배경 이미지
                let themeImgIdx = element.themeImgIdx;
                query = `SELECT img FROM themeImg WHERE themeImgIdx = ${themeImgIdx}`;
                let themeImgResult = await pool.queryParam(query);
                element.themeImg = themeImgResult[0].img;

                //테마 북마크 여부
                let themeIdx = element.themeIdx;
                query = `SELECT * FROM curator_theme WHERE curatorIdx = ${curatorIdx} AND themeIdx = ${themeIdx}`;
                let alreadyResult = await pool.queryParam(query);
                if(alreadyResult.length == 0){
                    element.alreadyBookmarked = false;
                }
                else{
                    element.alreadyBookmarked = true;
                }

                //안에 문장 수
                query = `SELECT COUNT(*) as num FROM theme_sentence WHERE themeIdx = ${themeIdx}`;
                const sentenceNum = await pool.queryParam(query);
                element.sentenceNum = sentenceNum[0].num;

            }));

            return result.map(ThemeData);
        }
        catch(err){
            console.log('getWaitTheme err' + err);
        }throw err;
    },

    getNowTheme: async(token)=>{
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
        //최근 3일동안 생성된 테마들을 조회수 순으로 정렬~
        let query = `SELECT * FROM theme WHERE (createdAt) >= DATE_SUB(NOW(), INTERVAL 63 HOUR) ORDER BY count DESC LIMIT 10`;
        try{
            let result = await pool.queryParam(query);
            await Promise.all(result.map(async(element) =>{
                //테마 배경 이미지
                let themeImgIdx = element.themeImgIdx;
                query = `SELECT img FROM themeImg WHERE themeImgIdx = ${themeImgIdx}`;
                let themeImgResult = await pool.queryParam(query);
                element.themeImg = themeImgResult[0].img;

                //테마 북마크 여부
                let themeIdx = element.themeIdx;
                query = `SELECT * FROM curator_theme WHERE curatorIdx = ${curatorIdx} AND themeIdx = ${themeIdx}`;
                let alreadyResult = await pool.queryParam(query);
                if(alreadyResult.length == 0){
                    element.alreadyBookmarked = false;
                }
                else{
                    element.alreadyBookmarked = true;
                }

                //안에 문장 수
                query = `SELECT COUNT(*) as num FROM theme_sentence WHERE themeIdx = ${themeIdx}`;
                const sentenceNum = await pool.queryParam(query);
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