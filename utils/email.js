const nodemailer = require('nodemailer');

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Función para enviar correo electrónico de notificación
function sendNotificationEmail(name, email, country, ip) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email, // Use the email provided in the form as the recipient's email
        subject: 'Nuevo usuario registrado',
        html: `
            <h2>Información del nuevo usuario registrado:</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>País:</strong> ${country}</p>
            <p><strong>Ip:</strong> ${ip}</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo electrónico:', error);
        } else {
            console.log('Correo electrónico enviado:', info.response);
        }
    });
}

module.exports = sendNotificationEmail;


