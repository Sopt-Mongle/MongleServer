const pool = require('../modules/pool');

const CuratorData = require('../modules/data/curatorData');
const ThemeData = require('../modules/data/themeData');
const SentenceData = require('../modules/data/sentenceData');

const my = {
    getMyProfile: async(curatorIdx) =>{
        let query = `SELECT * FROM curator WHERE curatorIdx = ${curatorIdx}`;
        try{
            let result = await pool.queryParam(query);
            //키워드
            const keywordIdx = result[0].keywordIdx;
            query = `SELECT keyword FROM keyword WHERE keywordIdx = ${keywordIdx}` ;
            const keywordResult = await pool.queryParam(query);
            result[0].keyword = keywordResult[0].keyword;
            
            return result.map(CuratorData);
        }
        catch(err){
            console.log('getMyProfile err : ', err);
            throw err;
        }
    },

    getMyTheme: async(curatorIdx) => {
        let query = `SELECT * FROM theme JOIN curator_theme ON theme.themeIdx = curator_theme.themeIdx WHERE curator_theme.curatorIdx = ${curatorIdx}`;
        try{
            let result = await pool.queryParam(query);

            let resultArray = {};
            let save = [];
            let write = [];
            await Promise.all(result.map(async(element) => {
                let writerIdx = element.writerIdx;
                let themeIdx = element.themeIdx;

                //안에 문장 수
                query = `SELECT COUNT(*) as num FROM theme_sentence WHERE themeIdx = ${themeIdx}`;
                const sentenceNum = await pool.queryParam(query);
                element.sentenceNum = sentenceNum[0].num;

                //저장한 테마, 내가 쓴 테마 구분
                if(writerIdx == curatorIdx){
                    // console.log(element);
                    write.push(element);
                }
                else{
                    save.push(element);
                }

            }));
            
            resultArray.write = write.map(ThemeData);
            resultArray.save = save.map(ThemeData);
            console.log(resultArray);
            
            return resultArray;
        }
        catch(err){
            console.log('getMyTheme err : ', err);
            throw err;
        }
    },

    getMySentence: async(curatorIdx) => {
        let query = `SELECT * FROM sentence JOIN curator_sentence ON sentence.sentenceIdx = curator_sentence.sentenceIdx WHERE curator_sentence.curatorIdx = ${curatorIdx}`;
        try{
            let result = await pool.queryParam(query);

            let resultArray = {};
            let save = [];
            let write = [];

            await Promise.all(result.map(async(element) => {
                let writerIdx = element.writerIdx;
                let sentenceIdx = element.sentenceIdx;

                //writer 정보
                query = `SELECT name FROM curator WHERE curatorIdx = ${writerIdx}`;
                let writerResult = await pool.queryParam(query);
                element.writer = writerResult[0].name;

                //테마 정보
                query = `SELECT theme FROM theme JOIN theme_sentence ON theme.themeIdx = theme_sentence.themeIdx WHERE theme_sentence.sentenceIdx = ${sentenceIdx}`;
                let themeResult = await pool.queryParam(query);
                element.theme = themeResult[0].theme;

                //저장한 문장, 내가 쓴 문장 구분
                if(writerIdx == curatorIdx){
                    write.push(element);
                }
                else{
                    save.push(element);
                }
            }));
            
            resultArray.write = write.map(SentenceData);
            resultArray.save = save.map(SentenceData);
            
            return resultArray;            

        }
        catch(err){
            console.log('getMySentence err : ', err);
            throw err;
        }

    },

    getMySubscribe: async(curatorIdx) =>{
        let query = `SELECT * FROM follow JOIN curator ON follow.followedIdx = curatorIdx WHERE followerIdx = ${curatorIdx}`;
        
        try{
            let result = await pool.queryParam(query);

            //구독 중인 큐레이터
            await Promise.all(result.map(async(element) => {
                let keywordIdx = element.keywordIdx;
                //키워드
                query = `SELECT keyword FROM keyword WHERE keywordIdx = ${keywordIdx}`;
                const keywordResult = await pool.queryParam(query);
                element.keyword = keywordResult[0].keyword;
                
                //북마크 여부
                element.alreadySubscribed = true;
                
            }));

            return result.map(CuratorData);
        }
        catch(err){
            console.log('getAllCurators ERROR : ', err);
            throw err;
        }
    },

    deleteSentence: async(sentenceIdx) => {
        let query = `DELETE FROM sentence WHERE sentenceIdx = ${sentenceIdx}`;
        try{
            let result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('deleteSentence err: ', err);
        }throw err;
    },

    editSentence: async(sentenceIdx, sentence) => {
        let query = `UPDATE sentence SET sentence = "${sentence}" WHERE sentenceIdx = ${sentenceIdx}`;
        try{
            let result = await pool.queryParam(query);
            let query1 = `SELECT sentence FROM sentence WHERE sentenceIdx = ${sentenceIdx}`;//수정한 문장 리턴
            let result1 = await pool.queryParam(query1);
            return result1;
        }catch(err){
            console.log('editSentence err: ', err);
        }throw err;
    },

    editProfile: async(curatorIdx, name, introduce, keywordIdx) => {
        let query = `UPDATE curator SET name = "${name}", introduce = "${introduce}", keywordIdx = ${keywordIdx} WHERE curatorIdx = ${curatorIdx}`;
        try{
            await pool.queryParam(query);
            query = `SELECT name, introduce, keywordIdx FROM curator WHERE curatorIdx = ${curatorIdx}`;
            const result1 = await pool.queryParam(query);
            result1[0].name = result1[0].name;
            result1[0].introduce = result1[0].introduce;

            //키워드
            const keywordIdx = result1[0].keywordIdx;
            query = `SELECT keyword FROM keyword WHERE keywordIdx = ${keywordIdx}` ;
            const keywordResult = await pool.queryParam(query);
            result1[0].keyword = keywordResult[0].keyword;            
            return result1.map(CuratorData);
        }catch(err){
            console.log('editProfile err: ', err);
        }throw err;
    }
};

module.exports = my;