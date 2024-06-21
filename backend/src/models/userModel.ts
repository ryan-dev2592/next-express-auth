import mongoose from "mongoose";
import bcrypt from "bcrypt";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface IUser {
  email: string;
  password: string;
  isEmailVerified: boolean;
  isAccountActive: boolean;
  refreshTokens: string[];

  // Optional fields
  provider?: string;
  googleId?: string;
  firstName?: string;
  lastName?: string;
}

export interface IUserDocument extends IUser, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },

    isAccountActive: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    provider: { type: String },
    googleId: { type: String },

    refreshTokens: [{ type: String, default: [] }],
  },
  {
    collection: "users",
    timestamps: true,
  }
);

// Hash the password before saving the user
UserSchema.pre<IUserDocument>("save", async function (next) {
  let user = this;

  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
  }
  next();
});

// Compare the password of the user
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  let user = this;
  return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

// Only send the necessary fields to the client
UserSchema.methods.toJSON = function () {
  let user = this.toObject();
  user.id = user._id;
  delete user._id;
  delete user.__v;
  delete user.password;
  delete user.refreshTokens;
  return user;
};

const User = mongoose.model<IUserDocument>("User", UserSchema);

export default User;
