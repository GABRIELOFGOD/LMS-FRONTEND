"use client";

import Image from "next/image";
import User from "@/assets/hero-fc.png";
import { yearJoined } from "@/services/helper";
import { useUser } from "@/context/user-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Camera } from "lucide-react";
import { useState, useRef } from "react";

const UserProfile = () => {
  const { user } = useUser();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [bio, setBio] = useState(user?.bio || "John - Aspiring Developer & Lifelong Learner");
  const [profileImage, setProfileImage] = useState("");
  const [firstName, setFirstName] = useState(user?.fname || "");
  const [lastName, setLastName] = useState(user?.lname || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    // TODO: Implement API call to save profile changes
    console.log("Saving profile:", { firstName, lastName, bio, profileImage });
    setIsEditingProfile(false);
    // You can integrate with your backend API here
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <p className="text-2xl md:text-3xl font-bold">
          {user?.fname ? `${user.fname}'s Profile` : "My Profile"}
        </p>
        <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-accent border-2 border-gray-200">
                    {profileImage ? (
                      <Image 
                        src={profileImage} 
                        alt="profile" 
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image src={User} alt="profile" width={96} height={96} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
                    onClick={triggerImageUpload}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-gray-500">Click camera to change photo</p>
              </div>
              
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                  />
                </div>
              </div>
              
              {/* Bio Field */}
              <div>
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Profile Display */}
      <div className="flex gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-accent border-2 border-gray-200">
            {profileImage ? (
              <Image 
                src={profileImage} 
                alt="profile" 
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image src={User} alt="profile" width={80} height={80} className="w-full h-full object-cover" />
            )}
          </div>
        </div>
        <div className="my-auto flex-1">
          <p className="text-lg md:text-xl font-bold">{firstName || user?.fname} {lastName || user?.lname}</p>
          <p className="text-sm text-gray-500 mb-2">Joined {yearJoined(user?.createdAt || "")}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 italic">{bio}</p>
        </div>
      </div>
    </div>
  )
}
export default UserProfile;