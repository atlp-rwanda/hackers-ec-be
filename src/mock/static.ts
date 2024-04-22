export const register_user = {
  userName: "hohndoe",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "<Password@345>",
  confirmPassword: "<Password@345>",
};

export const login_user = {
  email: "john@example.com",
  password: "<Password@345>",
};

export const login_user_wrong_credentials = {
  email: "john@example.com",
  password: "<PASSWORD>",
};

export const login_user_invalid_email = {
  email: "peter",
  password: "<Password@345>",
};
