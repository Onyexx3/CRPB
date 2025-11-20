import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import type { ApplicationStats } from "@shared/schema";
import { Users, MapPin, Briefcase, CheckCircle2, Clock, XCircle, FileCheck, UserCheck } from "lucide-react";

export default function AdminStats() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: stats, isLoading } = useQuery<ApplicationStats>({
    queryKey: ["/api/admin/stats"],
  });

  const handleLogout = () => {
    fetch("/api/admin/logout", { method: "POST" })
      .then(() => {
        toast({
          title: "Logged Out",
          description: "You have been logged out successfully.",
        });
        setLocation("/admin/login");
      });
  };

  const sidebarStyle = {
    "--sidebar-width": "16rem",
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    description, 
    color = "primary",
    testId 
  }: { 
    title: string; 
    value: number; 
    icon: any; 
    description?: string;
    color?: string;
    testId?: string;
  }) => (
    <Card className="hover-elevate">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`h-8 w-8 rounded-lg bg-${color}/10 flex items-center justify-center flex-shrink-0`}>
          <Icon className={`h-4 w-4 text-${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" data-testid={testId}>{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar onLogout={handleLogout} />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center p-4 border-b bg-background">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle-stats" />
              <h1 className="text-2xl font-bold" data-testid="text-stats-title">Statistics Dashboard</h1>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            {isLoading ? (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-32" />
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-32" />
                  ))}
                </div>
              </div>
            ) : stats ? (
              <div className="space-y-6">
                {/* Overview Stats */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Overview</h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                      title="Total Applicants"
                      value={stats.total}
                      icon={Users}
                      description="All applications received"
                      testId="stat-total"
                    />
                    <StatCard
                      title="Pending Review"
                      value={stats.pending}
                      icon={Clock}
                      description="Awaiting admin action"
                      color="yellow-500"
                      testId="stat-pending"
                    />
                    <StatCard
                      title="Shortlisted"
                      value={stats.shortlisted}
                      icon={FileCheck}
                      description="Candidates selected for next round"
                      color="blue-500"
                      testId="stat-shortlisted"
                    />
                    <StatCard
                      title="Employed"
                      value={stats.employed}
                      icon={CheckCircle2}
                      description="Successfully onboarded"
                      color="green-500"
                      testId="stat-employed"
                    />
                  </div>
                </div>

                {/* Location Breakdown */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Location Distribution</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <StatCard
                      title="Kaduna"
                      value={stats.kaduna}
                      icon={MapPin}
                      description={`${((stats.kaduna / stats.total) * 100).toFixed(1)}% of total applicants`}
                      testId="stat-kaduna"
                    />
                    <StatCard
                      title="Jos"
                      value={stats.jos}
                      icon={MapPin}
                      description={`${((stats.jos / stats.total) * 100).toFixed(1)}% of total applicants`}
                      testId="stat-jos"
                    />
                  </div>
                </div>

                {/* Research Experience */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Research Experience</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <StatCard
                      title="KII Experience"
                      value={stats.kiiExperienced}
                      icon={Briefcase}
                      description={`${((stats.kiiExperienced / stats.total) * 100).toFixed(1)}% have KII experience`}
                      testId="stat-kii"
                    />
                    <StatCard
                      title="TGD Experience"
                      value={stats.tgdExperienced}
                      icon={Briefcase}
                      description={`${((stats.tgdExperienced / stats.total) * 100).toFixed(1)}% have TGD experience`}
                      testId="stat-tgd"
                    />
                  </div>
                </div>

                {/* Gender Distribution */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Gender Distribution</h2>
                  <div className="grid gap-4 md:grid-cols-3">
                    <StatCard
                      title="Male"
                      value={stats.male}
                      icon={UserCheck}
                      description={`${((stats.male / stats.total) * 100).toFixed(1)}% of applicants`}
                      testId="stat-male"
                    />
                    <StatCard
                      title="Female"
                      value={stats.female}
                      icon={UserCheck}
                      description={`${((stats.female / stats.total) * 100).toFixed(1)}% of applicants`}
                      testId="stat-female"
                    />
                    <StatCard
                      title="Other"
                      value={stats.other}
                      icon={UserCheck}
                      description={`${stats.total > 0 ? ((stats.other / stats.total) * 100).toFixed(1) : 0}% of applicants`}
                      testId="stat-other"
                    />
                  </div>
                </div>

                {/* Status Breakdown */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Application Status Breakdown</h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                      title="Pending"
                      value={stats.pending}
                      icon={Clock}
                      description="Awaiting review"
                      color="yellow-500"
                    />
                    <StatCard
                      title="Shortlisted"
                      value={stats.shortlisted}
                      icon={FileCheck}
                      description="Selected candidates"
                      color="blue-500"
                    />
                    <StatCard
                      title="Employed"
                      value={stats.employed}
                      icon={CheckCircle2}
                      description="Successfully hired"
                      color="green-500"
                    />
                    <StatCard
                      title="Rejected"
                      value={stats.rejected}
                      icon={XCircle}
                      description="Not selected"
                      color="red-500"
                      testId="stat-rejected"
                    />
                  </div>
                </div>

                {/* Summary Card */}
                <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle>Application Summary</CardTitle>
                    <CardDescription>Key insights from the application data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Applications:</span>
                      <span className="font-medium">{stats.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Acceptance Rate:</span>
                      <span className="font-medium">
                        {stats.total > 0 ? ((stats.employed / stats.total) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shortlist Rate:</span>
                      <span className="font-medium">
                        {stats.total > 0 ? (((stats.shortlisted + stats.employed) / stats.total) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Candidates with Both KII & TGD:</span>
                      <span className="font-medium">
                        {/* This would need backend calculation, showing approximation */}
                        {Math.min(stats.kiiExperienced, stats.tgdExperienced)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <Card className="max-w-md">
                  <CardHeader>
                    <CardTitle>No Data Available</CardTitle>
                    <CardDescription>Unable to load statistics</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
