const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "testasnode@gmail.com",
    pass: "ncbbgnwyljozujpj"
  }
});

async function sendMail(email)  {
  const mailOptions = {
    from: "testasnode@gmail.com",
    to: email,
    subject: "Wazhine",
    text: `Your clothes are done. You are free to pick it up`
  }
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    }
    else {
      console.log("Email sent " + info.response);
    }
  })
}

module.exports = sendMail;