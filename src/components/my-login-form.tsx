"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/user";

const formSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" })
});

const MyLoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoggedIn, user, refreshUser } = useUser();
  const router = useRouter();

  // const nextRoute = param.get("to"); // TODO: Implement redirect to specific route after login
  
  const { login } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      console.log('MyLoginForm - Starting login for:', data.email);
      const result = await login(data.email, data.password);
      if (result?.success) {
        console.log('MyLoginForm - Login successful, refreshing user context');
        // Refresh user context to get updated user data
        refreshUser();
        // Don't manually route here, let the useEffect handle it
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Error is already handled in the login function with toast
      // Just reset the form state
      form.setError("root", {
        message: error instanceof Error ? error.message : "Login failed"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (isLoggedIn && user) {
      // Route based on user role
      switch (user.role) {
        case UserRole.ADMIN:
          router.push("/admin");
          break;
        case UserRole.TEACHER:
          router.push("/dashboard");
          break;
        case UserRole.STUDENT:
          router.push("/learner");
          break;
        default:
          router.push("/learner");
      }
    }
  }, [isLoggedIn, user, router]);
  
  return (
    <div>
      <div className="flex flex-col gap-5 px-6 py-6 rounded-lg w-full md:w-sm items-center justify-center shadow-md bg-background border border-border/50">
        <p className="text-lg font-extrabold">Login</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full grid gap-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="e.g: example@youremail.com"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      placeholder="********"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="text-xs text-muted-foreground text-end">
              Forgot password? <Link href={"/forgot-password"} className="underline hover:text-primary duration-200">Reset password</Link>
            </p>

            <Button
              className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 
                <div className="flex gap-2 items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <p>Logging in...</p>
                </div>
              : "Login"}
            </Button>
          </form>
        </Form>


        <div>
          <p className="text-center text-xs">
            Don&apos;t have an account? <Link href={"/register"} className="underline hover:text-primary ">Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default MyLoginForm;