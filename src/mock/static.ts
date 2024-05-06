import path from "path";

export const image_one_path: string = path.resolve(
	__dirname,
	"images/BMW1.jpeg",
);
export const image_two_path: string = path.resolve(
	__dirname,
	"images/BMW2.jpeg",
);
export const image_three_path: string = path.resolve(
	__dirname,
	"images/BMW3.webp",
);
export const image_four_path: string = path.resolve(
	__dirname,
	"images/BMW4.webp",
);

export const login_user = {
	email: "peter23456545@gmail.com",
	password: "passwordQWE123",
};
export const login_user_br = {
	email: "peter234565@gmail.com",
	passworr: "passwordQWE123",
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
	email: "peter23456545@gmail.com",
	password: "passwordQWE123",
	confirmPassword: "passwordQWE123",
};

export const new_buyer_user = {
	firstName: "mark",
	lastName: "mark",
	email: "mark234565@gmail.com",
	password: "passwordQWE123",
	confirmPassword: "passwordQWE123",
};
export const new_seller_user = {
	userName: "peter",
	firstName: "peter",
	lastName: "paul",
	email: "peter234565@gmail.com",
	password: "passwordQWE123",
	confirmPassword: "passwordQWE123",
};

export const exist_user = {
	userName: "Tp",
	firstName: "travis",
	lastName: "paul",
	email: "travis@gmail.com",
	password: "passwordQWE123",
	confirmPassword: "passwordQWE123",
	role: "85013dc0-a77a-4a38-9a38-9ef493c87d9d",
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
export const google_profile = {
	email: "karimu@gmail.com",
	password: "karimu@gmail.com",
};
export const sameAsOldPassword = {
	password: "passwordQWE123",
};
export const requestResetBody = {
	email: "peter234565@gmail.com",
};
export const NotUserrequestBody = {
	email: "peter2345@gmail.com",
	forTesting: true,
};

export const newPasswordBody = {
	password: "New@password",
};

export const roleAdmin = {
	roleName: "ADMIN",
};

export const mockRole = {
	roleName: "UserRole",
};
export const mockRoleBuyer = {
	roleName: "BUYER",
};
export const token =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZjMjUyYWY3LWJhYjYtNGY4MC05YzQ5LTIzZTQ0MWRmMDJjYiIsInJvbGUiOiJTRUxMRVIiLCJpYXQiOjE3MTM5Njg5MDgsImV4cCI6MTc0NTUyNjUwOH0.22hDHx9vHSPw_fQ_yfr-29mUme1LpqFQG-ZIsFjhlH4";

export const new_product = {
	name: "BMW",
	price: 49900,
	images: [image_one_path, image_two_path, image_three_path, image_four_path],
	discount: 100,
	quantity: 356,
	expiryDate: "2324-04-30T00:00:00.000Z",
};
export const new_update_product = {
	name: "Ferrari",
	price: 49900,
	discount: 100,
	quantity: 356,
	images: [image_one_path],
};

export const new_category = {
	name: "Cars",
	description: "Cars are amazing!",
};

export const new_updated_category = {
	name: "Fancy Cars",
	description: "This cars are highly amazing!",
};

export const update_pass = {
	oldPassword: "passwordQWE123",
	newPassword: "newPassword123",
	confirmPassword: "newPassword123",
};
