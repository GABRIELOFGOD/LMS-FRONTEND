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
  Plus,
  BarChart3,
  Activity,
  GraduationCap,
  Shield,
  Calendar,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/context/user-context";
import { useState, useEffect } from "react";
import { getAdminStats, AdminStats } from "@/services/common";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user } = useUser();
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAdminStats = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      const stats = await getAdminStats();
      setAdminStats(stats);
      if (showToast && stats) {
        toast.success("Dashboard stats updated successfully");
      }
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
      if (showToast) {
        toast.error("Failed to update dashboard stats");
      }
    } finally {
      setLoading(false);
      if (showToast) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  // Create stats array from API data or show loading/default values
  const stats = adminStats ? [
    { 
      title: "Total Users", 
      value: adminStats.totalUsers.toString(), 
      icon: Users, 
      trend: adminStats.trends ? `+${adminStats.trends.usersThisMonth}% this month` : "Loading...", 
      color: "text-blue-600" 
    },
    { 
      title: "Active Courses", 
      value: adminStats.totalCourses.toString(), 
      icon: BookOpen, 
      trend: adminStats.trends ? `+${adminStats.trends.coursesThisMonth}% this month` : "Loading...", 
      color: "text-green-600" 
    },
    { 
      title: "Published Courses", 
      value: adminStats.publishedCourses.toString(), 
      icon: Award, 
      trend: `${adminStats.publishedCourses} published courses`, 
      color: "text-purple-600" 
    },
    { 
      title: "Certifications", 
      value: adminStats.totalEnrollments.toString(), 
      icon: TrendingUp, 
      trend: adminStats.trends ? `+${adminStats.trends.enrollmentsThisMonth}% this month` : "Loading...", 
      color: "text-orange-600" 
    },
  ] : [
    { title: "Total Users", value: "...", icon: Users, trend: "Loading...", color: "text-blue-600" },
    { title: "Active Courses", value: "...", icon: BookOpen, trend: "Loading...", color: "text-green-600" },
    { title: "Published Courses", value: "...", icon: Award, trend: "Loading...", color: "text-purple-600" },
    { title: "Certifications", value: "...", icon: TrendingUp, trend: "Loading...", color: "text-orange-600" },
  ];

  const quickActions = [
    { title: "Create Course", icon: Plus, href: "/dashboard/create", description: "Add a new course to the platform" },
    { title: "Manage Courses", icon: BookOpen, href: "/dashboard/courses", description: "View, edit, and manage all courses" },
    { title: "Manage Users", icon: Users, href: "/dashboard/users", description: "View and manage platform users" },
    { title: "View Analytics", icon: BarChart3, href: "/dashboard/analytics", description: "Check detailed platform analytics" },
  ];

  // Use recent activity from API or show empty state
  const recentActivity = adminStats?.recentActivity || [];

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back, {user?.fname || 'Admin'}!</h1>
          <p className="text-muted-foreground text-sm md:text-base">Here&apos;s what&apos;s happening with your platform today.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchAdminStats(true)}
            disabled={refreshing}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Stats'}
          </Button>
          <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
            <Link href="/dashboard/courses">
              <BookOpen className="mr-2 h-4 w-4" />
              Manage Courses
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Link>
          </Button>
        </div>
      </div>

      {/* User Profile Section */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-12 w-12 md:h-16 md:w-16">
              <AvatarImage src="" alt={user?.fname || 'Admin'} />
              <AvatarFallback className="text-sm md:text-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {user?.fname?.[0] || 'A'}{user?.lname?.[0] || 'D'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-lg md:text-xl font-semibold">{user?.fname} {user?.lname}</h2>
              <p className="text-muted-foreground text-sm md:text-base">System Administrator</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
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
            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
              <Calendar className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-center sm:text-left">
                Last login: {new Date().toLocaleDateString('en-US', { 
                  weekday: 'short',
                  month: 'short', 
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {loading ? (
          // Loading skeleton for stats
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-16 md:w-24 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-6 md:h-8 w-12 md:w-16 bg-muted animate-pulse rounded mb-2"></div>
                <div className="h-3 w-16 md:w-20 bg-muted animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium truncate">{stat.title}</CardTitle>
                <stat.icon className={`h-3 w-3 md:h-4 md:w-4 ${stat.color} flex-shrink-0`} />
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-2 w-2 md:h-3 md:w-3" />
                  <span className="text-green-600 truncate">{stat.trend}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm md:text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-3 md:p-4 justify-start text-left"
                asChild
              >
                <Link href={action.href}>
                  <div className="flex items-start gap-3">
                    <action.icon className="h-4 w-4 md:h-5 md:w-5 mt-0.5 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm md:text-base truncate">{action.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{action.description}</p>
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
            <CardTitle className="text-sm md:text-base">System Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm font-medium">Server Status</span>
              <Badge variant="default" className="bg-green-500 text-xs">
                <Activity className="mr-1 h-2 w-2 md:h-3 md:w-3" />
                Healthy
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm font-medium">Database</span>
              <Badge variant="default" className="bg-green-500 text-xs">
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm font-medium">Storage</span>
              <Badge variant="outline" className="text-xs">
                78% Used
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm font-medium">Active Users</span>
              <Badge variant="outline" className="text-xs">
                {adminStats ? `${adminStats.totalUsers} Total` : "Loading..."}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-sm md:text-base">Recent Activity</CardTitle>
            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
              <Link href="/dashboard/activities">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-start sm:items-center gap-3 md:gap-4 p-3 rounded-lg border bg-muted/50">
                  <div className="h-6 w-6 md:h-8 md:w-8 bg-muted animate-pulse rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                    <div className="h-3 bg-muted animate-pulse rounded w-1/2"></div>
                  </div>
                  <div className="h-3 w-3 md:h-4 md:w-4 bg-muted animate-pulse rounded flex-shrink-0"></div>
                </div>
              ))
            ) : recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start sm:items-center gap-3 md:gap-4 p-3 rounded-lg border bg-muted/50">
                  <Avatar className="h-6 w-6 md:h-8 md:w-8 flex-shrink-0">
                    <AvatarFallback className="text-xs">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm">
                      <span className="font-medium">{activity.user}</span>
                      {' '}
                      <span className="text-muted-foreground">{activity.action}</span>
                      {' '}
                      <span className="font-medium break-words">{activity.course}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <GraduationCap className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
                </div>
              ))
            ) : (
              // Empty state
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-sm font-medium text-muted-foreground mb-2">No Recent Activity</p>
                <p className="text-xs text-muted-foreground">
                  User activity will appear here as students interact with courses
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
