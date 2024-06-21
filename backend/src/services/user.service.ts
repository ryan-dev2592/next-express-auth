import User, { IUserDocument } from "@/models/userModel";

// Find User By Id
export const findUserById = async (id: string) => {
  const user = await User.findById(id);

  if (!user) {
    return null;
  }

  return user;
};

// Find User By Email

// Find User By Refresh Token
export const findUserByRefreshToken = async (refreshToken: string) => {
  console.log("Refresh Token", refreshToken);

  const user = await User.findOne({ refreshTokens: refreshToken });

  console.log("User Found: ", user);

  if (!user) {
    return null;
  }

  return user;
};
