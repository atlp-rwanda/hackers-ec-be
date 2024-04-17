import bcrypt from "bcrypt";

// password check when logging in a user
export const isValidPassword = (
  password: string,
  currPass: string
): boolean => {
  const isValid = bcrypt.compareSync(password, currPass);

  return isValid;
};
