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