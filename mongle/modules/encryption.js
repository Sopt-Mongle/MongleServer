const crypto = require('crypto');
module.exports = {
    encrypt: (password, salt) => {
        return new Promise((resolved, rejected) => {
            crypto.pbkdf2(password, salt.toString(), 1, 32, 'sha512', async (err, derivedKey) => {
                if (err) throw err;
                const hashed = derivedKey.toString('hex');
                resolved(hashed);
            });
        })
    },
    salt: async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const buf = crypto.randomBytes(16);
                const salt = buf.toString('base64');
                resolve(salt);
            }
            catch(err) {
                console.log(err);
                reject(err);
            }
        })

    }
}