import cron from "node-cron";
import { checkPasswordExpiration } from "../utils/passwordExpiration";

export const startCheckPasswordExpiration = async (clone_time: string) => {
	cron.schedule(clone_time, async () => {
		try {
			await checkPasswordExpiration();
			console.log(`Check password update at: ${new Date()}`);
		} catch (error) {
			throw new Error(
				`Error checking for password expiration: ${(error as Error).message}`,
			);
		}
	});
};
