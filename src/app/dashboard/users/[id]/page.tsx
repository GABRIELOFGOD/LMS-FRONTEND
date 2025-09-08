"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mail, Calendar, User, Shield, UserCheck } from "lucide-react";
import { User as UserType } from "@/types/user";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { isError } from "@/services/helper";

const AdminUserDetails = () => {
  const params = useParams();
  const router = useRouter();
  const { getAllUsers } = useUser();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const users = await getAllUsers();
        const foundUser = users.find((u: UserType) => u.id === params.id);
        if (foundUser) {
          setUser(foundUser);
        } else {
          toast.error("User not found");
          router.push("/dashboard/users");
        }
      } catch (error: unknown) {
        if (isError(error)) {
          toast.error(error.message);
        } else {
          toast.error("Failed to fetch user details");
        }
        router.push("/dashboard/users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [params.id, getAllUsers, router]);

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { variant: "destructive" as const, label: "Admin" },
      teacher: { variant: "default" as const, label: "Teacher" },
      student: { variant: "secondary" as const, label: "Student" },
    };
    
    const config = roleConfig[role.toLowerCase() as keyof typeof roleConfig] || roleConfig.student;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Shield className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">User not found</p>
        <Button onClick={() => router.push("/dashboard/users")}>
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/users")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
        <h1 className="text-3xl font-bold">User Details</h1>
        <p className="text-muted-foreground">View and manage user information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-primary">
                  {user.fname?.charAt(0)}{user.lname?.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">{user.fname} {user.lname}</h3>
                <p className="text-muted-foreground">ID: {user.id}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm">{user.email}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Role:</span>
                {getRoleBadge(user.role)}
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Joined:</span>
                <span className="text-sm">{formatDate(user.createdAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-green-600" />
                <Badge 
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  Active
                </Badge>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Additional Information</h4>
              <div className="text-sm text-muted-foreground">
                <p>Last updated: {formatDate(user.updatedAt || user.createdAt)}</p>
                <p>User type: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                Deactivate User
              </Button>
              <Button variant="outline" size="sm">
                Reset Password
              </Button>
              <Button variant="outline" size="sm">
                View Activity Log
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUserDetails;