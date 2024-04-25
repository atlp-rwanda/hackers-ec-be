import sgMail from "@sendgrid/mail";
import { EMAIL, SENDER_NAME, SENDGRID_API_KEY } from "../utils/keys";
interface MailOptions {
	to: string;
	subject: string;
	html: any;
}
sgMail.setApiKey(`${SENDGRID_API_KEY}`);
// SEND EMAIL FUNCTION
export function senderEmail({ to, subject, html }: MailOptions) {
	const mailOptions = {
		from: `"${SENDER_NAME}" <${EMAIL}>`,
		to,
		subject,
		html,
	};
	sgMail
		.send(mailOptions)
		.then(() => {
			console.log("Email sent");
		})
		.catch((error) => {
			console.error(error);
		});
}
