import { Course } from "./course";

export interface Attachment {
  id?: string;
  url: string;
  originalName: string;
  course?: Course;
  createdAt?: Date;
  updatedAt?: Date;
}