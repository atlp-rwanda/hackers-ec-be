import nodemailer from "nodemailer";
export interface emailAttribute {
	user: string;
	subject: string;
	message: string;
}
const sendEmail = async (emailData: emailAttribute) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.HOST,
			service: process.env.SERVICE,
			port: 587,
			secure: true,
			auth: {
				user: process.env.EMAIL,
				pass: process.env.PASSWORD,
			},
		});

		await transporter.sendMail({
			from: process.env.EMAIL,
			to: emailData.user,
			subject: emailData.subject,
			text: emailData.message,
		});
		console.log("email sent sucessfully");
	} catch (error) {
		console.log("email not sent");
		console.log(error);
	}
};

export default sendEmail;
