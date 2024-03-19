// Para configurar email
const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path')

const transporter = nodemailer.createTransport(
  {
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    secure: true
  }
)

const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve('backend/views/'),
    defaultLayout: false
  },
  viewPath: path.resolve('backend/views/')
}

transporter.use('compile', hbs(handlebarOptions))

const sendEmail = async (email, template, context) => {
  let subject = 'Notificación de Eagle Blade'
  if (template === 'verifyEmail') {
    subject = 'Verifica tu correo electrónico'
  }
  if (template === 'resetPassword') {
    subject = 'Restablece tu contraseña'
  }
  if (template === 'resetPasswordConfirmation') {
    subject = 'Contraseña restablecida exitosamente'
  }
  if (template === 'goodbye') {
    subject = '¡No es un adiós, sino un hasta pronto!'
  }
  context.siteLink = process.env.EMAIL_BASE_URL
  try {
    const mailOptions = {
      from: {
        name: process.env.EMAIL_USERNAME,
        address: process.env.EMAIL_USER
      },
      template,
      to: email,
      subject,
      context,
      attachments: [{
        filename: 'eagle-icon.png',
        path: path.resolve('backend/public/images/eagle-icon.png'),
        cid: 'eagle-blade-icon@nodemailer.com'
    }]
    }
    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

module.exports = sendEmail
