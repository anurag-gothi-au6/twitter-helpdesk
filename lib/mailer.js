const nodemailer = require("nodemailer");

// Mailer is used to Send the Email for the user
let transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD
    }
})
transport.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Mailer Ready');
    }
})




const sendMailToUser = async (name, email, password,enterpriseName) => {
    let html = null;
    html = `
        <h1>Welcome to Twitter Helpdesk</h1>

        <p> We have attached below Your credentials to join ${enterpriseName}'s helpdesk team.</p>
        <br><br>
        <h3>Email:${email}</h3>
        <h3>Password:${password}</h3>
        <br>
        <br>
        <p>Thanks & Regard</p>
        <p>Anurag Gothi</p>
        `;


    try {
        await transport.sendMail({
            from: process.env.GMAIL_EMAIL,
            to: email,
            subject:`Credentials for ${enterpriseName}'s Twitter Helpdesk`,
            html
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = sendMailToUser