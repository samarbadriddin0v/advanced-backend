const nodemailer = require('nodemailer')

class MailService {
	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: false,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD,
			},
		})
	}

	async sendActivationMail(email, activationLink) {
		await this.transporter.sendMail({
			from: process.env.SMTP_USER,
			to: email,
			subject: `Activation account link ${activationLink}`,
			html: `
				<div>
					<a href="${activationLink}">Click to activate account</a>
				</div>
			`,
		})
	}

	async sendForgotPasswordMail(email, activationLink) {
		await this.transporter.sendMail({
			from: process.env.SMTP_USER,
			to: email,
			subject: `Forgot password.`,
			html: `
				<div>
					<h1>Time to hacking. If you want to recover your account just click the link below.</h1>
					<a href="${activationLink}">Link to recovery account</a>

					<b>This link will work during 15 minutes</b>
				</div>
			`,
		})
	}
}

module.exports = new MailService()
