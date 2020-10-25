const pool = require('../modules/pool');
const jwt = require('../modules/jwt');

const CuratorData = require('../modules/data/curatorData');
const ThemeData = require('../modules/data/themeData');
const SentenceData = require('../modules/data/sentenceData');

const my = {
    getMyProfile: async(curatorIdx) =>{
        const query = `SELECT * FROM curator WHERE curatorIdx = ?`;
        try{
            const value = [curatorIdx];
            let result = await pool.queryParam_Parse(query, value);
            //키워드
            if(result[0].keywordIdx !== null){
                const keywordIdx = result[0].keywordIdx;
                const keywordQuery = `SELECT keyword FROM keyword WHERE keywordIdx = ?` ;
                const keywordValue = [keywordIdx];
                const keywordResult = await pool.queryParam_Parse(keywordQuery, keywordValue);
                result[0].keyword = keywordResult[0].keyword;
                
            }
            
            return result.map(CuratorData);
        }
        catch(err){
            console.log('getMyProfile err : ', err);
            throw err;
        }
    },

    getMyTheme: async(curatorIdx) => {
        const query = `SELECT * FROM theme JOIN curator_theme ON theme.themeIdx = curator_theme.themeIdx WHERE curator_theme.curatorIdx = ?`;
        try{
            const value = [curatorIdx];
            let result = await pool.queryParam_Parse(query, value);

            let resultArray = {};
            let save = [];
            let write = [];

            await Promise.all(result.map(async(element) => {
                let writerIdx = element.writerIdx;
                let themeIdx = element.themeIdx;

                //안에 문장 수
                let countQuery = `SELECT COUNT(*) as num FROM theme_sentence WHERE themeIdx = ?`;
                let countValue = [themeIdx];
                let sentenceNum = await pool.queryParam_Parse(countQuery, countValue);
                element.sentenceNum = sentenceNum[0].num;

                //저장한 테마, 내가 쓴 테마 구분
                if(writerIdx == curatorIdx){
                    let temp = write.find(s => s.themeIdx == themeIdx);
                    if(temp !== undefined){
                        save.push(element);
                    }
                    else{
                        write.push(element);
                    }
                }
                else{
                    save.push(element);
                }
            }));
            
            resultArray.write = write.map(ThemeData);
            resultArray.save = save.map(ThemeData);
            
            return resultArray;
        }
        catch(err){
            console.log('getMyTheme err : ', err);
            throw err;
        }
    },

    getMySentence: async(curatorIdx) => {
        const query = `SELECT * FROM sentence JOIN curator_sentence ON sentence.sentenceIdx = curator_sentence.sentenceIdx WHERE curator_sentence.curatorIdx = ?`;
        try{
            const value = [curatorIdx];
            let result = await pool.queryParam_Parse(query, value);

            let resultArray = {};
            let save = [];
            let write = [];

            await Promise.all(result.map(async(element) => {
                let writerIdx = element.writerIdx;
                let sentenceIdx = element.sentenceIdx;

                //writer 정보
                let writerQuery = `SELECT name FROM curator WHERE curatorIdx = ?`;
                let writerValue = [writerIdx];
                let writerResult = await pool.queryParam_Parse(writerQuery, writerValue);
                element.writer = writerResult[0].name;

                //테마 정보
                let themeQuery = `SELECT theme FROM theme JOIN theme_sentence ON theme.themeIdx = theme_sentence.themeIdx WHERE theme_sentence.sentenceIdx = ?`;
                let themeValue = [sentenceIdx];
                let themeResult = await pool.queryParam_Parse(themeQuery, themeValue);
                element.theme = themeResult[0].theme;              

                //저장한 문장, 내가 쓴 문장 구분
                if(writerIdx == curatorIdx){
                    let temp = write.find(s => s.sentenceIdx == sentenceIdx);
                    if(temp !== undefined){
                        save.push(element);
                    }
                    else{
                        write.push(element);
                    }
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
        const query = `SELECT * FROM follow JOIN curator ON follow.followedIdx = curatorIdx WHERE followerIdx = ?`;
        
        try{
            const value = [curatorIdx];
            let result = await pool.queryParam_Parse(query, value);

            //구독 중인 큐레이터
            await Promise.all(result.map(async(element) => {
                let keywordIdx = element.keywordIdx;
                //키워드
                if(keywordIdx != null){
                    let keywordQuery = `SELECT keyword FROM keyword WHERE keywordIdx = ?`;
                    let keywordValue = [keywordIdx];
                    let keywordResult = await pool.queryParam_Parse(keywordQuery, keywordValue);
                    element.keyword = keywordResult[0].keyword;
                }
                
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

    deleteSentence: async(curatorIdx, sentenceIdx) => {
        const preQuery = `SELECT * FROM curator_sentence WHERE curatorIdx = ? AND sentenceIdx = ?`;
        const query = `DELETE FROM sentence WHERE sentenceIdx = ?`;
        try{
            const preValues = [curatorIdx, sentenceIdx];
            const preResult = await pool.queryParam_Parse(preQuery, preValues);
            if(preResult.length == 0){
                return -1;
            }
            else{
                const value = [sentenceIdx];
                const result = await pool.queryParam_Parse(query, value);
                return result;
            }
            
        }catch(err){
            console.log('deleteSentence err: ', err);
        }throw err;
    },

    editSentence: async(curatorIdx, sentenceIdx, sentence) => {
        const preQuery = `SELECT * FROM curator_sentence WHERE curatorIdx = ? AND sentenceIdx = ?`;
        const query = `UPDATE sentence SET sentence = ? WHERE sentenceIdx = ?`;
        try{
            const preValues = [curatorIdx, sentenceIdx];
            const preResult = await pool.queryParam_Parse(preQuery, preValues);
            if(preResult.length == 0){
                return -1;
            }
            else{
                const values = [sentence, sentenceIdx];
                await pool.queryParam_Parse(query, values);
                const selectQuery = `SELECT sentence FROM sentence WHERE sentenceIdx = ?`;//수정한 문장 리턴
                const selectValue = [sentenceIdx];
                let selectResult = await pool.queryParam_Parse(selectQuery, selectValue);
                return selectResult[0];
            }
        }catch(err){
            console.log('editSentence err: ', err);
        }throw err;
    },

    editProfile: async(curatorIdx, name, img, introduce, keywordIdx) => {
        const preQuery = `SELECT * FROM curator WHERE name = ? AND curatorIdx != ?`;
        const query = `UPDATE curator SET name = ?, img = ?, introduce = ?, keywordIdx = ? WHERE curatorIdx = ?`;
        try{
            const preValues = [name, curatorIdx];
            const preResult = await pool.queryParam_Parse(preQuery, preValues);
            if(preResult.length > 0){ //이미 있는 닉네임일때
                return -1;
            }
            else{
                const values = [name, img, introduce, keywordIdx, curatorIdx];
                await pool.queryParam_Parse(query, values);
                const selectQuery = `SELECT name, img, introduce, keywordIdx FROM curator WHERE curatorIdx = ?`;
                const selectValue = [curatorIdx];
                const selectResult = await pool.queryParam_Parse(selectQuery, selectValue);
                selectResult[0].name = selectResult[0].name;
                selectResult[0].img = selectResult[0].img;
                selectResult[0].introduce = selectResult[0].introduce;

                //키워드
                const keywordIdx2 = selectResult[0].keywordIdx;
                const keywordQuery = `SELECT keyword FROM keyword WHERE keywordIdx = ?` ;
                const keywordValue = [keywordIdx2];
                const keywordResult = await pool.queryParam_Parse(keywordQuery, keywordValue);
                selectResult[0].keyword = keywordResult[0].keyword;
                return selectResult.map(CuratorData);
            }
        }catch(err){
            console.log('editProfile err: ', err);
        }throw err;
    }
};

module.exports = my;