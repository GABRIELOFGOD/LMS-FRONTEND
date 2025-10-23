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
import { ArrowLeft, CheckCircle, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BASEURL } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" })
});

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${BASEURL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (response.ok) {
        setEmailSent(true);
        toast.success("Password reset instructions have been sent to your email.");
      } else {
        toast.error(result.message || "Failed to send reset email. Please try again.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-5 px-6 py-8 rounded-lg w-full shadow-md bg-background border border-border/50">
            {/* Back to Login Link */}
            <Link 
              href="/login" 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>

            {!emailSent ? (
              <>
                {/* Header */}
                <div className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold">Forgot Password?</h1>
                  <p className="text-sm text-muted-foreground">
                    No worries! Enter your email address and we&apos;ll send you instructions to reset your password.
                  </p>
                </div>

                {/* Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="w-full grid gap-5">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              id="email"
                              placeholder="example@youremail.com"
                              {...field}
                              type="email"
                              disabled={isSubmitting}
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
                      {isSubmitting ? (
                        <div className="flex gap-2 items-center justify-center">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <p>Sending...</p>
                        </div>
                      ) : (
                        "Send Reset Link"
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
                  <h2 className="text-2xl font-bold">Check Your Email</h2>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ve sent password reset instructions to{" "}
                    <span className="font-semibold text-foreground">
                      {form.getValues("email")}
                    </span>
                  </p>
                  <div className="pt-4 space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Didn&apos;t receive the email? Check your spam folder or{" "}
                      <button
                        onClick={() => {
                          setEmailSent(false);
                          form.reset();
                        }}
                        className="underline hover:text-primary transition-colors"
                      >
                        try another email address
                      </button>
                    </p>
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

export default ForgotPassword;