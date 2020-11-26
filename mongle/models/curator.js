const pool = require('../modules/pool');
const jwt = require('../modules/jwt');

const CuratorData = require('../modules/data/curatorData');
const ThemeData = require('../modules/data/themeData');
const SentenceData = require('../modules/data/sentenceData');
const curatorData = require('../modules/data/curatorData');
const { value } = require('../config/database');

const curator = {
    getAllCurators: async(curatorIdx) =>{
        const query = `SELECT * FROM follow JOIN curator ON follow.followedIdx = curatorIdx WHERE followerIdx = ?`;
        try{
            const values = [curatorIdx];
            let tempResult = await pool.queryParam_Parse(query, values);

            //구독 중인 큐레이터
            await Promise.all(tempResult.map(async(element) => {
                let keywordIdx = element.keywordIdx;
                //키워드
                let query2 = `SELECT keyword FROM keyword WHERE keywordIdx = ?`;
                let values2 = [keywordIdx];
                let keywordResult = await pool.queryParam_Parse(query2, values2);
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
        const query = `SELECT * FROM follow WHERE followerIdx = ? AND followedIdx = ?`;
        try{
            let result = "";
            const values = [followerIdx, followedIdx];
            const selectResult = await pool.queryParam_Parse(query, values);
            
            if(selectResult.length == 0){ //구독 안했던 큐레이터 -> 구독하기!!
                const insertFollowQuery = `INSERT INTO follow(followerIdx, followedIdx) VALUE(?, ?)`;
                await pool.queryParam_Parse(insertFollowQuery, values);
            
                const updateCuratorQuery = `UPDATE curator SET subscribe = subscribe+1 WHERE curatorIdx = ?`;
                const updateCuratorValues = [followedIdx];
                await pool.queryParam_Parse(updateCuratorQuery, updateCuratorValues);

                result = true;

            }
            else{ //구독 했던 큐레이터 -> 구독취소!!
                const deleteFollowQuery = `DELETE FROM follow WHERE followerIdx = ? AND followedIdx = ?`;
                await pool.queryParam_Parse(deleteFollowQuery, values);

                const updateCuratorQuery = `UPDATE curator SET subscribe = subscribe-1 WHERE curatorIdx = ?`;
                const updateCuratorValues = [followedIdx];
                await pool.queryParam_Parse(updateCuratorQuery, updateCuratorValues);

                result = false;
            }
            return result;
        }
        catch(err){
            console.log('subscribe ERROR : ', err);
            throw err;
        }
    },

    getCuratorInfo: async(curatorIdx, curatorIdx2) =>{
        const profileQuery = `SELECT * FROM curator WHERE curatorIdx = ?`;
        const themeQuery = `SELECT * FROM theme WHERE writerIdx = ? ORDER BY createdAt DESC`;
        const sentenceQuery = `SELECT * FROM sentence WHERE writerIdx = ? ORDER BY timestamp DESC`;

        try{
            //--- 프로필 ---
            const profileValue = [curatorIdx2];
            let profileResult = await pool.queryParam_Parse(profileQuery, profileValue);

            //프로필 - 키워드
            let keywordIdx = profileResult[0].keywordIdx;
            if(keywordIdx !== null){
                const keywordQuery = `SELECT keyword FROM keyword WHERE keywordIdx = ?`;
                const keywordValue = [keywordIdx];
                const keywordResult = await pool.queryParam_Parse(keywordQuery, keywordValue);
                profileResult[0].keyword = keywordResult[0].keyword;
            }
            else{
                profileResult[0].keyword = null;
            }

            //프로필 - 구독 여부
            if(curatorIdx === "guest"){
                profileResult[0].alreadySubscribed = false;
            }
            else{
                const followQuery = `SELECT * FROM follow WHERE followerIdx = ${curatorIdx} AND followedIdx = ${curatorIdx2}`;
                const followValues = [curatorIdx, curatorIdx2];
                const followResult = await pool.queryParam_Parse(followQuery, followValues);
                if(followResult.length == 0){
                    profileResult[0].alreadySubscribed = false;
                }
                else{
                    profileResult[0].alreadySubscribed = true;
                }
            }

            //--- 테마 ---
            const themeValue = [curatorIdx2];
            let themeResult = await pool.queryParam_Parse(themeQuery, themeValue);

            await Promise.all(themeResult.map(async(element) =>{
                let writerIdx = element.writerIdx;
                let themeImgIdx = element.themeImgIdx;
                let themeIdx = element.themeIdx;

                //테마 - 테마 배경 이미지
                
                let themeImgQuery = `SELECT img FROM themeImg WHERE themeImgIdx = ?`;
                let themeImgValue = [themeImgIdx];
                let themeImgResult = await pool.queryParam_Parse(themeImgQuery, themeImgValue);
                element.themeImg = themeImgResult[0].img;

                //테마 - writer 정보
                let writerQuery = `SELECT name, img FROM curator WHERE curatorIdx = ${writerIdx}`;
                let writerValue = [writerIdx];
                let writerResult = await pool.queryParam_Parse(writerQuery, writerValue);
                element.writer = writerResult[0].name;
                element.writerImg = writerResult[0].img;

                //테마 - 북마크 여부
                if(curatorIdx === "guest"){
                    element.alreadyBookmarked = false;
                }
                else{
                    let alreadyQuery = `SELECT * FROM curator_theme WHERE curatorIdx = ${curatorIdx} AND themeIdx = ${themeIdx}`;
                    let alreadyValue = [curatorIdx, themeIdx];
                    let alreadyResult = await pool.queryParam_Parse(alreadyQuery, alreadyValue);
                    if(alreadyResult.length == 0){
                        element.alreadyBookmarked = false;
                    }
                    else{
                        element.alreadyBookmarked = true;
                    }
                }

                //테마 - 안에 문장 수
                let query = `SELECT COUNT(*) as num FROM theme_sentence WHERE themeIdx = ?`;
                let value = [themeIdx];
                let sentenceNum = await pool.queryParam_Parse(query, value);
                element.sentenceNum = sentenceNum[0].num;

            }));

            //--- 문장 ---
            const sentenceValue = [curatorIdx2];
            let sentenceResult = await pool.queryParam_Parse(sentenceQuery, sentenceValue);

            await Promise.all(sentenceResult.map(async(element) =>{
                let writerIdx = element.writerIdx;
                let sentenceIdx = element.sentenceIdx;
                
                //문장 - writer 정보
                let writerQuery = `SELECT name, img FROM curator WHERE curatorIdx = ?`;
                let writerValue = [writerIdx];
                let writerResult = await pool.queryParam_Parse(writerQuery, writerValue);
                element.writer = writerResult[0].name;
                element.writerImg = writerResult[0].img;

                //테마 정보
                let themeInfoQuery = `SELECT * FROM theme_sentence WHERE sentenceIdx = ?`;
                let themeInfoValue = [sentenceIdx];
                let themeInfoResult = await pool.queryParam_Parse(themeInfoQuery, themeInfoValue);
                let themeIdx = themeInfoResult[0].themeIdx;
                element.themeIdx = themeIdx;
                let themeNameQuery = `SELECT theme FROM theme WHERE themeIdx = ?`;
                let themeNameValue = [themeIdx];
                let themeNameResult = await pool.queryParam_Parse(themeNameQuery, themeNameValue);
                element.theme = themeNameResult[0].theme;

                //문장 - 북마크 여부
                if(curatorIdx === "guest"){
                    element.alreadyBookmarked = false;
                }
                else{
                    let alreadyBookmarkedQuery = `SELECT * FROM curator_sentence WHERE curatorIdx = ? AND sentenceIdx = ?`;
                    let alreadyBookmarkedValues = [curatorIdx, sentenceIdx];
                    let alreadyBookmarkedResult = await pool.queryParam_Parse(alreadyBookmarkedQuery, alreadyBookmarkedValues);
                    if(alreadyBookmarkedResult.length == 0){
                        element.alreadyBookmarked = false;
                    }
                    else{
                        element.alreadyBookmarked = true;
                    }
                }

                //문장 - 좋아요 여부
                if(curatorIdx === "guest"){
                    element.alreadyLiked = false;
                }
                else{
                    let sentenceLikedQuery = `SELECT * FROM curator_sentence_like WHERE curatorIdx = ? AND sentenceIdx = ?`;
                    let sentenceLikedValues = [curatorIdx, sentenceIdx];
                    let sentenceLikedResult = await pool.queryParam_Parse(sentenceLikedQuery, sentenceLikedValues);
                    if(sentenceLikedResult.length == 0){
                        element.alreadyLiked = false;
                    }
                    else{
                        element.alreadyLiked = true;
                    }
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
                let query = `SELECT keyword FROM keyword JOIN curator ON keyword.keywordIdx = curator.keywordIdx WHERE curatorIdx = ?`;
                let value = [curatorIdx];
                keyword = await pool.queryParam_Parse(query, value);
                if(keyword.length !== 0){
                    element.keyword = keyword[0].keyword;
                }
                else{
                    element.keyword = null;
                }
            }));
            return result.map(curatorData);

        }catch(err){
            console.log('getRecommendCurator err: ' + err);
        }throw err;
    },

    getThemeInCurator: async(curatorIdx) =>{
        const query = `SELECT t.* FROM theme t INNER JOIN theme_sentence ts ON t.themeIdx = ts.themeIdx INNER JOIN sentence s ON ts.sentenceIdx = s.sentenceIdx
                    GROUP BY t.themeIdx HAVING COUNT(distinct s.writerIdx) >= 3 ORDER BY createdAt DESC limit 2`;
        try{
            //--- 테마 ---
            let result = {};
            let themeResult = await pool.queryParam(query);

            await Promise.all(themeResult.map(async(element) => {
                let themeIdx = element.themeIdx;
                //테마 배경 이미지
                let themeImgIdx = element.themeImgIdx;
                let themeImgQuery = `SELECT img FROM themeImg WHERE themeImgIdx = ?`;
                let themeImgValue = [themeImgIdx];
                let themeImgResult = await pool.queryParam_Parse(themeImgQuery, themeImgValue);
                element.themeImg = themeImgResult[0].img;

                //안에 문장 수
                let sentenceNumQuery = `SELECT COUNT(*) as num FROM theme_sentence WHERE themeIdx = ?`;
                let sentenceNumValue = [themeIdx];
                let sentenceNumResult = await pool.queryParam_Parse(sentenceNumQuery, sentenceNumValue);
                element.sentenceNum = sentenceNumResult[0].num;

                //참여한 큐레이터 수
                let curatorNumQuery = `SELECT COUNT(distinct sentence.writerIdx) as num
                                        FROM theme_sentence
                                        JOIN sentence ON sentence.sentenceIdx = theme_sentence.sentenceIdx
                                        WHERE theme_sentence.themeIdx = ?`;
                let curatorNumValue = [themeIdx];
                let curatorNumResult = await pool.queryParam_Parse(curatorNumQuery, curatorNumValue);
                element.curatorNum = curatorNumResult[0].num;

                //--- 큐레이터 ---
                let curatorQuery = `SELECT distinct(s.writerIdx) FROM sentence s JOIN theme_sentence ts ON s.sentenceIdx = ts.sentenceIdx WHERE ts.themeIdx = ? ORDER BY s.likes DESC limit 3`;
                let curatorValue = [themeIdx];
                let curatorResult = await pool.queryParam_Parse(curatorQuery, curatorValue);

                await Promise.all(curatorResult.map(async(element) => {
                    let curatorIdx2 = element.writerIdx; 
                    let curatorInfoQuery = `SELECT * FROM curator WHERE curatorIdx = ?`;
                    let curatorInfoValue = [curatorIdx2];
                    let curatorInfoResult = await pool.queryParam_Parse(curatorInfoQuery, curatorInfoValue);

                    //어차피 위에 .map으로 다 알아서 들어가는 정보들!!
                    element.curatorIdx = curatorInfoResult[0].curatorIdx;
                    element.name = curatorInfoResult[0].name;
                    element.img = curatorInfoResult[0].img;
                    element.subscribe = curatorInfoResult[0].subscribe;

                    //프로필 - 키워드
                    let keywordIdx = curatorInfoResult[0].keywordIdx;
                    let keywordQuery = `SELECT keyword FROM keyword WHERE keywordIdx = ?`;
                    let keywordValue = [keywordIdx];
                    let keyword = await pool.queryParam_Parse(keywordQuery, keywordValue);
                    if(keyword.length !== 0){
                        element.keyword = keyword[0].keyword;
                    }
                    else{
                        element.keyword = null;
                    }

                    //프로필 - 구독 여부
                    if(curatorIdx === "guest"){
                        element.alreadySubscribed = false;
                    }
                    else{
                        let followQuery = `SELECT * FROM follow WHERE followerIdx = ${curatorIdx} AND followedIdx = ${curatorIdx2}`;
                        let followValues = [curatorIdx, curatorIdx2];
                        let followResult = await pool.queryParam_Parse(followQuery, followValues);
                        if(followResult.length == 0){
                            element.alreadySubscribed = false;
                        }
                        else{
                            element.alreadySubscribed = true;
                        }
                    }
                }));
                element.curators = curatorResult.map(CuratorData);
            }));

            result.theme = themeResult;
            
            return result;
        }catch(err){
            console.log('getThemeInCurator err: ' + err);
        }throw err;
    },

    getCuratorByKeyword: async(keywordIdx, followerIdx) =>{
        const query = `SELECT * FROM curator WHERE keywordIdx = ?`;
        try{
            const value = [keywordIdx];
            let result = await pool.queryParam_Parse(query, value);
            let keyword;
            let alreadySave;
            await Promise.all(result.map(async(element) =>{
                let curatorIdx = element.curatorIdx;
                let curatorQuery = `SELECT keyword FROM keyword JOIN curator ON keyword.keywordIdx = curator.keywordIdx WHERE curatorIdx = ?`;
                let curatorValue = [curatorIdx];
                keyword = await pool.queryParam_Parse(curatorQuery, curatorValue);
                element.keyword = keyword[0].keyword;

                if(followerIdx === "guest"){
                    element.alreadySubscribed = false;
                }
                else{
                    let saveQuery = `SELECT * FROM follow WHERE followerIdx = ? AND followedIdx = ?`;
                    let saveValues = [followerIdx, curatorIdx];
                    alreadySave = await pool.queryParam_Parse(saveQuery, saveValues);
                    if(alreadySave.length === 0){
                        element.alreadySubscribed = false;
                    }
                    else{
                        element.alreadySubscribed = true;
                    }
                }                
            }));
            return result.map(curatorData);

        }catch(err){
            console.log('getCuratorByKeyword err: ' + err);
        }throw err;
    },
};

module.exports = curator;