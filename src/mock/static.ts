export const login_user = {
	email: "peter234565@gmail.com",
	password: "passwordQWE123",
};

export const login_user_wrong_credentials = {
	email: "john@example.com",
	password: "<PASSWORD>",
};

export const login_user_invalid_email = {
	email: "peter",
	password: "<Password@345>",
};

export const NewUser = {
	firstName: "peter",
	lastName: "paul",
	email: "peter234565@gmail.com",
	password: "passwordQWE123",
	confirmPassword: "passwordQWE123",
	role: "SELLER",
	isVerified: true,
};

export const exist_user = {
	userName: "Tp",
	firstName: "travis",
	lastName: "paul",
	email: "travis@gmail.com",
	password: "passwordQWE123",
	confirmPassword: "passwordQWE123",
};
export const user_bad_request = {
	firstName: "unknow",
	lastName: "paul",
	email: "unknown@gmail.com",
	password: "passwordQWE123",
	confirmPassword: "passwordQWE123",
	age: 12,
};

export const User_without_email = {
	firstName: "peter",
	lastName: "paul",
	password: "passwordQWE123",
	confirmPassword: "passwordQWE123",
};

export const two_factor_authentication_data = {
	otp: "204207",
};

export const bad_two_factor_authentication_data = {
	otp: "204208",
};

export const partial_two_factor_authentication_data = {
	otp: "20420",
};
