"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Loader2 } from "lucide-react";

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
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
  email: z.string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number" 
    }),
  confirmPassword: z.string()
    .min(1, { message: "Please confirm your password" }),
  fname: z.string()
    .min(1, { message: "First name is required" })
    .min(2, { message: "First name must be at least 2 characters long" }),
  lname: z.string()
    .min(1, { message: "Last name is required" })
    .min(2, { message: "Last name must be at least 2 characters long" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don&apos;t match",
  path: ["confirmPassword"],
});

export type RegistrationFormType = z.infer<typeof formSchema>;

const RegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { registerUser } = useAuth();
  
  const form = useForm<RegistrationFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fname: "",
      lname: ""
    }
  });

  const onSubmit = async (data: RegistrationFormType) => {
    setIsSubmitting(true);
    try {
      // Remove confirmPassword before sending to backend
      const { ...registrationData } = data;
      await registerUser(registrationData);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-5 px-6 py-6 rounded-lg w-full md:w-sm items-center justify-center shadow-md bg-background border border-border/50">
        <p className="text-lg font-extrabold">Register</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        id="fname"
                        placeholder="John"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        id="lname"
                        placeholder="Doe"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="example@youremail.com"
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      id="confirmPassword"
                      placeholder="********"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 
                <div className="flex gap-2 items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <p>Creating account...</p>
                </div>
              : "Create Account"}
            </Button>
          </form>
        </Form>

        <div>
          <p className="text-center text-xs">
            Already have an account? <Link href={"/login"} className="underline hover:text-primary duration-200">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegistrationForm;