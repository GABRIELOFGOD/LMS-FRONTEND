import { Course } from "./course";

export interface Category {
  id: string;
  name: string;
  courses?: Course[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Video {}

export interface Chapter {
  id?: string;
  name: string;
  isPublished: boolean;
  course: Course;
  videos: Video[];
  createdAt?: Date;
  updatedAt?: Date;
}