import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import type { Applicant, StatusTimeline } from "@shared/schema";
import { FileText, Download, LogOut, CheckCircle2, Clock, XCircle, Calendar, FileCheck, AlertCircle, Users } from "lucide-react";
import { format } from "date-fns";

type DashboardData = {
  applicant: Applicant;
  timeline: StatusTimeline[];
};

export default function ApplicantDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["/api/applicant/dashboard"],
  });

  const handleLogout = () => {
    // Call logout API
    fetch("/api/applicant/logout", { method: "POST" })
      .then(() => {
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
        });
        setLocation("/applicant-login");
      });
  };

  const handleDownloadCV = () => {
    if (data?.applicant.cvFilePath) {
      window.open(`/api/files/${data.applicant.cvFilePath}`, "_blank");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      case "Shortlisted":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "Employed":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "Rejected":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />;
      case "Shortlisted":
        return <FileCheck className="h-4 w-4" />;
      case "Employed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "Rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-9 w-24" />
          </div>
        </header>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-96" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Dashboard</CardTitle>
            <CardDescription>
              {error instanceof Error ? error.message : "Unable to load your application data."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button variant="outline" onClick={() => setLocation("/applicant-login")} data-testid="button-back-login">
              Back to Login
            </Button>
            <Button onClick={() => window.location.reload()} data-testid="button-retry">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { applicant, timeline } = data;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-40">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="font-semibold">My Application</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} data-testid="button-logout">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-welcome">Welcome, {applicant.fullName}</h1>
          <p className="text-muted-foreground">Track your application status and access your documents</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Application Status</CardTitle>
                  <Badge className={getStatusColor(applicant.status)} data-testid="badge-status">
                    {getStatusIcon(applicant.status)}
                    <span className="ml-1">{applicant.status}</span>
                  </Badge>
                </div>
                <CardDescription>
                  Submitted on {format(new Date(applicant.createdAt), "MMMM d, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {applicant.adminNotes && (
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-primary" />
                      Admin Notes
                    </h4>
                    <p className="text-sm text-muted-foreground" data-testid="text-admin-notes">{applicant.adminNotes}</p>
                  </div>
                )}

                {(applicant.status === "Shortlisted" || applicant.status === "Employed") && applicant.resumptionDate && (
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Resumption Details
                    </h4>
                    <p className="text-sm mb-1">
                      <strong>Date:</strong>{" "}
                      <span data-testid="text-resumption-date">
                        {format(new Date(applicant.resumptionDate), "MMMM d, yyyy")}
                      </span>
                    </p>
                    {applicant.resumptionDetails && (
                      <p className="text-sm text-muted-foreground" data-testid="text-resumption-details">
                        {applicant.resumptionDetails}
                      </p>
                    )}
                  </div>
                )}

                {applicant.status === "Pending" && (
                  <div className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                    <p className="text-sm text-muted-foreground">
                      Your application is currently under review. We will notify you via email once there's an update.
                    </p>
                  </div>
                )}

                {applicant.status === "Rejected" && (
                  <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                    <p className="text-sm text-muted-foreground">
                      We appreciate your interest in this research project. Unfortunately, your application was not selected at this time.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Application Timeline</CardTitle>
                <CardDescription>History of your application status changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeline.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No status changes yet
                    </p>
                  ) : (
                    timeline.map((item, index) => (
                      <div key={item.id} className="flex gap-4" data-testid={`timeline-item-${index}`}>
                        <div className="flex flex-col items-center">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getStatusColor(item.status)}`}>
                            {getStatusIcon(item.status)}
                          </div>
                          {index < timeline.length - 1 && (
                            <div className="w-0.5 h-full bg-border mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-sm">{item.status}</p>
                            <p className="text-xs text-muted-foreground" data-testid={`timeline-date-${index}`}>
                              {format(new Date(item.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                          {item.notes && (
                            <p className="text-sm text-muted-foreground" data-testid={`timeline-notes-${index}`}>
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium" data-testid="text-email">{applicant.email}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium" data-testid="text-phone">{applicant.phoneNumber}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-muted-foreground">Location Preference</p>
                  <p className="font-medium" data-testid="text-location">{applicant.location}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-muted-foreground">Highest Qualification</p>
                  <p className="font-medium" data-testid="text-qualification">{applicant.highestQualification}</p>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleDownloadCV}
                  data-testid="button-download-cv"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download CV
                </Button>
                {applicant.passportPhotoPath && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(`/api/files/${applicant.passportPhotoPath}`, "_blank")}
                    data-testid="button-view-photo"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View Passport Photo
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Research Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Research Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium mb-1">KII Experience</p>
                  <Badge variant={applicant.hasKiiExperience ? "default" : "secondary"} className="text-xs">
                    {applicant.hasKiiExperience ? "Yes" : "No"}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <p className="font-medium mb-1">TGD Experience</p>
                  <Badge variant={applicant.hasTgdExperience ? "default" : "secondary"} className="text-xs">
                    {applicant.hasTgdExperience ? "Yes" : "No"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
