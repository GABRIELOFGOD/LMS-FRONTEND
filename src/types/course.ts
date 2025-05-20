import { Attachment } from "./attachment";
import { Category, Chapter } from "./category";

export interface Course {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  // categoryId: string;
  category: Category;
  price?: number;
  isFree: boolean;
  published: boolean;
  chapters?: Chapter[];
  createdAt: Date;
  attachments?: Attachment[];
  updatedAt: Date;


}

// export interface Chapter {
//   id: number;
//   name: string;
//   videos: Video[];
//   course: Course;
//   createdAt: Date;
// }

// export interface Video {
//   id: number;
//   link: string;
//   chapter: Chapter;
//   createdAt: Date;
// }