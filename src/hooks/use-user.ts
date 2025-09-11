import { BASEURL } from "@/lib/utils";
import { UserRole } from "@/types/user";

export interface UserProfileUpdate {
  fname?: string;
  lname?: string;
  bio?: string;
  phone?: string;
  address?: string;
  avatar?: File | string;
  profileImage?: string;
}

export const useUser = () => {

  const updateUserProfile = async (userId: string, profileData: UserProfileUpdate) => {
    const token = localStorage.getItem("token");
    try {
      console.log('useUser - Updating profile for user:', userId, profileData);
      
      // Check if we have an avatar file to upload
      if (profileData.avatar && profileData.avatar instanceof File) {
        // Use FormData for file upload
        const formData = new FormData();
        
        // Add text fields
        if (profileData.fname) formData.append('fname', profileData.fname);
        if (profileData.lname) formData.append('lname', profileData.lname);
        if (profileData.bio) formData.append('bio', profileData.bio);
        if (profileData.phone) formData.append('phone', profileData.phone);
        if (profileData.address) formData.append('address', profileData.address);
        
        // Add avatar file
        formData.append('avatar', profileData.avatar);
        
        console.log('useUser - Uploading with FormData including avatar');
        
        const req = await fetch(`${BASEURL}/users/${userId}`, {
          method: "PATCH",
          headers: {
            "authorization": `Bearer ${token}`
            // Don't set Content-Type for FormData
          },
          body: formData
        });

        const res = await req.json();
        if (!req.ok) throw new Error(res.message);
        
        console.log('useUser - Profile update response:', res);
        return res;
      } else {
        // No file upload, use regular JSON request
        const { avatar, ...updateData } = profileData;
        
        const req = await fetch(`${BASEURL}/users/${userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`
          },
          body: JSON.stringify(updateData)
        });

        const res = await req.json();
        if (!req.ok) throw new Error(res.message);
        
        console.log('useUser - Profile update response:', res);
        return res;
      }
      
    } catch (error) {
      console.error('useUser - Profile update error:', error);
      throw error;
    }
  };
  
  const getAllUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const req = await fetch(`${BASEURL}/users`, {
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
  
  const changeRole = async (role: UserRole, id: string) => {
    const token = localStorage.getItem("token");
    try {
      const req = await fetch(`${BASEURL}/users/role/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify({role: role})
      });
      
      const res = await req.json();
      return res;
    } catch (error) {
      throw error;
    }
  }
  
  return {
    updateUserProfile,
    getAllUsers,
    changeRole
  }
  
}
