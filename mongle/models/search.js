const pool = require('../modules/pool');

const CuratorData = require('../modules/data/curatorData');
const SentenceData = require('../modules/data/sentenceData');
const ThemeData = require('../modules/data/themeData');
const jwt = require('../modules/jwt');
const search = {
    searchCurator: async(words)=>{
        const queryWords = words.replace(/(\s)/g, "%");

        let query = `SELECT * FROM curator WHERE name LIKE "%${queryWords}%"`;
        try{
            let tempResult = await pool.queryParam(query);

            await Promise.all(tempResult.map(async(element) => {
                let keywordIdx = element.keywordIdx;
                query = `SELECT keyword FROM keyword WHERE keywordIdx = ${keywordIdx}`;
                const keywordResult = await pool.queryParam(query);
                console.log(keywordResult[0]);
                if(keywordResult[0] !== undefined){
                    element.keyword = keywordResult[0].keyword;
                }
                
            }));

            return tempResult.map(CuratorData);

            // return result;
        }
        catch(err){
            console.log('searchCurator ERROR : ', err);
            throw err;
        }

    },

    searchTheme: async(token, words)=>{
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
        const queryWords = words.replace(/(\s)/g, "%");

        let query = `SELECT * FROM theme WHERE theme LIKE "%${queryWords}%"`;
        try{
            //최근 검색어 테이블에 저장
            const query2 = `INSERT INTO search_words(curatorIdx, word) VALUES(${curatorIdx}, "${words}")`;
            await pool.queryParam(query2);

            let result = await pool.queryParam(query);
            await Promise.all(result.map(async(element) =>{
                //안에 문장 수
                let themeIdx = element.themeIdx;
                query = `SELECT COUNT(*) as num FROM theme_sentence WHERE themeIdx = ${themeIdx}`;
                let sentenceNum = await pool.queryParam(query);
                element.sentenceNum = sentenceNum[0].num;

                //themeImg 뽑아주기
                let themeImgIdx = element.themeImgIdx;
                query = `SELECT img FROM themeImg WHERE themeImgIdx = ${themeImgIdx}`;
                let themeImgResult = await pool.queryParam(query);
                element.themeImg = themeImgResult[0].img;
            }));
            
            
            return result.map(ThemeData);
        }
        catch(err){
            console.log('searchTheme ERROR : ', err);
            throw err;
        }
    },

    searchSentence: async( words)=>{
        const queryWords = words.replace(/(\s)/g, "%");
        
        let query = `SELECT * FROM sentence WHERE sentence LIKE "%${queryWords}%"`;
        try{
            const result = await pool.queryParam(query);
            await Promise.all(result.map(async(element) => {
                //문장 writer 정보
                let writerIdx = element.writerIdx;
                query = `SELECT name, img FROM curator WHERE curatorIdx = ${writerIdx}`;
                let writerResult = await pool.queryParam(query);
                element.writer = writerResult[0].name;
                element.writerImg = writerResult[0].img;

                //테마 정보
                let sentenceIdx = element.sentenceIdx;
                query = `SELECT * FROM theme_sentence WHERE sentenceIdx = ${sentenceIdx}`;
                let themeInfoResult = await pool.queryParam(query);
                let themeIdx = themeInfoResult[0].themeIdx;
                element.themeIdx = themeIdx;
                query = `SELECT theme FROM theme WHERE themeIdx = ${themeIdx}`;
                let themeNameResult = await pool.queryParam(query);
                element.theme = themeNameResult[0].theme;
            }));

            return result.map(SentenceData);
        }
        catch(err){
            console.log('searchSentence ERROR : ', err);
            throw err;
        }

    },

    recentSearch: async(token) => {
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
        let query = `SELECT * FROM search_words WHERE curatorIdx = ${curatorIdx} ORDER BY searchWordsIdx DESC LIMIT 10`;
        try{
            const result = await pool.queryParam(query);
            // console.log(result);

            let words = [];
            let test = [];

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

    recentDelete: async(token) =>{
        const curatorIdx = (await jwt.verify(token)).valueOf(0).idx;
        let query = `DELETE FROM search_words WHERE curatorIdx = ${curatorIdx}`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }
        catch(err){
            console.log('recentDelete ERROR : ', err);
            throw err;
        }
    },

    recommendSearch : async()=>{
        let query = `SELECT word FROM search_words GROUP BY word ORDER BY COUNT(*) DESC LIMIT 15`;
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