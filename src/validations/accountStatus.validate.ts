import Joi from "joi";

const accountStatusValidator = Joi.object({
	isAccountActive: Joi.string()
		.required()
		.pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"))
		.messages({
			"string.empty": "Password field can't be empty",
			"string.pattern.base":
				"Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number",
		})
		.required(),
        reason: Joi.string()
		.required()
		.pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"))
		.messages({
			"any.only": "new Password required",
			"string.empty": "Password field can't be empty",
			"string.pattern.base":
				"Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number",
		}),
}).options({ allowUnknown: false });

const accountStatusValidate = (body: any) => {
	const { error } = accountStatusValidator.validate(body);
	return error;
};

export default accountStatusValidate;
