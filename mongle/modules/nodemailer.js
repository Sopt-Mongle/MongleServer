const nodemailer = require('nodemailer');
const ejs = require('ejs');
const appPassword = require('../config/mailKey').appPassword;

module.exports = {
    auth: async (email) => {
        let authNum = Math.random().toString().substr(2,6);
        let emailTemplete;
        
        ejs.renderFile('./modules/authMail.ejs', {authCode : authNum}, function (err, data) {
            if(err){
                console.log(err);
            }
            emailTemplete = data;
        });

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            prot: 587,
            host: 'smtp.gmail.com',
            secure: false,
            requireTLS: true,
            auth: {
                user: 'mongle.official@gmail.com',
                pass: appPassword
            }
        });

        let mailOptions = {
            from: 'mongle.official@gmail.com',
            to: email.email, // 수신할 이메일
            subject: '몽글 인증 메일입니다', // 메일 제목
            html: emailTemplete,
        };

        try{
            await transporter.sendMail(mailOptions, function (err, info){
                // console.log('Email sent: '+info.response);
                transporter.close()
            });

            return authNum;

        }catch(err){
            console.log(err);

        }
    }
}