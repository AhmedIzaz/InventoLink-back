import bcrypt from "bcrypt";
export const hashPassword = async (
  password: string
): Promise<{ hashedPassword: string }> => {
  const salt = await bcrypt.genSalt(
    process.env.PASSWORD_SALT ? +process.env.PASSWORD_SALT : 11
  );
  const hashedPassword = await bcrypt.hash(password, salt);
  return { hashedPassword };
};
