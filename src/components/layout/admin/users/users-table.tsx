"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@/hooks/use-user";
import { useEffect, useState } from "react";
import { isError } from "../../../../services/helper";
import { User } from "@/types/user";
import { toast } from "sonner";
import { TbMoodEmpty } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import TableLoading from "../table-loading";
import { Eye, UserCheck, UserX, Mail, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UsersTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();
  
  const { getAllUsers } = useUser();

  const gettingAllUsers = async () => {
    try {
      const gotUsers = await getAllUsers();
      console.log("[GOTTEN]: ", gotUsers);
      setUsers(gotUsers);
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
        console.error("Login failed", error.message);
      } else {
        console.error("Unknown error", error);
      }
      router.back();
    } finally  {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    gettingAllUsers();
  }, []);

  if (isLoading) {
    return (
      <TableLoading
        title="users"
      />
    )
  }

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { variant: "destructive" as const, icon: UserCheck, label: "Admin" },
      teacher: { variant: "default" as const, icon: UserCheck, label: "Teacher" },
      student: { variant: "secondary" as const, icon: UserX, label: "Student" },
    };
    
    const config = roleConfig[role.toLowerCase() as keyof typeof roleConfig] || roleConfig.student;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const viewUser = (id: string) => {
    // Navigate to user details page
    router.push(`/dashboard/users/${id}`);
  };
  
  return (
    <div className="flex-1">
      {users.length < 1 ? (
        <div className="w-full h-[200px] flex justify-center items-center gap-2">
          <TbMoodEmpty />
          <p>No users</p>
        </div>
      ) : (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Users Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>A list of all registered users</TableCaption>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold">Role</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Joined</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, i) => (
                  <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {user.fname?.charAt(0)}{user.lname?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{user.fname} {user.lname}</div>
                          <div className="text-sm text-muted-foreground">#{i + 1}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="default"
                        className="bg-green-100 text-green-800 hover:bg-green-200"
                      >
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(user.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => viewUser(user.id)}
                        className="hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
export default UsersTable;