const pool = require('../modules/pool');
const encryption = require('../modules/encryption');

const user = {
    signup: async (email, password, name, salt) =>{
        const fields = 'email, password, name, salt';
        const questions = `?, ?, ?, ?`;
        const values = [email, password, name, salt];
        const query = `INSERT INTO curator(${fields}) VALUES(${questions})`;
        try{
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        } catch{
            if(err.errno == 1062){
                console.log('signup ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('signup ERROR :', err);
            throw err;
        }
    },

    signin : async (email)=>{
        const query = `SELECT * FROM curator WHERE email = "?"`;
        const value = [email];
        try{
            const result = await pool.queryParam_Parse(query, value);
            // console.log("입력한 password: " + password);
            // console.log("원래 salt값: " + result[0].salt);
            // console.log("저장된 hash값: " + result[0].password);
            // const hashed = await crypto.pbkdf2Sync(password, result[0].salt, 1, 32, 'sha512').toString('hex');
            // console.log('로그인 비번으로 해쉬한값: ' + hashed);

            // if(result[0].password === hashed) return result;
            // else return false;
            return result;
        } catch(err){
            console.log('signin err : ', err);
            throw err;
        }
    },

    checkUserName: async (name) => {
        const query = `SELECT * FROM curator WHERE name = "?"`;
        const value = [name];
        try{
            const result = await pool.queryParam_Parse(query, value);
            if(result.length > 0) return true;
            else return false;
        } catch(err){
            console.log('checkUserName err : ', err);
            throw err;
        }
    },

    checkUserEmail: async (email) => {
        const query = `SELECT * FROM curator WHERE email = ?`;
        const value = [email];
        try{
            const result = await pool.queryParam_Parse(query, value);
            if(result.length > 0) return true;
            else return false;
        } catch(err){
            console.log('checkUserEmail err : ', err);
            throw err;
        }
    },

    getUserByEmail : async (email) =>{
        const query = `SELECT * FROM curator WHERE email = ?`;
        const value = [email];
        try{
            const result = await pool.queryParam_Parse(query, value);
            return result;
        }
        catch(err){
            console.log('getUserByEmail ERROR : ', err);
            throw err;
        }
    },

    withdraw : async (curatorIdx) =>{
        const query = `DELETE FROM curator WHERE curatorIdx = ?`;
        const value = [curatorIdx];
        try{
            const result = await pool.queryParam_Parse(query, value);
            return result;
        }
        catch(err){
            console.log('withdraw ERROR : ', err);
            throw err;
        }
    }
}
module.exports = user;