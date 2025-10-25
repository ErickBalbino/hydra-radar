export type UserRole = "admin" | "analyst" | "viewer";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
};
