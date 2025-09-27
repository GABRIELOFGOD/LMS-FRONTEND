import { BASEURL } from "@/lib/utils";
import { isError } from "@/services/helper";
import { AddChapterResponse, RestoreCourseResponse } from "@/types/course";
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
      const allCourses = res.value || res.data || res || [];
      
      // Filter out deleted courses (courses with isDeleted: true)
      // Also handle cases where backend might use different deletion indicators
      const activeCourses = Array.isArray(allCourses) 
        ? allCourses.filter(course => {
            if (!course) return false;
            
            // Primary check: isDeleted flag
            if (course.isDeleted === true) return false;
            
            // Secondary checks: other possible deletion indicators
            if (course.deleted === true) return false;
            if (course.status === 'deleted') return false;
            if (course.deletedAt && course.deletedAt !== null) return false;
            
            return true;
          })
        : [];
        
      console.log('getCourses - Filtered active courses:', activeCourses.length, 'out of', Array.isArray(allCourses) ? allCourses.length : 0);
      
      return activeCourses;
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
      
      // If we're unpublishing a course, clean up enrollments (optional)
      if (!shouldPublish) {
        console.log('publishCourse - Course unpublished, considering enrollment cleanup');
        try {
          // Uncomment the next line if you want to remove enrollments when courses are unpublished
          // await cleanupCourseEnrollments(id, 'unpublished');
          console.log('publishCourse - Enrollment cleanup skipped for unpublished course (enrollments preserved)');
        } catch (cleanupError) {
          console.warn('publishCourse - Enrollment cleanup failed, but publish operation succeeded:', cleanupError);
        }
      }
      
      return res;

    } catch (error) {
      console.error('publishCourse - Error:', error);
      throw error;
    }
  }

  // DELETE COURSE FUNCTION
  // Uses standard REST endpoint: DELETE /courses/{courseId}
  const deleteCourse = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      
      console.log('deleteCourse - Starting deletion process for course:', id);
      
      // Use the standard REST endpoint: DELETE /courses/{courseId}
      const req = await fetch(`${BASEURL}/courses/${id}`, {
        method: "DELETE",
        headers: {
          "authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!req.ok) {
        let errorMessage = `Failed to delete course`;
        try {
          const errorRes = await req.json();
          errorMessage = errorRes.message || errorRes.error || errorMessage;
        } catch {
          errorMessage = req.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      let res;
      try {
        res = await req.json();
      } catch {
        // Some APIs return empty response on successful delete
        res = { message: 'Course deleted successfully' };
      }
      
      console.log('deleteCourse - Course deletion successful, initiating enrollment cleanup');
      
      // Clean up enrollments for this deleted course
      try {
        await cleanupCourseEnrollments(id, 'deleted');
      } catch (cleanupError) {
        console.warn('deleteCourse - Enrollment cleanup failed, but course deletion succeeded:', cleanupError);
        // Don't throw error here as the main operation (course deletion) succeeded
      }
      
      return res;

    } catch (error) {
      console.error('Delete course error:', error);
      throw error;
    }
  }

  // Clean up enrollments when a course is deleted or unpublished
  const cleanupCourseEnrollments = async (courseId: string, action: 'deleted' | 'unpublished') => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn('cleanupCourseEnrollments - No token available, skipping cleanup');
        return;
      }

      console.log(`cleanupCourseEnrollments - Cleaning up enrollments for ${action} course:`, courseId);

      // Try to call a backend endpoint to remove enrollments for the course
      // This is the ideal approach if your backend supports it
      try {
        const response = await fetch(`${BASEURL}/courses/${courseId}/enrollments`, {
          method: "DELETE",
          headers: {
            "authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          console.log(`cleanupCourseEnrollments - Successfully removed enrollments for ${action} course:`, courseId);
          return;
        } else if (response.status === 404) {
          console.log('cleanupCourseEnrollments - Enrollment cleanup endpoint not available');
        } else {
          console.warn(`cleanupCourseEnrollments - Enrollment cleanup failed with status: ${response.status}`);
        }
      } catch (endpointError) {
        console.warn('cleanupCourseEnrollments - Enrollment cleanup endpoint failed:', endpointError);
      }

      // Fallback: Since we can't remove enrollments server-side, 
      // the filtering in getUserEnrollments will handle this client-side
      console.log(`cleanupCourseEnrollments - Using client-side filtering for ${action} course:`, courseId);
      
    } catch (error) {
      console.error('cleanupCourseEnrollments - Error during enrollment cleanup:', error);
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

// VIDEO AND PDF UPLOAD FUNCTIONS
// Note: Backend only accepts /chapters/{id}/video endpoint for both videos and PDFs
// Always use "video" field name in FormData regardless of file type (PDF or video)

const addChapter = async (
    courseId: string,
    { name, video }: { name: string; video?: File | string | null }
  ): Promise<AddChapterResponse> => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("courseId", courseId);
    
    if (video) {
      if (video instanceof File) {
        // File upload - always use "video" field name since backend expects this field
        formData.append("video", video);
      } else if (typeof video === 'string') {
        // Video URL - send as regular form field
        formData.append("videoUrl", video);
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
        if (video instanceof File && video.type === 'application/pdf') {
          errorMessage += ' (Note: Make sure your backend accepts PDF files in the "video" field)';
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
    { name, video }: { name: string; video?: File | string | null }
  ): Promise<AddChapterResponse> => {
    const token = localStorage.getItem("token");

    // Handle File uploads vs URL strings differently
    if (video instanceof File) {
      // Use FormData for file uploads
      const formData = new FormData();
      formData.append("name", name);
      formData.append("video", video);
      
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
          let errorMessage = res.message || 'Failed to update chapter';
          if (video.type === 'application/pdf') {
            errorMessage += ' (Note: Make sure your backend accepts PDF files in the "video" field)';
          }
          throw new Error(errorMessage);
        }
        return res as AddChapterResponse;
      } catch (error) {
        throw error;
      }
    } else {
      // Use JSON for video URLs and name-only updates
      const body = JSON.stringify({
        name,
        ...(typeof video === 'string' && { video })
      });
      
      try {
        const req = await fetch(`${BASEURL}/chapters/${chapterId}`, {
          method: "PATCH",
          headers: {
            "authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: body,
        });

        const res = await req.json();
        if (!req.ok) {
          const errorMessage = res.message || 'Failed to update chapter';
          throw new Error(errorMessage);
        }
        return res as AddChapterResponse;
      } catch (error) {
        throw error;
      }
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
    
    // Always use "video" field name since backend only accepts /chapters/{id}/video endpoint
    // This endpoint should handle both videos and PDFs
    formData.append("video", file);
    
    try {
      const req = await fetch(`${BASEURL}/chapters/${chapterId}/video`, {
        method: "PUT",
        headers: {
          "authorization": `Bearer ${token}`
        },
        body: formData,
      });

      const res = await req.json();
      if (!req.ok) {
        // Provide more specific error messages
        const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|ogg|mov|avi)$/i.test(file.name);
        const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        
        if (isPDF) {
          throw new Error(`PDF upload failed: ${res.message}. Make sure your backend's /chapters/{id}/video endpoint accepts PDF files.`);
        } else if (isVideo) {
          throw new Error(`Video upload failed: ${res.message}`);
        } else {
          throw new Error(`Upload failed: ${res.message}`);
        }
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
          // Filter out enrollments for deleted or unpublished courses
          const cleanedEnrollments = await filterValidEnrollments(res);
          return cleanedEnrollments;
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
      // Filter out enrollments for deleted or unpublished courses
      const cleanedEnrollments = await filterValidEnrollments(res);
      return cleanedEnrollments;
    } catch (error: unknown) {
      if (isError(error)) {
        console.error("Failed to get enrollments", error.message);
      } else {
        console.error("Unknown error", error);
      }
      return [];
    }
  }

  // Filter out enrollments for courses that are deleted or unpublished
  const filterValidEnrollments = async (enrollments: unknown[]) => {
    if (!Array.isArray(enrollments) || enrollments.length === 0) {
      return enrollments;
    }

    try {
      console.log('filterValidEnrollments - Checking enrollment validity for', enrollments.length, 'courses');
      const validEnrollments = [];
      
      for (const enrollment of enrollments) {
        if (!enrollment || typeof enrollment !== 'object' || !('courseId' in enrollment)) {
          console.warn('filterValidEnrollments - Invalid enrollment object:', enrollment);
          continue;
        }

        const enrollmentObj = enrollment as { courseId: string };
        
        try {
          // Check if the course still exists and is available
          const course = await getACourse(enrollmentObj.courseId);
          
          if (!course) {
            console.log(`filterValidEnrollments - Course ${enrollmentObj.courseId} not found, removing enrollment`);
            continue;
          }
          
          // Check if course is deleted
          if (course.isDeleted === true || course.deleted === true || course.status === 'deleted' || course.deletedAt) {
            console.log(`filterValidEnrollments - Course ${enrollmentObj.courseId} is deleted, removing enrollment`);
            continue;
          }
          
          // Check if course is unpublished (optional - you may want to keep these)
           if (course.publish === false) {
           console.log(`filterValidEnrollments - Course ${enrollmentObj.courseId} is unpublished, removing enrollment`);
            continue;
          }
          
          // Course is valid, keep the enrollment
          validEnrollments.push(enrollment);
          
        } catch (courseError) {
          console.error(`filterValidEnrollments - Error checking course ${enrollmentObj.courseId}:`, courseError);
          // If we can't verify the course, assume it's valid to avoid removing legitimate enrollments
          validEnrollments.push(enrollment);
        }
      }
      
      if (validEnrollments.length !== enrollments.length) {
        console.log(`filterValidEnrollments - Filtered enrollments: ${validEnrollments.length}/${enrollments.length} valid`);
      }
      
      return validEnrollments;
    } catch (error) {
      console.error('filterValidEnrollments - Error filtering enrollments:', error);
      // Return original enrollments if filtering fails
      return enrollments;
    }
  }

  const getCourseProgress = async (courseId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      
      // Use the correct endpoint for user progress
      const response = await fetch(`${BASEURL}/users/progress/${courseId}`, {
        headers: {
          "authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Progress endpoint might not exist yet, return default progress
          return { completionPercentage: 0, completedChapters: [] };
        }
        const res = await response.json();
        throw new Error(res.message);
      }

      const res = await response.json();
      return res;
    } catch (error: unknown) {
      if (isError(error)) {
        console.error("Failed to get course progress", error.message);
      } else {
        console.error("Unknown error", error);
      }
      // Return default progress instead of null to prevent breaking the UI
      return { completionPercentage: 0, completedChapters: [] };
    }
  }

  // Mark chapter as complete
  const markChapterComplete = async (courseId: string, chapterId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      
      console.log('markChapterComplete - Marking chapter as complete:', { courseId, chapterId });
      
      const response = await fetch(`${BASEURL}/users/progress/${courseId}/chapters/${chapterId}`, {
        method: "POST",
        headers: {
          "authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ completed: true })
      });

      if (!response.ok) {
        if (response.status === 404) {
          // If endpoint doesn't exist, use fallback approach
          console.log('markChapterComplete - Progress endpoint not available, using fallback');
          return await markChapterCompleteFallback(courseId, chapterId);
        }
        const res = await response.json().catch(() => ({}));
        throw new Error(res.message || `Failed to mark chapter as complete (${response.status})`);
      }

      const res = await response.json();
      console.log('markChapterComplete - Chapter marked as complete:', res);
      
      // Show success message
      toast.success("Chapter marked as complete!");
      
      return res;

    } catch (error: unknown) {
      if (isError(error)) {
        console.error("Failed to mark chapter as complete", error.message);
        toast.error(error.message);
      } else {
        console.error("Unknown error marking chapter as complete", error);
        toast.error("Failed to mark chapter as complete");
      }
      throw error;
    }
  }

  // Fallback method for chapter completion when backend doesn't have progress API
  const markChapterCompleteFallback = async (courseId: string, chapterId: string) => {
    try {
      // Store completion in localStorage as fallback
      const storageKey = `chapter_progress_${courseId}`;
      const existingProgress = JSON.parse(localStorage.getItem(storageKey) || '{"completedChapters": []}');
      
      if (!existingProgress.completedChapters.includes(chapterId)) {
        existingProgress.completedChapters.push(chapterId);
        existingProgress.lastUpdated = new Date().toISOString();
        localStorage.setItem(storageKey, JSON.stringify(existingProgress));
        
        toast.success("Chapter marked as complete!");
        console.log('markChapterCompleteFallback - Stored completion locally:', { courseId, chapterId });
      } else {
        toast.info("Chapter already marked as complete");
      }
      
      return { 
        success: true, 
        completedChapters: existingProgress.completedChapters,
        message: "Chapter completion stored locally"
      };
    } catch (error) {
      console.error('markChapterCompleteFallback - Error:', error);
      throw new Error("Failed to store chapter completion");
    }
  }

  // Mark course as complete
  const markCourseComplete = async (courseId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      
      console.log('markCourseComplete - Marking course as complete:', courseId);
      
      const response = await fetch(`${BASEURL}/users/progress/${courseId}/complete`, {
        method: "POST",
        headers: {
          "authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ completed: true })
      });

      if (!response.ok) {
        if (response.status === 404) {
          // If endpoint doesn't exist, use fallback approach
          console.log('markCourseComplete - Course completion endpoint not available, using fallback');
          return await markCourseCompleteFallback(courseId);
        }
        const res = await response.json().catch(() => ({}));
        throw new Error(res.message || `Failed to mark course as complete (${response.status})`);
      }

      const res = await response.json();
      console.log('markCourseComplete - Course marked as complete:', res);
      
      // Show success message
      toast.success("🎉 Congratulations! Course completed!");
      
      return res;

    } catch (error: unknown) {
      if (isError(error)) {
        console.error("Failed to mark course as complete", error.message);
        toast.error(error.message);
      } else {
        console.error("Unknown error marking course as complete", error);
        toast.error("Failed to mark course as complete");
      }
      throw error;
    }
  }

  // Fallback method for course completion when backend doesn't have progress API
  const markCourseCompleteFallback = async (courseId: string) => {
    try {
      // Store completion in localStorage as fallback
      const storageKey = `course_progress_${courseId}`;
      const courseProgress = {
        courseId,
        completed: true,
        completionDate: new Date().toISOString(),
        completionPercentage: 100
      };
      localStorage.setItem(storageKey, JSON.stringify(courseProgress));
      
      // Also update the general completed courses list
      const completedCoursesKey = 'completed_courses';
      const completedCourses = JSON.parse(localStorage.getItem(completedCoursesKey) || '[]');
      if (!completedCourses.includes(courseId)) {
        completedCourses.push(courseId);
        localStorage.setItem(completedCoursesKey, JSON.stringify(completedCourses));
      }
      
      toast.success("🎉 Congratulations! Course completed!");
      console.log('markCourseCompleteFallback - Stored completion locally:', courseId);
      
      return { 
        success: true, 
        completed: true,
        completionPercentage: 100,
        message: "Course completion stored locally"
      };
    } catch (error) {
      console.error('markCourseCompleteFallback - Error:', error);
      throw new Error("Failed to store course completion");
    }
  }

  // Get chapter completion status (for fallback when no backend API)
  const getChapterCompletion = async (courseId: string, chapterId: string) => {
    try {
      // Try to get from backend first
      const token = localStorage.getItem("token");
      if (token) {
        const response = await fetch(`${BASEURL}/users/progress/${courseId}/chapters/${chapterId}`, {
          headers: {
            "authorization": `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const res = await response.json();
          return res.completed || false;
        }
      }
      
      // Fallback to localStorage
      const storageKey = `chapter_progress_${courseId}`;
      const progress = JSON.parse(localStorage.getItem(storageKey) || '{"completedChapters": []}');
      return progress.completedChapters.includes(chapterId);
      
    } catch (error) {
      console.error('getChapterCompletion - Error:', error);
      return false;
    }
  }
  
  // RESTORE COURSE FUNCTION
  // Uses PUT endpoint: PUT /courses/{courseId} to restore soft-deleted course
  const restoreCourse = async (id: string): Promise<RestoreCourseResponse> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      
      // Use PUT endpoint to restore the course
      const req = await fetch(`${BASEURL}/courses/${id}`, {
        method: "PUT",
        headers: {
          "authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: "restore" // Indicate this is a restore action
        })
      });

      if (!req.ok) {
        let errorMessage = `Failed to restore course`;
        try {
          const errorRes = await req.json();
          errorMessage = errorRes.message || errorRes.error || errorMessage;
        } catch {
          errorMessage = req.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      let res;
      try {
        res = await req.json();
      } catch {
        // Some APIs return empty response on successful restore
        res = { message: 'Course restored successfully' };
      }
      
      return res;

    } catch (error) {
      console.error('Restore course error:', error);
      throw error;
    }
  }

  // GET DELETED COURSES FUNCTION
  // Fetches courses that have been soft-deleted
  const getDeletedCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      
      console.log('getDeletedCourses - Fetching deleted courses...');
      
      // Try the dedicated deleted courses endpoint first
      try {
        const response = await fetch(`${BASEURL}/courses/deleted`, {
          method: "GET",
          headers: {
            "authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (response.ok) {
          const res = await response.json();
          console.log('getDeletedCourses - Deleted courses fetched from dedicated endpoint:', res);
          return res.value || res.data || res || [];
        } else if (response.status === 404) {
          console.log('getDeletedCourses - Dedicated endpoint not found, falling back to filtering all courses');
        } else {
          throw new Error(`Failed to fetch deleted courses: ${response.status}`);
        }
      } catch (endpointError) {
        console.log('getDeletedCourses - Dedicated endpoint failed, falling back to filtering all courses:', endpointError);
      }
      
      // Fallback: Get all courses and filter for deleted ones
      const allCourses = await getAllCoursesIncludingDeleted();
      const deletedCourses = Array.isArray(allCourses) 
        ? allCourses.filter(course => {
            if (!course) return false;
            
            // Check various deletion indicators
            if (course.isDeleted === true) return true;
            if (course.deleted === true) return true;
            if (course.status === 'deleted') return true;
            if (course.deletedAt && course.deletedAt !== null) return true;
            
            return false;
          })
        : [];
        
      console.log('getDeletedCourses - Filtered deleted courses from all courses:', deletedCourses.length);
      return deletedCourses;
      
    } catch (error: unknown) {
      if (isError(error)) {
        console.error("getDeletedCourses - Error:", error.message);
        throw error;
      } else {
        console.error("getDeletedCourses - Unknown error:", error);
        throw new Error("Failed to fetch deleted courses");
      }
    }
  };

  // GET ALL COURSES (including deleted) - for admin purposes
  const getAllCoursesIncludingDeleted = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No authentication token found for getAllCoursesIncludingDeleted");
        return [];
      }
      const response = await fetch(`${BASEURL}/courses`, {
        headers: {
          "authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch all courses: ${response.status}`);
      }
      
      const res = await response.json();
      console.log('getAllCoursesIncludingDeleted - Raw response:', res);
      
      // Return all courses without filtering
      return res.value || res.data || res || [];
    } catch (error) {
      console.error("Error fetching all courses:", error);
      return [];
    }
  };

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
    getCourseProgress,
    cleanupCourseEnrollments,

    // Chapter and course completion tracking
    markChapterComplete,
    markCourseComplete,
    getChapterCompletion,

    restoreCourse,
    getDeletedCourses,
    getAllCoursesIncludingDeleted
  }
}
