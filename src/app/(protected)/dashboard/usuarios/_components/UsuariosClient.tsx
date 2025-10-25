"use client";
import UsersTable from "../../_components/UsersTable";

type User = {
  id: string;
  name?: string;
  email: string;
  role: "admin" | "analyst" | "viewer";
};

export default function UsuariosClient({
  users,
  canEdit,
}: {
  users: User[];
  canEdit: boolean;
}) {
  return <UsersTable users={users} canEdit={canEdit} />;
}
