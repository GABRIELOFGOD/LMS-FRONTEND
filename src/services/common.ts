import { BASEURL } from "@/lib/utils";
import { isError } from "./helper";
import { toast } from "sonner";

export const enrollCourse = async (courseId: string) => {
  try {
    const req = await fetch(`${BASEURL}/courses/enroll/${courseId}`, {
      method: "PUT",
      headers: {
        "authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
    });

    const res = await req.json();
    if (!req.ok) throw new Error(res.message || "Failed to enroll for course");
  } catch (error: unknown) {
    if (isError(error)) {
      toast.error(error.message);
      console.error("Login failed", error.message);
    } else {
      console.error("Unknown error", error);
    }
  }
}