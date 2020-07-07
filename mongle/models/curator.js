const pool = require('../modules/pool');
const table = 'curator';
const CuratorData = require('../modules/data/curatorData');
const ThemeData = require('../modules/data/themeData');
const SentenceData = require('../modules/data/sentenceData');
const curator = {
    getAllCurators: async(curatorIdx) =>{
        let query = `SELECT curatorIdx, name, img, subscribe FROM follow JOIN ${table} ON follow.followedIdx = curatorIdx WHERE followerIdx = ${curatorIdx}`;
        
        try{
            let tempResult = await pool.queryParam(query);
            // let result = new Array();
            // console.log(CuratorData(result[0]));
            let keywords;
            // console.log(tempResult);
            await Promise.all(tempResult.map(async(element) => {
                let curatorIdx = element.curatorIdx;
                query = `SELECT keyword FROM curator_keyword WHERE curatorIdx = ${curatorIdx}`;
                const keywordResult = await pool.queryParam(query);
                // console.log(keywordResult[0].keyword);
                var string=JSON.stringify(keywordResult);
                var json = JSON.parse(string);
                
                keywords = json.reduce(function(r, e) {
                    return Object.keys(e).forEach(function(k) {
                        if(!r[k]) r[k] = [].concat(e[k])
                        else r[k] = r[k].concat(e[k])
                    }), r
                }, {});
                
                element.keyword = keywords.keyword;
                
            }));

            // console.log(tempResult);

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

    getCuratorInfo: async(curatorIdx) =>{
        let profilequery = `SELECT curatorIdx, name, img, subscribe FROM curator WHERE curatorIdx = ${curatorIdx}`;
        let themequery = `SELECT * FROM theme JOIN curator_theme ON theme.themeIdx = curator_theme.themeIdx WHERE curator_theme.curatorIdx = ${curatorIdx}`;
        let sentencequery = `SELECT * FROM sentence JOIN curator_sentence ON sentence.sentenceIdx = curator_sentence.sentenceIdx 
                            WHERE curator_sentence.curatorIdx = ${curatorIdx}`;

        try{
            let profileResult = await pool.queryParam(profilequery);
            let themeResult = await pool.queryParam(themequery);
            let sentenceResult = await pool.queryParam(sentencequery);
            let keywords;
            await Promise.all(profileResult.map(async(element) => {
                let curatorIdx = element.curatorIdx;
                query = `SELECT keyword FROM curator_keyword WHERE curatorIdx = ${curatorIdx}`;
                const keywordResult = await pool.queryParam(query);
                // console.log(keywordResult[0].keyword);
                var string=JSON.stringify(keywordResult);
                var json = JSON.parse(string);
                
                keywords = json.reduce(function(r, e) {
                    return Object.keys(e).forEach(function(k) {
                        if(!r[k]) r[k] = [].concat(e[k])
                        else r[k] = r[k].concat(e[k])
                    }), r
                }, {});
            
                element.keyword = keywords.keyword;
                
            }));
            let resultArray = new Array();
            resultArray.push(profileResult.map(CuratorData));
            resultArray.push(themeResult.map(ThemeData));
            resultArray.push(sentenceResult.map(SentenceData));
            return resultArray;
        }
        catch(err){
            console.log('getCuratorInfo err : ', err);
            throw err;
        }
    }
};

module.exports = curator;