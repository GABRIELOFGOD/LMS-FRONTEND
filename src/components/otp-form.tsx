"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Loader2, RefreshCw } from "lucide-react";

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
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";

const formSchema = z.object({
  email: z.string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  otp: z.string()
    .min(6, { message: "OTP must be 6 digits" })
    .max(6, { message: "OTP must be 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
});

export type OtpFormType = z.infer<typeof formSchema>;

const OtpForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const { verifyOtp, resendOpt } = useAuth();
  const searchParams = useSearchParams();
  
  const form = useForm<OtpFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: searchParams?.get("email") || "",
      otp: ""
    }
  });

  // Countdown timer for resend button
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const onSubmit = async (data: OtpFormType) => {
    setIsSubmitting(true);
    try {
      await verifyOtp(data.otp, data.email);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    const email = form.getValues("email");
    if (!email) {
      form.setError("email", { message: "Please enter your email first" });
      return;
    }

    setIsResending(true);
    try {
      await resendOpt(email);
      setCountdown(60); // 60 seconds countdown
      form.setValue("otp", ""); // Clear OTP field
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <div className="flex flex-col gap-5 px-6 py-6 rounded-lg w-full md:w-sm items-center justify-center shadow-md bg-background border border-border/50">
        <div className="text-center">
          <p className="text-lg font-extrabold">Verify Your Email</p>
          <p className="text-sm text-muted-foreground mt-1">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full grid gap-4">
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
                      disabled={!!searchParams?.get("email")} // Disable if email comes from URL
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      id="otp"
                      placeholder="123456"
                      {...field}
                      type="text"
                      maxLength={6}
                      className="text-center text-lg tracking-widest font-mono"
                      onChange={(e) => {
                        // Only allow numbers
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2">
              <Button
                className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 
                  <div className="flex gap-2 items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <p>Verifying...</p>
                  </div>
                : "Verify Code"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isResending || countdown > 0}
                onClick={handleResendOtp}
              >
                {isResending ? 
                  <div className="flex gap-2 items-center justify-center">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <p>Resending...</p>
                  </div>
                : countdown > 0 ? 
                  `Resend in ${formatTime(countdown)}`
                : "Resend Code"}
              </Button>
            </div>
          </form>
        </Form>

        <div>
          <p className="text-center text-xs">
            Wrong email? <Link href={"/register"} className="underline hover:text-primary duration-200">Go back to registration</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default OtpForm;