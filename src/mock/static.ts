export const login_user = {
	email: "peter234565@gmail.com",
	password: "Password@123",
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
	password: "Password@123",
	confirmPassword: "Password@123",
};

export const exist_user = {
	userName: "Tp",
	firstName: "travis",
	lastName: "paul",
	email: "travis@gmail.com",
	password: "Password@123",
	confirmPassword: "Password@123",
	role: "BUYER",
};
export const user_bad_request = {
	firstName: "unknow",
	lastName: "paul",
	email: "unknown@gmail.com",
	password: "Password@123",
	confirmPassword: "Password@123",
	age: 12,
};

export const User_without_email = {
	firstName: "peter",
	lastName: "paul",
	password: "Password@123",
	confirmPassword: "Password@123",
};
