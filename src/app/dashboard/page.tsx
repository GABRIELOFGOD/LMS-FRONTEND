"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, BookOpen, FileText, Award, TrendingUp } from "lucide-react";
import Link from "next/link";

// Circular Progress Component
const CircularProgress = ({ 
  percentage, 
  size = 120, 
  strokeWidth = 8,
  color = "hsl(var(--primary))"
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-foreground">{percentage}%</span>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  // Mock data - replace with real data from your API
  const user = {
    name: "Admin User",
    bio: "Learning Management System Administrator",
    avatar: "",
    initials: "AU"
  };

  const stats = [
    { title: "Total Users", value: "1,234", icon: Users, trend: "+12%", color: "text-blue-600" },
    { title: "Active Courses", value: "56", icon: BookOpen, trend: "+8%", color: "text-green-600" },
    { title: "Resources", value: "189", icon: FileText, trend: "+23%", color: "text-purple-600" },
    { title: "Certifications", value: "89", icon: Award, trend: "+15%", color: "text-orange-600" },
  ];

  const skillsProgress = [
    { name: "Courses Management", progress: 85, lessons: 45, projects: 12 },
    { name: "User Administration", progress: 92, lessons: 38, projects: 8 },
    { name: "Resource Creation", progress: 67, lessons: 29, projects: 6 },
    { name: "Analytics & Reports", progress: 73, lessons: 32, projects: 4 },
  ];

  const recentSubmissions = [
    { id: 1, title: "Course: Advanced React Patterns", user: "John Doe", date: "2 hours ago", status: "Pending" },
    { id: 2, title: "Resource: JavaScript Best Practices", user: "Jane Smith", date: "1 day ago", status: "Approved" },
    { id: 3, title: "Certification: Web Development", user: "Mike Johnson", date: "2 days ago", status: "Under Review" },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your LMS.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild>
            <Link href="/dashboard/create">Create New</Link>
          </Button>
        </div>
      </div>

      {/* User Profile Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-lg">{user.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-muted-foreground">{user.bio}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>Joined March 2024</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span className="text-green-600">{stat.trend}</span>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Skills Progress Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Skills Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {skillsProgress.map((skill, index) => (
              <div key={index} className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  <CircularProgress 
                    percentage={skill.progress} 
                    size={80} 
                    strokeWidth={6}
                    color={index === 0 ? "hsl(var(--primary))" : `hsl(${200 + index * 40}, 70%, 50%)`}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{skill.name}</h3>
                    <span className="text-sm text-muted-foreground">{skill.progress}% Complete</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>📚 {skill.lessons} Lessons</span>
                    <span>⭐ {skill.projects} Projects</span>
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm" variant="outline">
                      Resume
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/courses">
                <BookOpen className="mr-2 h-4 w-4" />
                Manage Courses
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/users">
                <Users className="mr-2 h-4 w-4" />
                View Users
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/resources">
                <FileText className="mr-2 h-4 w-4" />
                Add Resources
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/certifications">
                <Award className="mr-2 h-4 w-4" />
                Certifications
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Project Submissions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {recentSubmissions.length > 0 ? (
            <div className="space-y-4">
              {recentSubmissions.map((submission) => (
                <div key={submission.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                  <div className="space-y-1">
                    <h4 className="font-medium">{submission.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>by {submission.user}</span>
                      <span>•</span>
                      <span>{submission.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        submission.status === "Approved" ? "default" : 
                        submission.status === "Pending" ? "secondary" : 
                        "outline"
                      }
                    >
                      {submission.status}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No submissions yet</p>
              <p className="text-sm">When users submit projects or assignments, they'll appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
