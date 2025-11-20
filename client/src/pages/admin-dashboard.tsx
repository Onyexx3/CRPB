import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Applicant, UpdateApplicantStatus } from "@shared/schema";
import { Search, Download, Eye, Filter, X, Loader2, FileDown } from "lucide-react";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [kiiFilter, setKiiFilter] = useState<string>("all");
  const [fgdFilter, setFgdFilter] = useState<string>("all");
  
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  
  const [newStatus, setNewStatus] = useState<string>("");
  const [adminNotes, setAdminNotes] = useState("");
  const [resumptionDate, setResumptionDate] = useState("");
  const [resumptionDetails, setResumptionDetails] = useState("");

  const { data: applicants, isLoading } = useQuery<Applicant[]>({
    queryKey: ["/api/admin/applicants"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateApplicantStatus }) => {
      return await apiRequest("PATCH", `/api/admin/applicants/${id}/status`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applicants"] });
      setStatusDialogOpen(false);
      toast({
        title: "Status Updated",
        description: "The applicant status has been updated and an email notification has been sent.",
      });
      resetStatusForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const exportMutation = useMutation({
    mutationFn: async (format: "csv" | "excel") => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (locationFilter !== "all") params.append("location", locationFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (genderFilter !== "all") params.append("gender", genderFilter);
      if (kiiFilter !== "all") params.append("kii", kiiFilter);
      if (fgdFilter !== "all") params.append("fgd", fgdFilter);
      
      const response = await fetch(`/api/admin/export/${format}?${params.toString()}`);
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `applicants-${format}-${Date.now()}.${format === "csv" ? "csv" : "xlsx"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({
        title: "Export Successful",
        description: "Your file has been downloaded.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive",
      });
    },
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

  const resetStatusForm = () => {
    setNewStatus("");
    setAdminNotes("");
    setResumptionDate("");
    setResumptionDetails("");
    setSelectedApplicant(null);
  };

  const openStatusDialog = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setNewStatus(applicant.status);
    setAdminNotes(applicant.adminNotes || "");
    setResumptionDate(applicant.resumptionDate || "");
    setResumptionDetails(applicant.resumptionDetails || "");
    setStatusDialogOpen(true);
  };

  const openDetailDialog = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setDetailDialogOpen(true);
  };

  const handleStatusUpdate = () => {
    if (!selectedApplicant || !newStatus) return;
    
    updateStatusMutation.mutate({
      id: selectedApplicant.id,
      data: {
        status: newStatus as any,
        adminNotes: adminNotes || undefined,
        resumptionDate: resumptionDate || undefined,
        resumptionDetails: resumptionDetails || undefined,
      },
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocationFilter("all");
    setStatusFilter("all");
    setGenderFilter("all");
    setKiiFilter("all");
    setFgdFilter("all");
  };

  const filteredApplicants = applicants?.filter((applicant) => {
    const matchesSearch = !searchQuery || 
      applicant.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = locationFilter === "all" || applicant.location === locationFilter;
    const matchesStatus = statusFilter === "all" || applicant.status === statusFilter;
    const matchesGender = genderFilter === "all" || applicant.gender === genderFilter;
    const hasKii = kiiFilter === "all" || (kiiFilter === "yes" && applicant.hasKiiExperience) || (kiiFilter === "no" && !applicant.hasKiiExperience);
    const hasFgd = fgdFilter === "all" || (fgdFilter === "yes" && applicant.hasTgdExperience) || (fgdFilter === "no" && !applicant.hasTgdExperience);
    
    return matchesSearch && matchesLocation && matchesStatus && matchesGender && hasKii && hasFgd;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      case "Shortlisted": return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "Employed": return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "Rejected": return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
  };

  const sidebarStyle = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar onLogout={handleLogout} />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b bg-background">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h1 className="text-2xl font-bold" data-testid="text-dashboard-title">Applicant Management</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportMutation.mutate("csv")}
                disabled={exportMutation.isPending}
                data-testid="button-export-csv"
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportMutation.mutate("excel")}
                disabled={exportMutation.isPending}
                data-testid="button-export-excel"
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            {/* Filters */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  {(searchQuery || locationFilter !== "all" || statusFilter !== "all" || genderFilter !== "all" || kiiFilter !== "all" || fgdFilter !== "all") && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
                      <X className="mr-2 h-4 w-4" />
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  <div className="lg:col-span-2">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Name, email, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                        data-testid="input-search"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger id="location" data-testid="select-location-filter">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="Kaduna">Kaduna State</SelectItem>
                        <SelectItem value="Jos">Plateau State (Jos)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger id="status" data-testid="select-status-filter">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="Employed">Employed</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={genderFilter} onValueChange={setGenderFilter}>
                      <SelectTrigger id="gender" data-testid="select-gender-filter">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Genders</SelectItem>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="kii">KII Experience</Label>
                    <Select value={kiiFilter} onValueChange={setKiiFilter}>
                      <SelectTrigger id="kii" data-testid="select-kii-filter">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="fgd">FGD Experience</Label>
                    <Select value={fgdFilter} onValueChange={setFgdFilter}>
                      <SelectTrigger id="fgd" data-testid="select-fgd-filter">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle>Applicants ({filteredApplicants.length})</CardTitle>
                <CardDescription>
                  Manage applications and update statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : filteredApplicants.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No applicants found matching your filters
                  </div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Gender</TableHead>
                          <TableHead>KII</TableHead>
                          <TableHead>FGD</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Applied</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredApplicants.map((applicant) => (
                          <TableRow key={applicant.id} data-testid={`row-applicant-${applicant.id}`}>
                            <TableCell className="font-medium">{applicant.fullName}</TableCell>
                            <TableCell>{applicant.location}</TableCell>
                            <TableCell>{applicant.gender}</TableCell>
                            <TableCell>
                              <Badge variant={applicant.hasKiiExperience ? "default" : "secondary"} className="text-xs">
                                {applicant.hasKiiExperience ? "Yes" : "No"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={applicant.hasTgdExperience ? "default" : "secondary"} className="text-xs">
                                {applicant.hasTgdExperience ? "Yes" : "No"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(applicant.status)}>
                                {applicant.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {format(new Date(applicant.createdAt), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openDetailDialog(applicant)}
                                  data-testid={`button-view-${applicant.id}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openStatusDialog(applicant)}
                                  data-testid={`button-status-${applicant.id}`}
                                >
                                  Update Status
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
            <DialogDescription>
              Change status for {selectedApplicant?.fullName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-status">Status *</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger id="new-status" data-testid="select-new-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="Employed">Employed</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="admin-notes">Admin Notes</Label>
              <Textarea
                id="admin-notes"
                placeholder="Add notes for the applicant..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                data-testid="input-admin-notes"
              />
            </div>

            {(newStatus === "Shortlisted" || newStatus === "Employed") && (
              <>
                <div>
                  <Label htmlFor="resumption-date">Resumption Date</Label>
                  <Input
                    id="resumption-date"
                    type="date"
                    value={resumptionDate}
                    onChange={(e) => setResumptionDate(e.target.value)}
                    data-testid="input-resumption-date"
                  />
                </div>

                <div>
                  <Label htmlFor="resumption-details">Resumption Details</Label>
                  <Textarea
                    id="resumption-details"
                    placeholder="Provide details about resumption, location, what to bring, etc..."
                    value={resumptionDetails}
                    onChange={(e) => setResumptionDetails(e.target.value)}
                    rows={3}
                    data-testid="input-resumption-details"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setStatusDialogOpen(false)} data-testid="button-cancel-status">
                Cancel
              </Button>
              <Button
                onClick={handleStatusUpdate}
                disabled={!newStatus || updateStatusMutation.isPending}
                data-testid="button-save-status"
              >
                {updateStatusMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Complete application information for {selectedApplicant?.fullName}
            </DialogDescription>
          </DialogHeader>
          {selectedApplicant && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Email:</span> {selectedApplicant.email}</div>
                  <div><span className="text-muted-foreground">Phone:</span> {selectedApplicant.phoneNumber}</div>
                  <div><span className="text-muted-foreground">Gender:</span> {selectedApplicant.gender}</div>
                  <div><span className="text-muted-foreground">DOB:</span> {format(new Date(selectedApplicant.dateOfBirth), "MMM d, yyyy")}</div>
                  <div className="col-span-2"><span className="text-muted-foreground">Address:</span> {selectedApplicant.address}</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Education</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Qualification:</span> {selectedApplicant.highestQualification}</div>
                  <div><span className="text-muted-foreground">Field:</span> {selectedApplicant.fieldOfStudy}</div>
                  <div><span className="text-muted-foreground">Institution:</span> {selectedApplicant.institution}</div>
                  <div><span className="text-muted-foreground">Graduated:</span> {selectedApplicant.graduationYear}</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Research Experience</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-muted-foreground">KII Experience:</span>
                      <Badge variant={selectedApplicant.hasKiiExperience ? "default" : "secondary"}>
                        {selectedApplicant.hasKiiExperience ? "Yes" : "No"}
                      </Badge>
                    </div>
                    {selectedApplicant.kiiDescription && (
                      <p className="text-muted-foreground pl-4">{selectedApplicant.kiiDescription}</p>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-muted-foreground">FGD Experience:</span>
                      <Badge variant={selectedApplicant.hasTgdExperience ? "default" : "secondary"}>
                        {selectedApplicant.hasTgdExperience ? "Yes" : "No"}
                      </Badge>
                    </div>
                    {selectedApplicant.tgdDescription && (
                      <p className="text-muted-foreground pl-4">{selectedApplicant.tgdDescription}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Availability</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Start Date:</span> {format(new Date(selectedApplicant.availabilityDate), "MMM d, yyyy")}</div>
                  <div><span className="text-muted-foreground">Status:</span> {selectedApplicant.availabilityStatus}</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Documents</h3>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/api/files/${selectedApplicant.cvFilePath}`, "_blank")}
                    data-testid="button-download-applicant-cv"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download CV
                  </Button>
                  {selectedApplicant.passportPhotoPath && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/api/files/${selectedApplicant.passportPhotoPath}`, "_blank")}
                      data-testid="button-view-applicant-photo"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Photo
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
