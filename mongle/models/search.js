const pool = require('../modules/pool');

const CuratorData = require('../modules/data/curatorData');
const SentenceData = require('../modules/data/sentenceData');
const ThemeData = require('../modules/data/themeData');

const search = {
    searchCurator: async(words)=>{
        const queryWords = words.replace(/(\s)/g, "%");

        let query = `SELECT * FROM curator WHERE name LIKE "%${queryWords}%"`;
        try{
            let tempResult = await pool.queryParam(query);

            await Promise.all(tempResult.map(async(element) => {
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

            return tempResult.map(CuratorData);

            // return result;
        }
        catch(err){
            console.log('searchCurator ERROR : ', err);
            throw err;
        }

    },

    searchTheme: async(curatorIdx, words)=>{
        const queryWords = words.replace(/(\s)/g, "%");
        // console.log(queryWords);
        
        let query = `SELECT * FROM theme WHERE theme LIKE "%${queryWords}%"`;
        try{
            const result = await pool.queryParam(query);

            query = `INSERT INTO search_words(curatorIdx, word) VALUES(${curatorIdx}, "${words}")`;
            await pool.queryParam(query);
            
            return result.map(ThemeData);
        }
        catch(err){
            console.log('searchTheme ERROR : ', err);
            throw err;
        }
    },

    searchSentence: async( words)=>{
        const queryWords = words.replace(/(\s)/g, "%");
        // console.log(queryWords);
        
        let query = `SELECT * FROM sentence WHERE sentence LIKE "%${queryWords}%"`;
        try{
            const result = await pool.queryParam(query);
            // console.log(result);
            return result.map(SentenceData);
        }
        catch(err){
            console.log('searchSentence ERROR : ', err);
            throw err;
        }

    },

    recentSearch: async(curatorIdx) => {
        let query = `SELECT * FROM search_words WHERE curatorIdx = ${curatorIdx} ORDER BY searchWordsIdx DESC LIMIT 5`;
        try{
            const result = await pool.queryParam(query);

            let words = [];
            result.valueOf(0).forEach(element => {
                words.push(element.word);
            });

            return words;

        }
        catch(err){
            console.log('recentSearch ERROR : ', err);
            throw err;
        }
    },

    recentDelete: async(curatorIdx) =>{
        let query = `DELETE FROM search_words WHERE curatorIdx = ${curatorIdx}`;
        try{
            const result = await pool.queryParam(query);
            console.log(result);
            return result;
        }
        catch(err){
            console.log('recentDelete ERROR : ', err);
            throw err;
        }
    }

};

module.exports = search;