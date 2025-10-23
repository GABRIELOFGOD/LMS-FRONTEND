"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Mail, MapPin, Phone, Send, MessageSquare, Clock, Building, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" })
});


const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "01846934-487e-4dd0-9155-a74173bd2619";

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Prepare form data for Web3Forms
      const formData = {
        access_key: WEB3FORMS_ACCESS_KEY,
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        // Optional: Add additional fields
        from_name: "LMS Contact Form",
        replyto: data.email,
      };

      // Submit to Web3Forms API
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        console.log("Contact form submitted successfully:", result);
        toast.success("Message sent successfully! We'll get back to you soon.");
        form.reset();
      } else {
        console.error("Web3Forms error:", result);
        toast.error(result.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Failed to send message. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Building,
      title: "Organization",
      content: "Brain Builders Youth Development Initiative",
      color: "text-blue-600"
    },
    {
      icon: MapPin,
      title: "Address",
      content: "Abuja, Nigeria",
      color: "text-green-600"
    },
    {
      icon: Mail,
      title: "Email",
      content: "fcalearn@thebrainbuilders.org",
      link: "mailto:fcalearn@thebrainbuilders.org",
      color: "text-purple-600"
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+234 XXX XXX XXXX",
      link: "tel:+234XXXXXXXXXX",
      color: "text-orange-600"
    },
    {
      icon: Clock,
      title: "Working Hours",
      content: "Monday - Friday: 9AM - 5PM WAT",
      color: "text-indigo-600"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about our courses or platform? We&apos;re here to help! 
              Reach out to us and we&apos;ll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-background rounded-lg shadow-md border border-border/50 p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Contact Information
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Feel free to reach out through any of these channels
                </p>
                
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-${info.color}/10 flex items-center justify-center`}>
                        <info.icon className={`w-5 h-5 ${info.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm mb-1">{info.title}</p>
                        {info.link ? (
                          <a 
                            href={info.link}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors break-words"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground break-words">{info.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Help */}
              <div className="bg-primary/5 dark:bg-primary/10 rounded-lg border-2 border-primary/20 p-6">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Quick Help
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Looking for immediate answers? Check out our resources:
                </p>
                <div className="space-y-2">
                  <a href="/about" className="block text-sm text-primary hover:underline">
                    → About Us
                  </a>
                  <a href="/courses" className="block text-sm text-primary hover:underline">
                    → Browse Courses
                  </a>
                  <a href="/privacy-policy" className="block text-sm text-primary hover:underline">
                    → Privacy Policy
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-background rounded-lg shadow-md border border-border/50 p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-2">Send Us a Message</h2>
                <p className="text-muted-foreground mb-6">
                  Fill out the form below and we&apos;ll get back to you within 24-48 hours
                </p>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                {...field}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john@example.com"
                                {...field}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="What is this about?"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us more about your inquiry..."
                              className="min-h-[150px] resize-none"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex gap-2 items-center justify-center">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending...</span>
                        </div>
                      ) : (
                        <div className="flex gap-2 items-center justify-center">
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-12 bg-background rounded-lg shadow-md border border-border/50 p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Why Contact Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-3">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Course Inquiries</h3>
                <p className="text-sm text-muted-foreground">
                  Questions about course content, enrollment, or certifications
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mb-3">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Technical Support</h3>
                <p className="text-sm text-muted-foreground">
                  Help with platform issues, login problems, or technical difficulties
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-3">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Partnership</h3>
                <p className="text-sm text-muted-foreground">
                  Interested in partnerships, collaborations, or becoming an instructor
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
