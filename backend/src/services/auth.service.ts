import UserModel, { IUserDocument } from "@/models/userModel";

// Find by Id

// Find User by Email

// Find by Refresh Token

// Verify Email

// Check User Credentials

export const checkUserCredentials = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return null;
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return null;
  }

  return user as IUserDocument;
};
