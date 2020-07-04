const pool = require('../modules/pool');
const table = 'curator';
const CuratorData = require('../modules/data/curatorData');

const curator = {
    getAllCurators: async(curatorIdx) =>{
        let query = `SELECT curatorIdx, name, img, subscribe FROM follow JOIN ${table} ON follow.followedIdx = curatorIdx WHERE followerIdx = ${curatorIdx}`;
        
        try{
            let tempResult = await pool.queryParam(query);
            // let result = new Array();
            // console.log(CuratorData(result[0]));
            let keywords;
            // console.log(tempResult);
            let res = await Promise.all(tempResult.map(async(element) => {
                let result = [];
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
                
                return result;
            }));

            // console.log(tempResult);

            return tempResult.map(CuratorData);
        }
        catch(err){
            console.log('getAllCurators ERROR : ', err);
            throw err;
        }
    }
};

module.exports = curator;