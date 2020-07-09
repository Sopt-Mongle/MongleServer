const pool = require('../modules/pool');

const SentenceData = require('../modules/data/sentenceData');
const ThemeData = require('../modules/data/themeData');

const search = {
    searchCurator: async()=>{

    },

    searchTheme: async(curatorIdx, words)=>{
        const queryWords = words.replace(/(\s)/g, "%");
        // console.log(queryWords);
        
        let query = `SELECT * FROM theme WHERE theme LIKE "%${queryWords}%"`;
        try{
            const result = await pool.queryParam(query);

            query = `INSERT INTO search_words(curatorIdx, words) VALUES(${curatorIdx}, "${words}")`;
            await pool.queryParam(query);
            
            return result.map(ThemeData);
        }
        catch(err){
            console.log('searchTheme ERROR : ', err);
            throw err;
        }
    },

    searchSentence: async(curatorIdx, words)=>{
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
    }

};

module.exports = search;