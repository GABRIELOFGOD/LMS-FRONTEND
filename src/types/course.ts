// import { Attachment } from "./attachment";
// import { Category, Chapter } from "./category";

// export interface Course {
//   id: number;
//   title: string;
//   description: string;
//   imageUrl: string;
//   // categoryId: string;
//   category: Category;
//   price?: number;
//   isFree: boolean;
//   published: boolean;
//   chapters?: Chapter[];
//   createdAt: Date;
//   attachments?: Attachment[];
//   updatedAt: Date;


// }

export interface Instructor {
  name: string;
  role: string;
  description: string;
  image?: string;
}

export interface Module {
  title: string;
  description: string;
}

export interface CourseOut {
  id: string;
  title: string;
  description: string;
  overview: string;
  syllabus: Module[];
  instructor: Instructor;
  image?: string;
}

export interface Chapter {
  id: string;
  isPublished: boolean;
  name: string;
  video: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddChapterResponse {
  message: string;
  chapter: Chapter;
}

export interface RestoreCourseResponse {
  message: string;
  course?: Course;
}

export interface Course {
  id: string;
  publish: boolean;
  title: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  isFree?: boolean;
  isDeleted?: boolean; // Add support for soft delete status
  createdAt: string;
  updatedAt: string;
  chapters: Chapter[];
}

export interface EnrolledCourseTypes {
  course: {
    id: string;
    title: string;
    description: string;
    price: string;
    imageUrl: string;
    isFree: boolean;
    publish: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  },
  comppletedChapters: {
    chapter: {
      id: string;
    }
  }[];
}
