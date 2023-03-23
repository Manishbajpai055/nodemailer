const express = require('express')
const app = express()
require('dotenv').config();

const _ = require('lodash');
const nodemailer = require('nodemailer')
const router = express.Router();

var path = require('path');
var cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors({ credentials: true, Origin: '*' }));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});
app.use('/', router)


app.listen(process.env.PORT || 5501)



const SendMails = async (req, res) => {


  console.log("🚀 ~ file: index.js:9 ~ SendMails ~ emails, Subject, body:", req.body)
  // return
  let { emails, Subject, body } = req.body
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    },
  });

  if (_.isArray(emails)) {
    emails.forEach((email, i) => {
      var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: Subject,
        text: body
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      if (i === emails.length - 1) {
        transporter.close();
      }
    });
  } else {
    var mailOptions = {
      from: 'gyandas12998@gmail.com',
      to: emails,
      subject: Subject,
      html: body
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send({ "message": info.response })
      }
    });
  }
};


exports.validateEmail = (email) => {
  return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};


module.exports = SendMails

router.post('/mailto', SendMails)
