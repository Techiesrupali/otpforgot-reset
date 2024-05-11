const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
require('dotenv').config();
// const jwt = require('jsonwebtoken');
// const User = require('../model/Clientmodel'); 

const SendMail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });

    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Product",
            link: "https://product.com/"
        }
    });
    const emailContent = {
        body: {
            name: `${email}`,
            intro: "Reset Password",
            action: {
                instructions: "To Reset Password click below",
                button: {
                    color: "#FF3838",
                    text: otp
                }
            },
        }
    };

    const emailBody = mailGenerator.generate(emailContent);

    return transporter.sendMail({
        from: "techiesrupalibhadoriya@gmail.com",
        to: email,
        subject: "Reset Password",
        text: "This a reset password link",
        html: emailBody,
    });
};
module.exports =SendMail;
