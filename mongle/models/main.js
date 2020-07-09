const pool = require('../modules/pool');
const SentenceData = require('../modules/data/sentenceData');
const curatorData = require('../modules/data/curatorData');
const ThemeData = require('../modules/data/themeData');
const main = 
{
    editorsPick: async()=>{
        let query = `SELECT * FROM illust`;
        try{
            let result = await pool.queryParam(query);
            return result;
        }
        catch(err){
            console.log('getIllust ERROR : ', err);
            throw err;
        }
    },
    getTodaySentence: async()=>{
        //now에서 24시간전~지금까지 좋아요가 가장 많이 찍힌 순으로 정렬해서 ~
        let query = `SELECT * FROM sentence JOIN curator_sentence_like ON sentence.sentenceIdx = curator_sentence_like.sentenceIdx
        WHERE (curator_sentence_like.timestamp) >= DATE_SUB(NOW(), INTERVAL 15 HOUR) GROUP BY curator_sentence_like.sentenceIdx ORDER BY count(curator_sentence_like.sentenceIdx) DESC;`;
        try{
            let result = await pool.queryParam(query);
            return result.map(SentenceData);
        }
        catch(err){
            console.log('getTodaySentence err' + err);
        }throw err;
    },

    getTodayCurator: async()=>{
        //24시간전~지금까지 구독수가 가장 많이 찍힌 큐레이터 순으로~
        let query = `SELECT * FROM curator JOIN follow ON curator.curatorIdx = follow.followedIdx
        WHERE (follow.timestamp) >= DATE_SUB(NOW(), INTERVAL 15 HOUR) GROUP BY follow.followedIdx ORDER BY count(follow.followedIdx) DESC`;
        try{
            let result = await pool.queryParam(query);
            let keywords;
            await Promise.all(result.map(async(element) => {
                let curatorIdx = element.curatorIdx;
                query = `SELECT keyword FROM keyword JOIN curator_keyword ON keyword.keywordIdx = curator_keyword.keywordIdx WHERE curatorIdx = ${curatorIdx}`;
                const keywordResult = await pool.queryParam(query);
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
            return result.map(curatorData);
        }
        catch(err){
            console.log('getTodayCurator err' + err);
        }throw err;
    },

    getTodayTheme: async()=>{
        //now에서 24시간전~지금까지 테마의 북마크가 가장 많이 된 순으로 정렬해서 ~
        let query = `SELECT * FROM theme JOIN curator_theme ON theme.themeIdx = curator_theme.themeIdx
        WHERE curator_theme.timestamp >= DATE_SUB(NOW(), INTERVAL 15 HOUR) GROUP BY curator_theme.themeIdx ORDER BY count(curator_theme.themeIdx) DESC`;
        try{
            let result = await pool.queryParam(query);
            return result.map(ThemeData);
        }
        catch(err){
            console.log('getTodayTheme err' + err);
        }throw err;
    }
};

module.exports = main;