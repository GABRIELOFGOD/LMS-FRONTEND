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
import { Loader2 } from "lucide-react";
import { TbMoodEmpty } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import TableLoading from "../table-loading";

const UsersTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();
  
  const { getAllUsers } = useUser();

  const gettingAllUsers = async () => {
    try {
      const gotUsers = await getAllUsers();
      setUsers(gotUsers);
    } catch (error: unknown) {
      if (isError(error)) {
        toast.error(error.message);
        console.error("Login failed", error.message);
      } else {
        console.error("Unknown error", error);
      }
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

  const viewUser = async (id: string) => {
    // try {
    //   const res = await changeRole(UserRole.ADMIN, id);
    //   if (!res.message) throw new Error("Couldn't update user role");
    //   router.refresh();
    //   toast.success(res.message);
    // } catch(error: unknown) {
    //   if (isError(error)) {
    //     toast.error(error.message);
    //     console.error("Login failed", error.message);
    //   } else {
    //     console.error("Unknown error", error);
    //   }
    // }
    router.push(`/dashboard/users/${id}`);
  }
  
  return (
    <div className="flex-1">
      {users.length < 1 ?
      (<div className="w-full h-[200px] flex justify-center items-center gap-2">
        <TbMoodEmpty />
        <p>No users</p>
      </div>):
      (<Table>
        <TableCaption>A list of users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">S/N</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email Address</TableHead>
            <TableHead className="text-right">Role</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, i) => (
            <TableRow
              key={i}
            >
              <TableCell className="font-medium">{i+1}</TableCell>
              <TableCell>{user.fname} {user.lname}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="text-right">{user.role}</TableCell>
              <TableCell className="text-right">
                <Button
                  onClick={() => viewUser(user.id)}
                >View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>)}
    </div>
  )
}
export default UsersTable;