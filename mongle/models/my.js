const pool = require('../modules/pool');

const CuratorData = require('../modules/data/curatorData');
const ThemeData = require('../modules/data/themeData');
const SentenceData = require('../modules/data/sentenceData');

const my = {
    getMyInfo: async(curatorIdx) =>{
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
                query = `SELECT keyword FROM keyword JOIN curator_keyword ON keyword.keywordIdx = curator_keyword.keywordIdx WHERE curatorIdx = ${curatorIdx}`;
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
            console.log('getMyInfo err : ', err);
            throw err;
        }
    }
};

module.exports = my;