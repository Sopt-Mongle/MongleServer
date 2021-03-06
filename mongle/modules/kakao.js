const request = require('request');
const ak = '5a088102e812f22a3de266219a0ae54e';

module.exports = {
    bookSearch: (keyword)=>{
        return new Promise((resolve, reject)=>{
            const options = {
                'uri' : `https://dapi.kakao.com/v3/search/book`, 
                'headers' : {
                    'Authorization' : `KakaoAK ${ak}`,
                },
                'qs' : {
                    'query' : `${keyword}`,
                    'sort' : 'accuracy',
                    'size' : 30,
                    'target' : 'title'
                }  
            };
            
            request(options, async (err, result)=>{
                const jsonResult = JSON.parse(result.body);
                if(err) {
                    console.log('request err : ' + err);
                    reject(err)
                }
                else resolve(jsonResult);
            })
        })
    }
};