import Joi from "joi";

const update_profile_validation = Joi.object({
	firstName: Joi.string(),
	lastName: Joi.string(),
	gender: Joi.string().required().min(4),
	phoneNumber: Joi.string()
		.required()
		.pattern(/^\+\d{11,}$/)
		.messages({
			"string.pattern.base":
				'"phone number" must be a valid and has country code',
		}),
	birthDate: Joi.date().iso(),
	preferredLanguage: Joi.string().required().min(4),
	preferredCurrency: Joi.string().required().min(3),
	profileImage: Joi.string(),
	addressLine1: Joi.string().required().messages({
		"string.empty": "Address cannot be empty",
	}),
	addressLine2: Joi.string(),
	country: Joi.string().required().messages({
		"string.empty": "Country cannot be empty",
	}),
	city: Joi.string().required().messages({
		"string.empty": "City Image cannot be empty",
	}),
	zipCode: Joi.number().min(4),
}).options({ allowUnknown: false });

export const userProfileValidation = (profile: any) => {
	const { error } = update_profile_validation.validate(profile);
	return error;
};
