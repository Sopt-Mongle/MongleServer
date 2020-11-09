const pool = require('../modules/pool');
const CuratorData = require('../modules/data/curatorData');
const SentenceData = require('../modules/data/sentenceData');
const ThemeData = require('../modules/data/themeData');
const jwt = require('../modules/jwt');

const search = {
    searchCurator: async(token, words)=>{
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
        const queryWords = words.replace(/(\s)/g, "%");

        const query = `SELECT * FROM curator WHERE name LIKE ?`;
        const value = ['%'+queryWords+'%'];

        try{
            let tempResult = await pool.queryParam_Parse(query, value);
            // console.log(tempResult);
            await Promise.all(tempResult.map(async(element) => {
                let keywordIdx = element.keywordIdx;
                let keywordQuery = `SELECT keyword FROM keyword WHERE keywordIdx = ?`;
                let keywordValue = [keywordIdx];
                const keywordResult = await pool.queryParam_Parse(keywordQuery, keywordValue);
                if(keywordResult[0] !== undefined){
                    element.keyword = keywordResult[0].keyword;
                }

                //구독 여부
                let curatorIdx2 = element.curatorIdx;
                let followQuery = `SELECT * FROM follow WHERE followerIdx = ? AND followedIdx = ?`;
                let followValues = [curatorIdx, curatorIdx2];
                const followResult = await pool.queryParam_Parse(followQuery, followValues);
                if(followResult.length == 0){
                    element.alreadySubscribed = false;
                }
                else{
                    element.alreadySubscribed = true;
                }
                
            }));

            return tempResult.map(CuratorData);
        }
        catch(err){
            console.log('searchCurator ERROR : ', err);
            throw err;
        }

    },

    searchTheme: async(token, words)=>{
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
        const queryWords = words.replace(/(\s)/g, "%");

        const query = `SELECT * FROM theme WHERE theme LIKE ?`;
        const value = ['%'+queryWords+'%'];
        
        try{
            let result = await pool.queryParam_Parse(query, value);

            //최근 검색어 테이블에 저장
            const query2 = `INSERT INTO search_words(curatorIdx, word) VALUES(?, ?)`;
            const values2 = [curatorIdx, words];
            await pool.queryParam_Parse(query2, values2);

            await Promise.all(result.map(async(element) =>{
                //안에 문장 수
                let themeIdx = element.themeIdx;
                let countQuery = `SELECT COUNT(*) as num FROM theme_sentence WHERE themeIdx = ?`;
                let countValue = [themeIdx];
                let sentenceNum = await pool.queryParam_Parse(countQuery, countValue);
                element.sentenceNum = sentenceNum[0].num;

                //themeImg 뽑아주기
                let themeImgIdx = element.themeImgIdx;
                let themeImgQuery = `SELECT img FROM themeImg WHERE themeImgIdx = ?`;
                let themeImgValue = [themeImgIdx];
                let themeImgResult = await pool.queryParam_Parse(themeImgQuery, themeImgValue);
                element.themeImg = themeImgResult[0].img;
            }));
            
            return result.map(ThemeData);
        }
        catch(err){
            console.log('searchTheme ERROR : ', err);
            throw err;
        }
    },

    searchSentence: async(words)=>{
        const queryWords = words.replace(/(\s)/g, "%");
        
        const query = `SELECT * FROM sentence WHERE sentence LIKE ?`;
        const value = ['%'+queryWords+'%'];
        
        try{
            const result = await pool.queryParam_Parse(query, value);
            await Promise.all(result.map(async(element) => {
                //문장 writer 정보
                let writerIdx = element.writerIdx;
                let writerQuery = `SELECT name, img FROM curator WHERE curatorIdx = ?`;
                let writerValue = [writerIdx];
                let writerResult = await pool.queryParam_Parse(writerQuery, writerValue);
                element.writer = writerResult[0].name;
                element.writerImg = writerResult[0].img;

                //테마 정보
                let sentenceIdx = element.sentenceIdx;
                let themeInfoQuery = `SELECT * FROM theme_sentence WHERE sentenceIdx = ?`;
                let themeInfoValue = [sentenceIdx];
                let themeInfoResult = await pool.queryParam_Parse(themeInfoQuery, themeInfoValue);
                let themeIdx = themeInfoResult[0].themeIdx;
                element.themeIdx = themeIdx;
                let themeNameQuery = `SELECT theme FROM theme WHERE themeIdx = ?`;
                let themeNameValue = [themeIdx];
                let themeNameResult = await pool.queryParam_Parse(themeNameQuery, themeNameValue);
                element.theme = themeNameResult[0].theme;
            }));

            return result.map(SentenceData);
        }
        catch(err){
            console.log('searchSentence ERROR : ', err);
            throw err;
        }

    },

    recentSearch: async(curatorIdx) => {
        const query = `SELECT * FROM search_words WHERE curatorIdx = ? ORDER BY searchWordsIdx DESC LIMIT 10`;
        const value = [curatorIdx];
        try{
            const result = await pool.queryParam_Parse(query, value);

            let words = [];
            result.valueOf(0).forEach(element => {
                if(!words.includes(element.word) && words.length < 5){
                    words.push(element.word);
                }
                
            });

            return words;

        }
        catch(err){
            console.log('recentSearch ERROR : ', err);
            throw err;
        }
    },

    recentDelete: async(curatorIdx) =>{
        const query = `DELETE FROM search_words WHERE curatorIdx = ?`;
        const value = [curatorIdx];
        try{
            const result = await pool.queryParam_Parse(query, value);
            return result;
        }
        catch(err){
            console.log('recentDelete ERROR : ', err);
            throw err;
        }
    },

    recommendSearch : async()=>{
        const query = `SELECT word FROM search_words GROUP BY word ORDER BY COUNT(*) DESC LIMIT 15`;
        try{
            const tempResult = await pool.queryParam(query);
            let result = [];
            await Promise.all(tempResult.map(async(element) =>{
                let word = element.word;
                result.push(word);
            }));
            return result;
        }
        catch(err){
            console.log('recommendSearch ERROR : ', err);
            throw err;
        }
    }
};

module.exports = search;