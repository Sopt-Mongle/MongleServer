const pool = require('../modules/pool');
const CuratorData = require('../modules/data/curatorData');
const ThemeData = require('../modules/data/themeData');
const SentenceData = require('../modules/data/sentenceData');
const curatorData = require('../modules/data/curatorData');

const curator = {
    getAllCurators: async(curatorIdx) =>{
        let query = `SELECT * FROM follow JOIN curator ON follow.followedIdx = curatorIdx WHERE followerIdx = ${curatorIdx}`;
        
        try{
            let tempResult = await pool.queryParam(query);

            //구독 중인 큐레이터
            await Promise.all(tempResult.map(async(element) => {
                let keywordIdx = element.keywordIdx;
                //키워드
                query = `SELECT keyword FROM keyword WHERE keywordIdx = ${keywordIdx}`;
                const keywordResult = await pool.queryParam(query);
                element.keyword = keywordResult[0].keyword;
                
                //북마크 여부
                element.alreadySubscribed = true;
                
            }));

            return tempResult.map(CuratorData);
        }
        catch(err){
            console.log('getAllCurators ERROR : ', err);
            throw err;
        }
    },

    subscribe: async(followerIdx, followedIdx) =>{
        let query = `SELECT * FROM follow WHERE followerIdx = ${followerIdx} AND followedIdx = ${followedIdx}`;
        try{
            let result = "";
            const selectResult = await pool.queryParam(query);
            
            if(selectResult.length == 0){ //구독 안했던 큐레이터 -> 구독하기!!
                query = `INSERT INTO follow(followerIdx, followedIdx) VALUE(${followerIdx}, ${followedIdx})`;
                await pool.queryParam(query);
            
                query = `UPDATE ${table} SET subscribe = subscribe+1 WHERE curatorIdx = ${followedIdx}`;
                await pool.queryParam(query);

                result = true;

            }
            else{ //구독 했던 큐레이터 -> 구독취소!!
                query = `DELETE FROM follow WHERE followerIdx = ${followerIdx} AND followedIdx = ${followedIdx}`;
                await pool.queryParam(query);

                query = `UPDATE ${table} SET subscribe = subscribe-1 WHERE curatorIdx = ${followedIdx}`;
                await pool.queryParam(query);

                result = false;
            }
            console.log(result);
            return result;
        }
        catch(err){
            console.log('subscribe ERROR : ', err);
            throw err;
        }
    },

    getCuratorInfo: async(curatorIdx, curatorIdx2) =>{
        let profilequery = `SELECT * FROM curator WHERE curatorIdx = ${curatorIdx2}`;
        let themequery = `SELECT * FROM theme WHERE writerIdx = ${curatorIdx2}`;
        let sentencequery = `SELECT * FROM sentence WHERE writerIdx = ${curatorIdx2}`;

        try{
            //--- 프로필 ---
            let profileResult = await pool.queryParam(profilequery);

            //프로필 - 키워드
            let keywordIdx = profileResult[0].keywordIdx;
            query = `SELECT keyword FROM keyword WHERE keywordIdx = ${keywordIdx}`;
            const keywordResult = await pool.queryParam(query);            
            profileResult[0].keyword = keywordResult[0].keyword;

            //프로필 - 구독 여부
            query = `SELECT * FROM follow WHERE followerIdx = ${curatorIdx} AND followedIdx = ${curatorIdx2}`;
            const followResult = await pool.queryParam(query);
            if(followResult.length == 0){
                profileResult[0].alreadySubscribed = false;
            }
            else{
                profileResult[0].alreadySubscribed = true;
            }

            //--- 테마 ---
            let themeResult = await pool.queryParam(themequery);

            await Promise.all(themeResult.map(async(element) =>{
                let writerIdx = element.writerIdx;
                let themeImgIdx = element.themeImgIdx;
                let themeIdx = element.themeIdx;

                //테마 - 테마 배경 이미지                
                query = `SELECT img FROM themeImg WHERE themeImgIdx = ${themeImgIdx}`;
                const themeImgResult = await pool.queryParam(query);
                element.themeImg = themeImgResult[0].img;

                //테마 - writer 정보
                query = `SELECT name, img FROM curator WHERE curatorIdx = ${writerIdx}`;
                let writerResult = await pool.queryParam(query);
                element.writer = writerResult[0].name;
                element.writerImg = writerResult[0].img;

                //테마 - 북마크 여부
                query = `SELECT * FROM curator_theme WHERE curatorIdx = ${curatorIdx} AND themeIdx = ${themeIdx}`;
                const alreadyResult = await pool.queryParam(query);
                if(alreadyResult.length == 0){
                    element.alreadyBookmarked = false;
                }
                else{
                    element.alreadyBookmarked = true;
                }

                //테마 - 안에 문장 수
                query = `SELECT COUNT(*) as num FROM theme_sentence WHERE themeIdx = ${themeIdx}`;
                const sentenceNum = await pool.queryParam(query);
                element.sentenceNum = sentenceNum[0].num;

            }));

            //--- 문장 ---
            let sentenceResult = await pool.queryParam(sentencequery);

            await Promise.all(sentenceResult.map(async(element) =>{
                let writerIdx = element.writerIdx;
                let sentenceIdx = element.sentenceIdx;

                //문장 - writer 정보
                query = `SELECT name, img FROM curator WHERE curatorIdx = ${writerIdx}`;
                let writerResult = await pool.queryParam(query);
                element.writer = writerResult[0].name;
                element.writerImg = writerResult[0].img;

                //문장 - 북마크 여부
                query = `SELECT * FROM curator_sentence WHERE curatorIdx = ${curatorIdx} AND sentenceIdx = ${sentenceIdx}`;
                const alreadyBookmarkedResult = await pool.queryParam(query);
                if(alreadyBookmarkedResult.length == 0){
                    element.alreadyBookmarked = false;
                }
                else{
                    element.alreadyBookmarked = true;
                }

                //문장 - 좋아요 여부
                query = `SELECT * FROM curator_sentence_like WHERE curatorIdx = ${curatorIdx} AND sentenceIdx = ${sentenceIdx}`;
                const sentenceLikedResult = await pool.queryParam(query);
                if(sentenceLikedResult.length == 0){
                    element.alreadyLiked = false;
                }
                else{
                    element.alreadyLiked = true;
                }

            }));

            let result = {};
            result.profile = profileResult.map(CuratorData);
            result.theme = themeResult.map(ThemeData);
            result.sentence = sentenceResult.map(SentenceData);
            
            return result;
        }
        catch(err){
            console.log('getCuratorInfo err : ', err);
            throw err;
        }
    },

    getRecommendCurator: async() =>{
        let query = `SELECT curatorIdx, name, img, subscribe FROM curator JOIN sentence ON curator.curatorIdx = sentence.writerIdx 
        GROUP BY sentence.writerIdx HAVING count(sentence.writerIdx) >= 5 ORDER BY rand() LIMIT 10`;
        try{
            let result = await pool.queryParam(query);
            let keyword;
            await Promise.all(result.map(async(element) =>{
                let curatorIdx = element.curatorIdx;
                console.log(curatorIdx);
                query = `SELECT keyword FROM keyword JOIN curator ON keyword.keywordIdx = curator.keywordIdx WHERE curatorIdx = ${curatorIdx}`;
                keyword = await pool.queryParam(query);
                element.keyword = keyword[0].keyword;
            }));
            return result.map(curatorData);

        }catch(err){
            console.log('getRecommendCurator err: ' + err);
        }throw err;
    },

    getThemeInCurator: async(curatorIdx) =>{
        let query = `SELECT t.* FROM theme t INNER JOIN theme_sentence ts ON t.themeIdx = ts.themeIdx INNER JOIN sentence s ON ts.sentenceIdx = s.sentenceIdx
                    GROUP BY t.themeIdx HAVING COUNT(s.writerIdx) >= 3 ORDER BY createdAt DESC limit 2`;
        try{
            //테마
            let result = {};
            let themeResult = await pool.queryParam(query);
            result.theme = themeResult.map(ThemeData);
            
            // const themeIdx = result.theme[0].themeIdx;

            await Promise.all(themeResult.map(async(element) => {
                let themeIdx = element.themeIdx;
                //테마 배경 이미지
                let themeImgIdx = themeResult[0].themeImgIdx;
                query = `SELECT img FROM themeImg WHERE themeImgIdx = ${themeImgIdx}`;
                let themeImgResult = await pool.queryParam(query);
                element.themeImg = themeImgResult[0].img;

                //테마 writer 정보
                let writerIdx = themeResult[0].writerIdx;
                query = `SELECT name, img FROM curator WHERE curatorIdx = ${writerIdx}`;
                let writerResult = await pool.queryParam(query);
                element.writer = writerResult[0].name;
                element.writerImg = writerResult[0].img;

                //테마 조회수
                query = `UPDATE theme SET count = count+1 WHERE themeIdx = ${themeIdx}`;
                await pool.queryParam(query);

                //북마크 여부
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
                let sentenceNum = await pool.queryParam(query);
                element.sentenceNum = sentenceNum[0].num;


                //----큐레이터----
                console.log(themeIdx);
                query = `SELECT writerIdx FROM sentence s JOIN theme_sentence ts ON s.sentenceIdx = ts.sentenceIdx WHERE ts.themeIdx = ${themeIdx} ORDER BY likes DESC limit 3`;
                let curatorResult = await pool.queryParam(query);
                console.log(curatorResult);
                let curatorResult2;

                await Promise.all(curatorResult.map(async(element) => {
                    let curatorIdx = element.writerIdx;
                    query = `SELECT * FROM curator WHERE curatorIdx = ${curatorIdx}`;
                    curatorResult2 = await pool.queryParam(query);

                    element.curatorIdx = curatorResult2[0].curatorIdx;
                    element.name = curatorResult2[0].name;
                    element.img = curatorResult2[0].img;
                    element.subscribe = curatorResult2[0].subscribe;

                    //프로필 - 키워드
                    let keywordIdx = curatorResult2[0].keywordIdx;
                    query = `SELECT keyword FROM keyword WHERE keywordIdx = ${keywordIdx}`;
                    const keywordResult = await pool.queryParam(query);            
                    element.keyword = keywordResult[0].keyword;

                    //프로필 - 구독 여부
                    let curatorIdx2 = curatorResult2[0].curatorIdx;
                    query = `SELECT * FROM follow WHERE followerIdx = ${curatorIdx} AND followedIdx = ${curatorIdx2}`;
                    const followResult = await pool.queryParam(query);
                    if(followResult.length == 0){
                        element.alreadySubscribed = false;
                    }
                    else{
                        element.alreadySubscribed = true;
                    }
                }));
                result.curator[0] = curatorResult.map(CuratorData);
            }));



            result.theme = themeResult.map(ThemeData);
            
            // const themeIdx = themeResult[0].themeIdx;
            // result.curator = curatorResult.map(CuratorData);
            
            return result;
        }catch(err){
            console.log('getThemeInCurator err: ' + err);
        }throw err;
    },

    getCuratorByKeyword: async(keywordIdx, followerIdx) =>{
        let query = `SELECT * FROM curator WHERE keywordIdx = ${keywordIdx}`;
        try{
            let result = await pool.queryParam(query);
            let keyword;
            let alreadySave;
            await Promise.all(result.map(async(element) =>{
                let curatorIdx = element.curatorIdx;
                query = `SELECT keyword FROM keyword JOIN curator ON keyword.keywordIdx = curator.keywordIdx WHERE curatorIdx = ${curatorIdx}`;
                keyword = await pool.queryParam(query);
                element.keyword = keyword[0].keyword;

                let savequery = `SELECT * FROM follow WHERE followerIdx = ${followerIdx} AND followedIdx = ${curatorIdx}`;
                alreadySave = await pool.queryParam(savequery);
                if(alreadySave.length === 0){
                    element.alreadySubscribed = false;
                }
                else{
                    element.alreadySubscribed = true;
                }
                
            }));
            return result.map(curatorData);

        }catch(err){
            console.log('getCuratorByKeyword err: ' + err);
        }throw err;
    },
};

module.exports = curator;