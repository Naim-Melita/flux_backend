export type UserType = {
  _id: string;
  name: string;
  last_name: string;
  email: string;
  password: string;
};

export type JwtPayload = {
  userId: string;
  email: string | null;
};

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
};
