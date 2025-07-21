import { BASEURL } from "@/lib/utils";
import { isError } from "@/services/helper";
import { AddChapterResponse } from "@/types/course";
import { toast } from "sonner";

export const useCourse = () => {

  // const token = localStorage.getItem("token");

  const getAvailableCourses = async () => {
    try {
      const response = await fetch(`${BASEURL}/courses/published`);
      const res = await response.json();
      if (!response.ok) throw new Error(res.message);
      return res;
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
        console.error("Login failed", error.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  }
  
  const getCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token!");
      const response = await fetch(`${BASEURL}/courses`, {
        headers: {
          "authorization": `Bearer ${token}`
        }
      });
      return await response.json();
    } catch (error) {
      toast.error("Error fetching courses");
      console.error(error);
    }
  };

  const getACourse = async (id: string) => {
    try {
      const req = await fetch(`${BASEURL}/courses/${id}`);
      const theCourse = await req.json();
      return theCourse;
    } catch (error) {
      toast.error("Error occur while getting this course data");
      console.error(error);
    }
  }

  const createCourse = async ({
    title,
    description
  }: {
    title: string;
    description?: string;
  }) => {
    const token = localStorage.getItem("token");
    
    try {
      const request = await fetch(`${BASEURL}/courses`, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description
        })
      });

      const response = await request.json();

      console.log("[RESPONSE]: ", response);
    } catch (error) {
      throw error;
    }
  }

  const updateCourseTitle = async (id: string, title: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");
      const req = await fetch(`${BASEURL}/courses/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title: title })
      });

      return await req.json();
      
    } catch (error) {
      throw error;
    }
  }

  const updateCourseDescription = async (id: string, description: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");
      const req = await fetch(`${BASEURL}/courses/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ description })
      });

      return await req.json();
      
    } catch (error) {
      throw error;
    }
  }

  const publishCourse = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");
      const req = await fetch(`${BASEURL}/courses/${id}/published`, {
        method: "PUT",
        headers: {
          "authorization": `Bearer ${token}`
        }
      });

      const res = await req.json();
      if (!req.ok) throw new Error(res.message);
      return res;

    } catch (error) {
      throw error;
    }
  }

  const updateCourseImage = async ({ id, value }: {
      id: string;
      value: File;
    }) => {
  
      const formData = new FormData();
      formData.append('file', value);

      console.log("[DATA]: ", formData);
  
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");
      
      try {
        const response = await fetch(`${BASEURL}/courses/upload/${id}`, {
          method: "PUT",
          headers: {
            'authorization': `Bearer ${token}`
          },
          body: formData
        });
        const res = await response.json()
        console.log("[RESPONSE]: ",res);
        return res;
      } catch (error) {
        throw error;
      }
    }

    const addChapter = async (
      courseId: string,
      { name, video }: { name: string; video?: File | null }
    ): Promise<AddChapterResponse> => {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", name);
      formData.append("courseId", courseId);
      
      if (video) {
        formData.append("video", video);
      }
      
      try {
        const req = await fetch(`${BASEURL}/chapters`, {
          method: "POST",
          headers: {
            "authorization": `Bearer ${token}`
          },
          body: formData,
        });

        const res = await req.json();
        if (!req.ok) throw new Error(res.message);
        return res as AddChapterResponse;
      } catch (error) {
        throw error;
      }
    };

    const updateChapter = async (
      chapterId: string,
      { name, video }: { name: string; video?: File | null }
    ): Promise<AddChapterResponse> => {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", name);
      
      // Only append video if it exists and is a File
      if (video instanceof File) {
        formData.append("video", video);
      }
      
      try {
        const req = await fetch(`${BASEURL}/chapters/${chapterId}`, {
          method: "PATCH",
          headers: {
            "authorization": `Bearer ${token}`
          },
          body: formData,
        });

        const res = await req.json();
        if (!req.ok) throw new Error(res.message);
        return res as AddChapterResponse;
      } catch (error) {
        throw error;
      }
    };

    const uploadVideo = async (
      chapterId: string,
      video: File
    ): Promise<AddChapterResponse> => {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("video", video);
      
      try {
        const req = await fetch(`${BASEURL}/chapters/${chapterId}/video`, {
          method: "PUT",
          headers: {
            "authorization": `Bearer ${token}`
          },
          body: formData,
        });

        const res = await req.json();
        if (!req.ok) throw new Error(res.message);
        return res as AddChapterResponse;
      } catch (error) {
        throw error;
      }
    };

    const deleteChapter = async (chapterId: string): Promise<{ message: string }> => {
      const token = localStorage.getItem("token");
      
      try {
        const req = await fetch(`${BASEURL}/chapters/${chapterId}`, {
          method: "DELETE",
          headers: {
            "authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        const res = await req.json();
        if (!req.ok) throw new Error(res.message);
        return res;
      } catch (error) {
        throw error;
      }
    };

    const publishChapter = async (chapterId: string): Promise<AddChapterResponse> => {
      const token = localStorage.getItem("token");
      
      try {
        const req = await fetch(`${BASEURL}/chapters/${chapterId}/publish`, {
          method: "PATCH",
          headers: {
            "authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        const res = await req.json();
        if (!req.ok) throw new Error(res.message);
        return res as AddChapterResponse;
      } catch (error) {
        throw error;
      }
    };

    const unpublishChapter = async (chapterId: string): Promise<AddChapterResponse> => {
      const token = localStorage.getItem("token");
      
      try {
        const req = await fetch(`${BASEURL}/chapters/${chapterId}/unpublish`, {
          method: "PATCH",
          headers: {
            "authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        const res = await req.json();
        if (!req.ok) throw new Error(res.message);
        return res as AddChapterResponse;
      } catch (error) {
        throw error;
      }
    };

  const reorderChapters = async (
    courseId: string, 
    chapterIds: string[]
  ): Promise<{ message: string }> => {
    const token = localStorage.getItem("token");
    
    try {
      const req = await fetch(`${BASEURL}/chapters/course/${courseId}/reorder`, {
        method: "PUT",
        headers: {
          "authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ chapterIds }),
      });

      const res = await req.json();
      if (!req.ok) throw new Error(res.message);
      return res;
    } catch (error) {
      throw error;
    }
  };

  // const enrollCourse = async (id: string) => {
  //   trycat
  // }
  
  return {
    getCourses,
    getACourse,
    createCourse,
    getAvailableCourses,

    updateCourseTitle,
    updateCourseDescription,
    updateCourseImage,

    addChapter,
    updateChapter, 
    deleteChapter, 
    publishChapter, 
    unpublishChapter,
    reorderChapters,
    uploadVideo,
    publishCourse
  }
}
