const { Router } = require('express');
const router = Router();
const nodemailer = require('nodemailer');

router.post('/', (req, res) => {
    const { email, subject, text } = req.body;
    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        post: 465,
        secure: true,
        auth: {
            user: "kurosaki.math@gmail.com",
            pass: "pass"
        }
    })
    var mailOptions = {
        from: "yumPaw",
        to: email,
        subject: subject,
        text: text
    }
    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            res.status(402).send(error.message);
        } else {
            res.status(200).send('Correo enviado con éxito');
        }
    })
});

module.exports = router;