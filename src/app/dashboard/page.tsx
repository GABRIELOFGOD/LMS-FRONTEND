"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Settings, 
  Plus,
  Eye,
  BarChart3,
  Activity,
  GraduationCap,
  Shield,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/context/user-context";

export default function DashboardPage() {
  const { user } = useUser();

  // Dashboard stats
  const stats = [
    { title: "Total Users", value: "2,847", icon: Users, trend: "+12%", color: "text-blue-600" },
    { title: "Active Courses", value: "47", icon: BookOpen, trend: "+5%", color: "text-green-600" },
    { title: "Certificates Issued", value: "1,234", icon: Award, trend: "+18%", color: "text-purple-600" },
    { title: "Monthly Revenue", value: "$12,847", icon: TrendingUp, trend: "+23%", color: "text-orange-600" },
  ];

  const quickActions = [
    { title: "Create Course", icon: Plus, href: "/dashboard/create", description: "Add a new course to the platform" },
    { title: "Manage Users", icon: Users, href: "/dashboard/users", description: "View and manage platform users" },
    { title: "View Analytics", icon: BarChart3, href: "/dashboard/analytics", description: "Check detailed platform analytics" },
    { title: "System Settings", icon: Settings, href: "/dashboard/settings", description: "Configure system settings" },
  ];

  const recentActivity = [
    { id: 1, user: "John Doe", action: "completed", course: "React Fundamentals", time: "2 hours ago" },
    { id: 2, user: "Jane Smith", action: "enrolled in", course: "JavaScript Advanced", time: "4 hours ago" },
    { id: 3, user: "Mike Johnson", action: "earned certificate for", course: "Web Development", time: "1 day ago" },
    { id: 4, user: "Sarah Wilson", action: "started", course: "Node.js Backend", time: "2 days ago" },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.fname || 'Admin'}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your platform today.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/analytics">
              <Eye className="mr-2 h-4 w-4" />
              View Analytics
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Link>
          </Button>
        </div>
      </div>

      {/* User Profile Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="" alt={user?.fname || 'Admin'} />
              <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {user?.fname?.[0] || 'A'}{user?.lname?.[0] || 'D'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{user?.fname} {user?.lname}</h2>
              <p className="text-muted-foreground">System Administrator</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  <Shield className="mr-1 h-3 w-3" />
                  Admin Access
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <Activity className="mr-1 h-3 w-3" />
                  Online
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Last login: Today, 9:42 AM</span>
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
                <span className="text-green-600">{stat.trend} from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 justify-start text-left"
                asChild
              >
                <Link href={action.href}>
                  <div className="flex items-start gap-3">
                    <action.icon className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <p className="font-medium">{action.title}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* System Overview */}
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Server Status</span>
              <Badge variant="default" className="bg-green-500">
                <Activity className="mr-1 h-3 w-3" />
                Healthy
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database</span>
              <Badge variant="default" className="bg-green-500">
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Storage</span>
              <Badge variant="outline">
                78% Used
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Users</span>
              <Badge variant="outline">
                247 Online
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/activities">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border bg-muted/50">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    {' '}
                    <span className="text-muted-foreground">{activity.action}</span>
                    {' '}
                    <span className="font-medium">{activity.course}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
