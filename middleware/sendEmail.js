const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const config = require("../config/config");
const { EMAIL } = config.config;

export const sendEmail = (email, subject, html) => {

  let transport = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      //   host: EMAIL.host,
      auth: {
        user: EMAIL.user,
        pass: EMAIL.password,      
      },    
    })
  );

  const mailOptions = {
    from: EMAIL.user,
    to: email,
    subject: subject,
    html: html,
  };

  transport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log("error--", error);
      return false;
    } else {
      return true;
    }
  });
};
