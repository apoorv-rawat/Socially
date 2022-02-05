const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');



// config for who will send the mail 
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'Enter sender email',
        pass: 'Enter password'
    }
});

let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function (err, template) {
            if(err) {console.log('Error in rendering template', err); return}

            mailHTML = template;
        }

    )

    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}