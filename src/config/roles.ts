export const STUDENT = "student";
export const TEACHER = "teacher";
export const ADMIN = "admin";

export const rolesAllowed = [STUDENT, TEACHER, ADMIN] as const;
export const rightsAllowed = ["create", "read", "update", "delete"] as const;
