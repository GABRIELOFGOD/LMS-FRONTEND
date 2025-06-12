export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  fname: string;
  lname: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}