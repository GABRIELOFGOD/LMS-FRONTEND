"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, BookOpen, FileText, Award, TrendingUp } from "lucide-react";
import Link from "next/link";

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
      <Card className="shadow-sm border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">{user.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{user.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{user.bio}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/50 dark:bg-gray-800/50 px-3 py-2 rounded-lg">
              <CalendarDays className="h-4 w-4" />
              <span>Joined March 2024</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3" />
                <span className="text-green-600">{stat.trend}</span>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Submissions Section - Expanded */}
        <Card className="lg:col-span-2">
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

      {/* System Overview Section */}
      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Active Sessions</span>
              </div>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">Users currently online</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Course Completion</span>
              </div>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground">Average completion rate</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">New Enrollments</span>
              </div>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium">Revenue</span>
              </div>
              <div className="text-2xl font-bold">$12.4k</div>
              <p className="text-xs text-muted-foreground">Monthly recurring</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
