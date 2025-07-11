//-----------Подключаемые модули-----------//
const nodemailer = require("nodemailer");
//-----------Подключаемые модули-----------//

class Email {
  static transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: "ilya_novoselov_03@mail.ru",
      pass: "nKVAtSp67vmdskgFY39A",
    },
  });

  static async SendMail(email, subject, html) {
    const info = await Email.transporter.sendMail({
      from: '"SKOS-email-server" <ilya_novoselov_03@mail.ru>',
      to: email,
      subject: subject,
      html: html,
    });
    
    console.log(info.messageId);
  }
}

//-----------Экспортируемые модули-----------//
module.exports = Email;
//-----------Экспортируемые модули-----------//
