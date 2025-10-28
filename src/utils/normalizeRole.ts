export function normalizeRole(role: string) {
  switch (role) {
    case "admin":
      return "Administrador";
    case "analyst":
      return "Analista";
    case "viewer":
        return "Visualizador"
    default:
        return ""
  }
}
