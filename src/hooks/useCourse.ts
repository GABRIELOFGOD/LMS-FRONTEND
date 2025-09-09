import { BASEURL } from "@/lib/utils";
import { isError } from "@/services/helper";
import { AddChapterResponse } from "@/types/course";
import { toast } from "sonner";

export const useCourse = () => {

  // const token = localStorage.getItem("token");

  const getAvailableCourses = async () => {
    try {
      console.log('getAvailableCourses - Fetching published courses...');
      const response = await fetch(`${BASEURL}/courses/published`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.status}`);
      }
      
      const res = await response.json();
      console.log('getAvailableCourses - Courses fetched successfully:', res);
      
      // Handle different response structures
      return res.value || res.data || res || [];
    } catch (error: unknown) {
      if (isError(error)) {
        console.error("Failed to fetch available courses", error.message);
        // Don't show toast for course loading errors as it's not critical
      } else {
        console.error("Unknown error fetching courses", error);
      }
      return [];
    }
  }
  
  const getCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No authentication token found for getCourses");
        return [];
      }
      const response = await fetch(`${BASEURL}/courses`, {
        headers: {
          "authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.status}`);
      }
      
      const res = await response.json();
      console.log('getCourses - Raw response:', res);
      
      // Handle different response structures consistently
      return res.value || res.data || res || [];
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
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
    description,
    price,
    isFree
  }: {
    title: string;
    description?: string;
    price?: number;
    isFree?: boolean;
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
          description,
          price: price || 0,
          isFree: isFree !== undefined ? isFree : true
        })
      });

      const response = await request.json();
      
      if (!request.ok) {
        throw new Error(response.message || 'Failed to create course');
      }

      console.log("[RESPONSE]: ", response);
      return response;
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

  const publishCourse = async (id: string, shouldPublish: boolean = true) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      
      console.log(`publishCourse - ${shouldPublish ? 'Publishing' : 'Unpublishing'} course with ID:`, id);
      console.log('publishCourse - Token exists:', !!token);
      console.log('publishCourse - BASEURL:', BASEURL);
      
      // Use the working PATCH endpoint since PUT /courses/published returns 500 error
      const req = await fetch(`${BASEURL}/courses/${id}/published`, {
        method: "PUT",
        headers: {
          "authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ publish: shouldPublish })
      });

      console.log('publishCourse - Response status:', req.status);
      console.log('publishCourse - Response headers:', Object.fromEntries(req.headers.entries()));
      
      if (!req.ok) {
        let errorMessage = `HTTP ${req.status}`;
        try {
          const errorRes = await req.json();
          console.log('publishCourse - Error response:', errorRes);
          errorMessage = errorRes.message || errorRes.error || errorMessage;
        } catch {
          errorMessage = req.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const res = await req.json();
      console.log('publishCourse - Success response:', res);
      
      return res;

    } catch (error) {
      console.error('publishCourse - Error:', error);
      throw error;
    }
  }

  const deleteCourse = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      
      console.log('deleteCourse - Deleting course with ID:', id);
      console.log('deleteCourse - Token exists:', !!token);
      console.log('deleteCourse - Full URL:', `${BASEURL}/courses/${id}`);
      
      // Try the primary delete endpoint
      let req = await fetch(`${BASEURL}/courses/${id}`, {
        method: "DELETE",
        headers: {
          "authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log('deleteCourse - Response status:', req.status);
      console.log('deleteCourse - Response headers:', Object.fromEntries(req.headers.entries()));
      
      // If 404 or 405, try alternative endpoints
      if (req.status === 404 || req.status === 405) {
        console.log('deleteCourse - Trying alternative endpoint: /courses/delete/{id}');
        req = await fetch(`${BASEURL}/courses/delete/${id}`, {
          method: "DELETE",
          headers: {
            "authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        console.log('deleteCourse - Alternative endpoint response status:', req.status);
      }
      
      // If still 405, try POST method (some APIs use POST for delete)
      if (req.status === 405) {
        console.log('deleteCourse - Trying POST method to /courses/{id}/delete');
        req = await fetch(`${BASEURL}/courses/${id}/delete`, {
          method: "POST",
          headers: {
            "authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        console.log('deleteCourse - POST method response status:', req.status);
      }
      
      if (!req.ok) {
        let errorMessage = `HTTP ${req.status}`;
        try {
          const errorRes = await req.json();
          console.log('deleteCourse - Error response:', errorRes);
          errorMessage = errorRes.message || errorRes.error || errorMessage;
        } catch {
          const textResponse = await req.text();
          console.log('deleteCourse - Text error response:', textResponse);
          errorMessage = textResponse || req.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      let res;
      try {
        res = await req.json();
        console.log('deleteCourse - Success response:', res);
      } catch {
        // Some APIs return empty response on successful delete
        res = { message: 'Course deleted successfully' };
        console.log('deleteCourse - Empty response, assuming success');
      }
      
      return res;

    } catch (error) {
      console.error('deleteCourse - Error:', error);
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
        // Determine file type and use appropriate field name
        const isVideo = video.type.startsWith('video/') || /\.(mp4|webm|ogg|mov|avi)$/i.test(video.name);
        const isPDF = video.type === 'application/pdf' || video.name.toLowerCase().endsWith('.pdf');
        
        if (isVideo) {
          formData.append("video", video);
        } else if (isPDF) {
          // Try multiple field names for PDF uploads
          formData.append("pdf", video);
          // Also add as video field as fallback for backends that expect 'video' field
          formData.append("video", video);
        } else {
          throw new Error("Unsupported file type. Please upload a video (MP4, MOV, AVI) or PDF file.");
        }
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
        if (!req.ok) {
          // Provide more helpful error messages
          let errorMessage = res.message || 'Failed to create chapter';
          if (video && errorMessage.toLowerCase().includes('video') && video.type === 'application/pdf') {
            errorMessage += ' (Note: If uploading PDF, ensure your backend supports PDF files in chapters)';
          }
          throw new Error(errorMessage);
        }
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
      
      // Only append media if it exists and is a File
      if (video instanceof File) {
        // Determine file type and use appropriate field name
        const isVideo = video.type.startsWith('video/') || /\.(mp4|webm|ogg|mov|avi)$/i.test(video.name);
        const isPDF = video.type === 'application/pdf' || video.name.toLowerCase().endsWith('.pdf');
        
        if (isVideo) {
          formData.append("video", video);
        } else if (isPDF) {
          // Try multiple field names for PDF uploads
          formData.append("pdf", video);
          // Also add as video field as fallback for backends that expect 'video' field
          formData.append("video", video);
        } else {
          throw new Error("Unsupported file type. Please upload a video (MP4, MOV, AVI) or PDF file.");
        }
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
        if (!req.ok) {
          // Provide more helpful error messages
          let errorMessage = res.message || 'Failed to update chapter';
          if (video && errorMessage.toLowerCase().includes('video') && video.type === 'application/pdf') {
            errorMessage += ' (Note: If uploading PDF, ensure your backend supports PDF files in chapters)';
          }
          throw new Error(errorMessage);
        }
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

    const uploadMedia = async (
      chapterId: string,
      file: File
    ): Promise<AddChapterResponse> => {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      
      // Determine if it's a video or PDF and use appropriate field name
      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|ogg|mov|avi)$/i.test(file.name);
      const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      
      if (isVideo) {
        formData.append("video", file);
      } else if (isPDF) {
        formData.append("pdf", file); // Use 'pdf' field for PDF files
      } else {
        throw new Error("Unsupported file type. Please upload a video (MP4, MOV, AVI) or PDF file.");
      }
      
      // Try the specific endpoint first, then fallback to generic media endpoint
      let endpoint = `${BASEURL}/chapters/${chapterId}/${isVideo ? 'video' : 'media'}`;
      
      try {
        let req = await fetch(endpoint, {
          method: "PUT",
          headers: {
            "authorization": `Bearer ${token}`
          },
          body: formData,
        });

        // If video endpoint fails for PDF, try the generic media endpoint
        if (!req.ok && isPDF && endpoint.includes('/video')) {
          console.log('Video endpoint failed for PDF, trying media endpoint...');
          endpoint = `${BASEURL}/chapters/${chapterId}/media`;
          req = await fetch(endpoint, {
            method: "PUT",
            headers: {
              "authorization": `Bearer ${token}`
            },
            body: formData,
          });
        }

        // If PUT fails, try POST method
        if (!req.ok && (req.status === 404 || req.status === 405)) {
          console.log('PUT method failed, trying POST method...');
          req = await fetch(endpoint, {
            method: "POST",
            headers: {
              "authorization": `Bearer ${token}`
            },
            body: formData,
          });
        }

        const res = await req.json();
        if (!req.ok) {
          // Provide more specific error messages
          if (res.message && res.message.includes('video')) {
            throw new Error(`Upload failed: ${res.message}. Note: If uploading PDF, ensure your backend supports PDF uploads at the media endpoint.`);
          }
          throw new Error(res.message || `Failed to upload ${isVideo ? 'video' : 'PDF'}`);
        }
        return res as AddChapterResponse;
      } catch (error) {
        console.error('Media upload error:', error);
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

  const enrollCourse = async (courseId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in to enroll in courses");
      }
      
      console.log('Enrolling in course:', courseId, 'with token present:', !!token);
      
      // Try the courses/{id}/enroll endpoint first
      let response = await fetch(`${BASEURL}/courses/${courseId}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        }
      });

      // If that fails, try the original pattern
      if (!response.ok && response.status === 404) {
        console.log('Trying alternative enrollment endpoint...');
        response = await fetch(`${BASEURL}/courses/enroll/${courseId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`
          }
        });
      }

      const res = await response.json();
      console.log('Enrollment response:', { 
        status: response.status, 
        ok: response.ok, 
        response: res,
        endpoint: response.url
      });
      
      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          throw new Error("Your session has expired. Please log in again.");
        } else if (response.status === 409) {
          // User is already enrolled
          toast.info("You are already enrolled in this course!");
          return res; // Don't throw error for already enrolled
        } else {
          const errorMessage = res.message || res.error || `Enrollment failed (${response.status})`;
          throw new Error(errorMessage);
        }
      }
      
      console.log('Enrollment successful:', res);
      toast.success("Successfully enrolled in course!");
      return res;
    } catch (error: unknown) {
      console.error("Enrollment error:", error);
      
      if (error instanceof Error) {
        // Don't show toast here if it's already handled elsewhere
        if (error.message.includes('401') || error.message.includes('unauthorized') || error.message.includes('session has expired')) {
          toast.error("Please log in again to enroll in courses");
        } else if (!error.message.includes('already enrolled')) {
          toast.error(error.message);
        }
        console.error("Enrollment failed", error.message);
      } else {
        toast.error("Failed to enroll in course");
        console.error("Unknown error", error);
      }
      throw error;
    }
  }

  const getUserEnrollments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No authentication token found for getUserEnrollments");
        return [];
      }
      
      console.log('Fetching user enrollments...');
      let response;
      let res;
      
      try {
        // Try primary endpoint
        response = await fetch(`${BASEURL}/enrollments/user`, {
          headers: {
            "authorization": `Bearer ${token}`
          }
        });
        res = await response.json();
        console.log('Enrollments response:', { status: response.status, ok: response.ok, response: res });
        
        if (response.ok) {
          console.log('User enrollments fetched successfully:', res);
          return res;
        }
      } catch {
        console.warn('Primary enrollments endpoint failed, trying fallback...');
      }
      
      // Fallback: Try alternative endpoint or return empty for now
      if (!response || response.status === 404) {
        console.log('Enrollments endpoint not available, returning empty array');
        return [];
      }
      
      if (!response.ok) {
        if (response.status === 401) {
          console.warn("Unauthorized - user may need to log in again");
          return [];
        }
        throw new Error(res?.message || `Failed to fetch enrollments (${response.status})`);
      }
      
      console.log('User enrollments fetched successfully:', res);
      return res;
    } catch (error: unknown) {
      if (isError(error)) {
        console.error("Failed to get enrollments", error.message);
      } else {
        console.error("Unknown error", error);
      }
      return [];
    }
  }

  const getCourseProgress = async (courseId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      
      const response = await fetch(`${BASEURL}/progress/course/${courseId}`, {
        headers: {
          "authorization": `Bearer ${token}`
        }
      });

      const res = await response.json();
      if (!response.ok) throw new Error(res.message);
      return res;
    } catch (error: unknown) {
      if (isError(error)) {
        console.error("Failed to get course progress", error.message);
      } else {
        console.error("Unknown error", error);
      }
      return null;
    }
  }
  
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
    uploadMedia,
    publishCourse,
    deleteCourse,

    enrollCourse,
    getUserEnrollments,
    getCourseProgress
  }
}
