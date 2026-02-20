import User from "../../models/User";
import bcrypt from "bcrypt";
import { JwtPayload, LoginResponse } from "./auth.interface";
import jwt from "jsonwebtoken";

type LoginInput = {
  email: string;
  password: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET no config");
  }
  return secret;
}

function signToken(payload: JwtPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "15m" });
}

export async function login({ email, password }: LoginInput) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const payload: JwtPayload = {
    userId: user._id.toString(),
    email: user.email ?? null,
  };

  const token = signToken(payload);

  const response: LoginResponse = {
    token,
    user: {
      id: payload.userId,
      email: user.email,
      name: user.name,
    },
  };

  return response;
}

export async function register({
  name,
  email,
  last_name,
  password,
}: {
  name: string;
  email: string;
  last_name: string;
  password: string;
}) {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    last_name,
    password: password,
  });
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    last_name: user.last_name,
  };
}
