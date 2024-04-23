import nodemailer from "nodemailer";
import { EMAIL, PASSWORD, SENDER_NAME } from "../utils/keys";

interface MailOptions {
	to: string;
	subject: string;
	html: any;
}

const sender = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: EMAIL,
		pass: PASSWORD,
	},
	tls: {
		rejectUnauthorized: false,
	},
});

// SEND EMAIL FUNCTION
export function sendEmail({ to, subject, html }: MailOptions) {
	const mailOptions = {
		from: `"${SENDER_NAME}" <${EMAIL}>`,
		to,
		subject,
		html,
	};

	sender.sendMail(mailOptions, (error) => {
		if (error) {
			console.log("EMAILING USER FAILED:", error);
		}
	});
}
