import UserModel, { IUserDocument } from "@/models/userModel";

// Find User By Id
export const findUserById = async (id: string) => {
  const user = await UserModel.findById(id);

  if (!user) {
    return null;
  }

  return user;
};

// Find User By Email
export const findUserByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email: email.toLowerCase() });

  if (!user) {
    return null;
  }

  return user;
};

// Find User By Refresh Token
export const findUserByRefreshToken = async (refreshToken: string) => {
  console.log("Refresh Token", refreshToken);

  const user = await UserModel.findOne({ refreshTokens: refreshToken });

  console.log("User Found: ", user);

  if (!user) {
    return null;
  }

  return user;
};

// Create New User
export const createNewUser = async (user: Partial<IUserDocument>) => {
  const { email, password, firstName, lastName } = user;

  console.log("User: ", user);

  const newUser = await UserModel.create({
    email: email!.toLowerCase(),
    password,
    firstName,
    lastName,
  });

  if (!newUser) {
    return null;
  }

  return newUser;
};
