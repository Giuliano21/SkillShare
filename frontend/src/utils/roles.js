export const normalizeRoles = (user) =>
  Array.isArray(user?.role) ? user.role : [user?.role];
