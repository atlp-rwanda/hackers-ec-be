import { UserModelAttributes } from "../types/model";
import { DEPLOYED_URL, SERVER_URL } from "./keys";

export const root_home_page = `
<div style="
    width: 100%; 
    height: 100vh; 
    display: flex; 
    justify-content: center; 
    align-items: center;
    flex-direction: column; /* Move this property inside the style attribute */
">
  <h1>Hacker's E-commerce Back-end</h1> 
  <p>Want to test APIs? <span style="color: MediumSeaGreen;">Click on View swagger docs.</span></p>
  <br/>
  <a
    href="/api/v1/docs"
    style="
      background-color: MediumSeaGreen;
      color: white;
      padding: 6px 20px;
      border: none;
      border-radius: 5px;
      text-decoration: none;
    "
  >
    View swagger docs
  </a>
</div>
`;

export const update_pass_email_template = (user: UserModelAttributes) => {
	return `
  <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #f4f4f4;">
      <h2 style="color: #333;">Your Password Has Expired</h2>
      <p>Dear ${user.firstName} ${user.lastName},</p>
      <p>We hope this email finds you well.</p>
      <p>We wanted to inform you that your password for Hacker's E-commerce has expired. This is just a friendly reminder to update your password to ensure the security of your account.</p>
      <p>Please follow these steps to update your password:</p>
      <ol>
          <li>Click on the <a href="${DEPLOYED_URL ? DEPLOYED_URL : SERVER_URL}/api/v1/users/password-update">Update password</a> link.</li>
          <li>Follow the instructions to set up a new password.</li>
      </ol>
      <p>If you have any questions or need further assistance, please don't hesitate to contact our support team.</p>
      <p>Thank you for your attention to this matter.</p>
      <p>Best regards</p>
  </div>
  `;
};

export const update_product_email_template = (
	user: UserModelAttributes,
	productName: string,
) => {
	return `
  <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #f4f4f4;">
      <h2 style="color: #333;">Your Product Has Expired</h2>
      <p>Dear ${user.firstName} ${user.lastName},</p>
      <p>We hope this email finds you well.</p>
      <p>We wanted to inform you that your product called ${productName} on Hacker's E-commerce has expired. This is just a friendly reminder to remove product on platform</p>
      
      <p>Thank you for your attention to this matter.</p>
      <p>Best regards</p>
  </div>
  `;
};
