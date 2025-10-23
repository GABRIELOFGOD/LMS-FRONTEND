"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
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
import { CheckCircle, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BASEURL } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";

const formSchema = z.object({
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const SetPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      setTokenError(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${BASEURL}/auth/set-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: data.password }),
      });

      const result = await response.json();

      if (response.ok) {
        setPasswordReset(true);
        toast.success("Password has been reset successfully!");
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        if (response.status === 400 || response.status === 404) {
          setTokenError(true);
          toast.error(result.message || "Invalid or expired reset link. Please request a new one.");
        } else {
          toast.error(result.message || "Failed to reset password. Please try again.");
        }
      }
    } catch (error) {
      console.error("Set password error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show error if token is invalid or missing
  if (!token || tokenError) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-8 px-4">
          <div className="w-full max-w-md">
            <div className="flex flex-col gap-5 px-6 py-8 rounded-lg w-full shadow-md bg-background border border-border/50">
              <div className="text-center space-y-4 py-4">
                <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold">Invalid Reset Link</h2>
                <p className="text-sm text-muted-foreground">
                  This password reset link is invalid or has expired. Please request a new password reset link.
                </p>
                <div className="pt-4 space-y-3">
                  <Button
                    className="w-full"
                    asChild
                  >
                    <Link href="/forgot-password">
                      Request New Link
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <Link href="/login">
                      Back to Login
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-5 px-6 py-8 rounded-lg w-full shadow-md bg-background border border-border/50">
            {!passwordReset ? (
              <>
                {/* Header */}
                <div className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold">Set New Password</h1>
                  <p className="text-sm text-muted-foreground">
                    Please enter your new password below. Make sure it&apos;s strong and secure.
                  </p>
                </div>

                {/* Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="w-full grid gap-5">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                id="password"
                                placeholder="Enter new password"
                                {...field}
                                type={showPassword ? "text" : "password"}
                                disabled={isSubmitting}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
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
                            <div className="relative">
                              <Input
                                id="confirmPassword"
                                placeholder="Confirm new password"
                                {...field}
                                type={showConfirmPassword ? "text" : "password"}
                                disabled={isSubmitting}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password Requirements */}
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-xs font-semibold mb-2">Password must contain:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>✓ At least 8 characters</li>
                        <li>✓ At least one uppercase letter</li>
                        <li>✓ At least one lowercase letter</li>
                        <li>✓ At least one number</li>
                      </ul>
                    </div>

                    <Button
                      className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex gap-2 items-center justify-center">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <p>Resetting Password...</p>
                        </div>
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </form>
                </Form>

                {/* Additional Links */}
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Remember your password?{" "}
                    <Link href="/login" className="underline hover:text-primary transition-colors">
                      Login
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Success Message */}
                <div className="text-center space-y-4 py-4">
                  <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold">Password Reset Complete!</h2>
                  <p className="text-sm text-muted-foreground">
                    Your password has been successfully reset. You can now login with your new password.
                  </p>
                  <div className="pt-4 space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Redirecting to login page in a few seconds...
                    </p>
                    <Button
                      className="w-full"
                      asChild
                    >
                      <Link href="/login">
                        Go to Login
                      </Link>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Need help?{" "}
              <Link href="/about" className="underline hover:text-primary transition-colors">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SetPassword;
