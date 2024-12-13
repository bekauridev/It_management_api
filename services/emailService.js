const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2) Define the email options
  const mailOptions = {
    from: "Name <Gmail>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html
  };
  // 3) Send the mail
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;

// Function to send an email
// const sendEmail = async (options) => {
//   const msg = {
//     to: options.email, // Recipient's email address
//     from: "mgproject888@gmail.com", // Your verified sender email address
//     subject: options.subject,
//     text: options.message, // Plain text body
//     html: options.html || "", // HTML body (optional)
//   };
// };

module.exports = sendEmail;
