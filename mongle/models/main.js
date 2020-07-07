const pool = require('../modules/pool');

const main = {
    getIllust: async()=>{
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
    getTodaySentence: async(now)=>{
        
    }
};

module.exports = main;