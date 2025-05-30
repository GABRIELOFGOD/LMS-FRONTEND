import { Course } from "./course";

export interface Attachment {
  id?: string;
  url: string;
  originalName: string;
  course?: Course;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Badge {
  id?: string;
  name: string;
  description: string;
  image: string;
}

export interface Certification {
  id?: string;
  name: string;
  description: string;
  image: string;
}

