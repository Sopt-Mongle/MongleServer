const pool = require('../modules/pool');

const SentenceData = require('../modules/data/sentenceData');

const search = {
    searchCurator: async()=>{

    },

    searchTheme: async()=>{

    },

    searchSentence: async(words)=>{
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

    }

};

module.exports = search;