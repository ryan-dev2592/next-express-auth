import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface IEmailVerificationToken extends mongoose.Document {
  owner: mongoose.Schema.Types.ObjectId;
  token: string;
  expiresAt: Date;
  compareToken: (token: string) => Promise<boolean>;
}

const emailVerificationTokenSchema =
  new mongoose.Schema<IEmailVerificationToken>(
    {
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
      expiresAt: {
        type: Date,
        required: true,
        default: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      },
    },
    {
      timestamps: true,
    }
  );

// Encrypt the token before saving it to the database
emailVerificationTokenSchema.pre<IEmailVerificationToken>(
  "save",
  async function (next) {
    let token = this;

    if (token.isModified("token")) {
      token.token = await bcrypt.hash(token.token, 10);
    }

    next();
  }
);

// Compare the token with the one stored in the database
emailVerificationTokenSchema.methods.compareToken = async function (
  token: string
) {
  return await bcrypt.compare(token, this.token).catch(() => false);
};

const EmailVerificationTokenModel = mongoose.model<IEmailVerificationToken>(
  "EmailVerificationToken",
  emailVerificationTokenSchema
);

export default EmailVerificationTokenModel;
