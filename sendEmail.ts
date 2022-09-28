import nodemailer from 'nodemailer';
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
      service: "gmail",
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,

      auth: {
        type: 'login',
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
      }
    });

export default function sendEmail(firstname: string,
  surname: string,
  email: string,
  mailingList: boolean,
  numberOfPeople: number,
  date: string,
  time: string): void {
      
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Your booking at Tasty Restaurant',
        text: `Hi ${firstname} ${surname}!\n\nThank you for making a booking at Tasty Restaurant! Your booking details are:\n\nDate: ${date}\nTime: ${time}\nNumber of people: ${numberOfPeople}\n\nWe're looking forward to seeing you!\n\nThis message was sent automatically.\n\n-------------------------------\n\nThanks for checking out my restaurant booking system! If you'd like to check out other projects I've made, visit \nmy portfolio: https://rosemelissa-portfolio.netlify.app/\nor my GitHub: https://github.com/rosemelissa\nIf you checked 'sign up for mailing list' there are no mailing list emails, but if you'd like me to remove your email address anyway you can reach out to me at any time at tasty.restaurant.rosemelissa@gmail.com`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}









// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.GMAIL_USER,
//       pass: process.env.GMAIL_PASSWORD
//     }
//   });

// export default function sendEmail(toEmailAddress: string): void {
    
    
//     const mailOptions = {
//         from: process.env.GMAIL_USER,
//         to: toEmailAddress,
//         subject: 'Sending Email using Node.js',
//         text: 'That was easy!'
//     };

//     transporter.sendMail(mailOptions, function(error, info){
//         if (error) {
//           console.log(error);
//         } else {
//           console.log('Email sent: ' + info.response);
//         }
//       });
// }

// const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
// export default async function main() {
//   // Generate test SMTP service account from ethereal.email
//   // Only needed if you don't have a real mail account for testing
//   let testAccount = await nodemailer.createTestAccount();

//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: testAccount.user, // generated ethereal user
//       pass: testAccount.pass, // generated ethereal password
//     },
//   });

//   // send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: '"Fred Foo 👻" <tasty.restaurant.rosemelissa@gmail.com>', // sender address
//     to: "melissasignup@gmail.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }

// main().catch(console.error);