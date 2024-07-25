import Joi from "joi";

const querryValidation = Joi.object({
	firstName: Joi.string()
		.required()
		.messages({ "string.empty": "First Name field can't be empty!" }),
	lastName: Joi.string()
		.required()
		.messages({ "string.empty": "Last Name field can't be empty!" }),
	subject: Joi.string()
		.required()
		.messages({ "string.empty": "Subject field can't be empty!" }),
	email: Joi.string().required().email().messages({
		"string.empty": "Email field can't be empty!",
		"string.email": "Invalid email!",
	}),
	message: Joi.string()
		.max(5000)
		.required()
		.messages({ "string.empty": "Message field can't be empty!" }),
}).options({ allowUnknown: false });

const validateQuerry = (body: any) => {
	const { error } = querryValidation.validate(body);
	return error;
};

export default validateQuerry;
