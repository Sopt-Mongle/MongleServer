const pool = require('../modules/pool');

const ThemeData = require('../modules/data/themeData');

const my = {
    createSentence: async({curatorIdx, sentence, title, author, publisher}) => {
        const fields = `sentence, title, author, likes, saves, writerIdx, publisher`;
        const questions = `?, ?, ?, ?, ?, ?, ?`;
        const values = [];

        try{
            values.push(sentence);
            values.push(title);
            values.push(author);
            values.push(0);
            values.push(0);
            values.push(curatorIdx);
            values.push(publisher);

            console.log(values);
            query = `INSERT INTO sentence(${fields}) VALUES(${questions})`;

            const result2 = await pool.queryParamArr(query, values);

            const sentenceIdx = result2.insertId;
            query = `INSERT INTO curator_sentence(curatorIdx, sentenceIdx) VALUES(${curatorIdx}, ${sentenceIdx})`;
            await pool.queryParam(query);

            return;
        }
        catch(err){
            console.log('writeSentence err: ' + err);
        }throw err;

    },

    selectTheme : async() =>{
        let query = `SELECT * FROM theme JOIN (SELECT MAX(themeSentenceIdx) as A, themeIdx FROM theme_sentence GROUP BY themeIdx ORDER BY A DESC) as T ON theme.themeIdx = T.themeIdx;`;
        try{
            const result = await pool.queryParam(query);
            
            await Promise.all(result.map(async(element) =>{
                let themeImgIdx = element.themeImgIdx;
                let writerIdx = element.writerIdx;

                query = `SELECT img FROM themeImg WHERE themeImgIdx = ${themeImgIdx}`;
                let imgResult = await pool.queryParam(query);
                element.themeImg = imgResult[0].img;

                query = `SELECT name, img FROM curator WHERE curatorIdx = ${writerIdx}`;
                let writerResult = await pool.queryParam(query);

                element.writer = writerResult[0].name;
                element.writerImg = writerResult[0].img;

                let themeIdx = element.themeIdx;
                query = `SELECT * FROM curator_theme WHERE curatorIdx = ${writerIdx} AND themeIdx = ${themeIdx}`;
                let alreadyResult = await pool.queryParam(query);

                let alreadyBookmarked;
                if(alreadyResult.length == 0){
                    alreadyBookmarked = false;
                }
                else{
                    alreadyBookmarked = true;
                }

                element.alreadyBookmarked = alreadyBookmarked;

            }));

            // console.log(result.map(ThemeData));
            return result.map(ThemeData);

        }
        catch(err){
            console.log('selectTheme err: ' + err);
        }throw err;
    }

};

module.exports = my;