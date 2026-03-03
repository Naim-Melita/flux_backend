export type UserType = {
  id: string;
  name: string;
  last_name: string;
  email: string;
  password: string;
};

export type JwtPayload = {
  id: string;
  email: string | null;
  name: string | null;
  last_name: string | null; 
};

export type LoginResponse = {
  user: {
    id: string;
    email: string;
    name: string;
    last_name: string;
    token: string;
  };
};
