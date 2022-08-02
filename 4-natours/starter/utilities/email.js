const nodemailer = require('nodemailer');
// const catchAsync = require('./../utilities/catchAsync');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '47055ff3e39b4a',
      pass: 'eca4fc822e7559',
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Daniel Kuznetsov <kuznetsov.dg495@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
