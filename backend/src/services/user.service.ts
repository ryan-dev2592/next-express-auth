import User, { IUserDocument } from "@/models/userModel";

// Check User Credentials
export const checkUserCredentials = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    return null;
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return null;
  }

  return user as IUserDocument;
};
