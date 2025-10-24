"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import { Shield, Lock, Eye, Database, Users, Mail, FileText, Calendar } from "lucide-react";

const PrivacyPolicy = () => {
  const lastUpdated = "October 23, 2025";

  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "When you register for an account, we collect your name, email address, and other information you provide during the registration process."
        },
        {
          subtitle: "Learning Data",
          text: "We collect information about your course enrollments, progress, quiz results, certificates earned, and other learning activities on our platform."
        },
        {
          subtitle: "Usage Information",
          text: "We automatically collect information about how you interact with our platform, including pages visited, time spent on courses, and device information."
        }
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Provide Services",
          text: "We use your information to provide, maintain, and improve our learning management services, including course delivery and progress tracking."
        },
        {
          subtitle: "Personalization",
          text: "Your data helps us personalize your learning experience, recommend courses, and provide relevant content."
        },
        {
          subtitle: "Communication",
          text: "We may use your email address to send you course updates, newsletters, and important notifications about your account."
        },
        {
          subtitle: "Analytics",
          text: "We analyze usage data to improve our platform, understand user behavior, and enhance the overall learning experience."
        }
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        {
          subtitle: "Protection Measures",
          text: "We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction."
        },
        {
          subtitle: "Encryption",
          text: "We use encryption technology to secure sensitive data during transmission and storage."
        },
        {
          subtitle: "Access Controls",
          text: "Access to your personal information is restricted to authorized personnel who need it to perform their job functions."
        }
      ]
    },
    {
      icon: Users,
      title: "Information Sharing",
      content: [
        {
          subtitle: "Third-Party Services",
          text: "We may share your information with trusted third-party service providers who assist us in operating our platform, conducting our business, or serving our users."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose your information if required by law or in response to valid requests by public authorities."
        },
        {
          subtitle: "Business Transfers",
          text: "In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction."
        },
        {
          subtitle: "No Sale of Data",
          text: "We do not sell, trade, or rent your personal information to third parties for marketing purposes."
        }
      ]
    },
    {
      icon: FileText,
      title: "Your Rights",
      content: [
        {
          subtitle: "Access and Update",
          text: "You have the right to access and update your personal information at any time through your account settings."
        },
        {
          subtitle: "Data Deletion",
          text: "You can request deletion of your account and personal data by contacting us. Some information may be retained for legal or legitimate business purposes."
        },
        {
          subtitle: "Opt-Out",
          text: "You can opt out of receiving promotional emails by clicking the unsubscribe link in any email or adjusting your notification preferences."
        },
        {
          subtitle: "Data Portability",
          text: "You have the right to request a copy of your data in a portable format."
        }
      ]
    },
    {
      icon: Database,
      title: "Cookies and Tracking",
      content: [
        {
          subtitle: "Cookies Usage",
          text: "We use cookies and similar tracking technologies to enhance your experience, remember your preferences, and analyze site traffic."
        },
        {
          subtitle: "Essential Cookies",
          text: "Some cookies are essential for the operation of our platform, including authentication and security features."
        },
        {
          subtitle: "Analytics Cookies",
          text: "We use analytics cookies to understand how users interact with our platform and improve our services."
        },
        {
          subtitle: "Cookie Control",
          text: "You can control cookie settings through your browser preferences, though disabling certain cookies may affect platform functionality."
        }
      ]
    },
    {
      icon: Users,
      title: "Children's Privacy",
      content: [
        {
          subtitle: "Age Restrictions",
          text: "Our services are intended for users aged 13 and above. We do not knowingly collect personal information from children under 13."
        },
        {
          subtitle: "Parental Consent",
          text: "If you believe we have collected information from a child under 13, please contact us immediately so we can delete it."
        }
      ]
    },
    {
      icon: Calendar,
      title: "Data Retention",
      content: [
        {
          subtitle: "Retention Period",
          text: "We retain your personal information for as long as necessary to provide our services and comply with legal obligations."
        },
        {
          subtitle: "Inactive Accounts",
          text: "Accounts that have been inactive for an extended period may be archived or deleted after appropriate notice."
        },
        {
          subtitle: "Learning Records",
          text: "Course completion records and certificates may be retained longer for verification and credential purposes."
        }
      ]
    },
    {
      icon: Mail,
      title: "International Data Transfers",
      content: [
        {
          subtitle: "Global Services",
          text: "Your information may be transferred to and processed in countries other than your country of residence."
        },
        {
          subtitle: "Data Protection",
          text: "We ensure appropriate safeguards are in place to protect your information regardless of where it is processed."
        }
      ]
    },
    {
      icon: Shield,
      title: "Changes to Privacy Policy",
      content: [
        {
          subtitle: "Policy Updates",
          text: "We may update this privacy policy from time to time to reflect changes in our practices or legal requirements."
        },
        {
          subtitle: "Notification",
          text: "We will notify you of any material changes by posting the new policy on this page and updating the 'Last Updated' date."
        },
        {
          subtitle: "Continued Use",
          text: "Your continued use of our platform after changes are posted constitutes acceptance of the updated policy."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">
              Last Updated: {lastUpdated}
            </p>
          </div>

          {/* Introduction */}
          <div className="bg-background rounded-lg shadow-md border border-border/50 p-6 md:p-8 mb-8">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Welcome to our Learning Management System. We are committed to protecting your privacy and ensuring 
              the security of your personal information. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you use our platform.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By using our services, you agree to the collection and use of information in accordance with this policy. 
              If you do not agree with our policies and practices, please do not use our services.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-background rounded-lg shadow-md border border-border/50 p-6 md:p-8"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
                  </div>
                </div>

                <div className="space-y-4">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="ml-14">
                      <h3 className="font-semibold text-lg mb-2">{item.subtitle}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="bg-primary/5 dark:bg-primary/10 rounded-lg border-2 border-primary/20 p-6 md:p-8 mt-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-3">Contact Us</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
                  please contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-semibold">Email:</span> fcalearn@thebrainbuilders.org
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold">Address:</span> Abuja, Nigeria
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p className="mb-2">Related Policies</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/about" className="underline hover:text-primary transition-colors">
                About Us
              </a>
              <a href="/contacts" className="underline hover:text-primary transition-colors">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
