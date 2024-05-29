import Joi from "joi";

const productStatus_validation = Joi.object({
	productStatus: Joi.string()
		.valid("Available", "Unavailable")
		.required()
		.messages({
			"string.empty": "Product status field can't be empty!",
			"any.only":
				"Product status field must be either 'Available' or 'Unavailable'!",
		}),
}).options({ allowUnknown: false });

const validateProductStatus = (body: any) => {
	const { error } = productStatus_validation.validate(body);
	return error;
};

export default validateProductStatus;
