import crypto from "crypto";

const generateVerificationToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

export default generateVerificationToken;
