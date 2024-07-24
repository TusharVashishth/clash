import nodemailer from "nodemailer"
import logger from "./logger.js";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false, 
    auth: {
      user:process.env.SMTP_USER ,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  export const  sendMail = async (to:string ,subject:string , html:string) => {
    // send mail with defined transport object
    try {
      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: to, // list of receivers
        subject: subject, 
        html: html, 
      });
    } catch (error) {
        logger.error({type:"Email Error" ,error})
    }
  }