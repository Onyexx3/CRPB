import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { insertApplicantSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Users, ArrowLeft, Upload, FileText, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function ApplicationForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [declared, setDeclared] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  const form = useForm({
    resolver: zodResolver(insertApplicantSchema.omit({ 
      cvFilePath: true, 
      cvFileName: true,
      passportPhotoPath: true,
      passportPhotoName: true 
    })),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      gender: undefined,
      dateOfBirth: "",
      location: undefined,
      address: "",
      highestQualification: "",
      fieldOfStudy: "",
      institution: "",
      graduationYear: "",
      hasKiiExperience: false,
      kiiDescription: "",
      hasTgdExperience: false,
      tgdDescription: "",
      availabilityDate: "",
      availabilityStatus: undefined,
    },
  });

  // Calculate form progress
  const watchFields = form.watch();
  const calculateProgress = () => {
    const requiredFields = [
      "fullName", "email", "phoneNumber", "gender", "dateOfBirth", "location", "address",
      "highestQualification", "fieldOfStudy", "institution", "graduationYear",
      "availabilityDate", "availabilityStatus"
    ];
    const filledFields = requiredFields.filter(field => {
      const value = watchFields[field as keyof typeof watchFields];
      return value !== "" && value !== undefined;
    });
    const cvProgress = cvFile ? 1 : 0;
    const progress = ((filledFields.length + cvProgress) / (requiredFields.length + 1)) * 100;
    setTimeout(() => setFormProgress(Math.round(progress)), 0);
  };

  // Recalculate on field changes
  form.watch(() => calculateProgress());

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiRequest("POST", "/api/applications", data);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "Your application has been received. You can now log in to check your status.",
      });
      form.reset();
      setCvFile(null);
      setPhotoFile(null);
      setDeclared(false);
      setTimeout(() => setLocation("/applicant-login"), 2000);
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: any) => {
    console.log("Form submission triggered", { 
      data, 
      cvFile, 
      declared, 
      formValid: form.formState.isValid,
      errors: form.formState.errors 
    });
    
    // Validate all required fields
    const errors: string[] = [];
    
    if (!data.fullName?.trim()) errors.push("Full Name is required");
    if (!data.email?.trim()) errors.push("Email is required");
    if (!data.phoneNumber?.trim()) errors.push("Phone Number is required");
    if (!data.gender) errors.push("Gender is required");
    if (!data.dateOfBirth) errors.push("Date of Birth is required");
    if (!data.location) errors.push("Location is required");
    if (!data.address?.trim()) errors.push("Address is required");
    if (!data.highestQualification?.trim()) errors.push("Highest Qualification is required");
    if (!data.fieldOfStudy?.trim()) errors.push("Field of Study is required");
    if (!data.institution?.trim()) errors.push("Institution is required");
    if (!data.graduationYear?.trim()) errors.push("Graduation Year is required");
    if (!data.availabilityDate) errors.push("Availability Date is required");
    if (!data.availabilityStatus) errors.push("Availability Status is required");
    
    if (!cvFile) {
      errors.push("CV file is required (PDF format)");
    }
    
    if (!declared) {
      errors.push("You must accept the declaration");
    }
    
    if (errors.length > 0) {
      console.error("Validation errors:", errors);
      toast({
        title: "Please Complete All Required Fields",
        description: errors[0],
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    
    // Add all form fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    });

    // Add files
    formData.append("cv", cvFile);
    if (photoFile) {
      formData.append("photo", photoFile);
    }

    console.log("Submitting form data...", {
      fields: Object.fromEntries(Object.entries(data).filter(([_, v]) => v)),
      hasCV: !!cvFile,
      hasPhoto: !!photoFile
    });
    
    try {
      await submitMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file for your CV.",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "CV file size must be less than 5MB.",
          variant: "destructive",
        });
        return;
      }
      setCvFile(file);
      calculateProgress();
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file for your passport photo.",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Photo file size must be less than 2MB.",
          variant: "destructive",
        });
        return;
      }
      setPhotoFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-40">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="font-semibold">Field Officers Application</span>
          </div>
          <Link href="/applicant-login">
            <Button variant="outline" size="sm" data-testid="button-login-from-form">Login</Button>
          </Link>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="sticky top-16 z-30 bg-background border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Progress</span>
            <Progress value={formProgress} className="flex-1" data-testid="progress-form" />
            <span className="text-sm font-medium text-primary whitespace-nowrap" data-testid="text-progress">{formProgress}%</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3" data-testid="text-form-title">Field Officers Application Form</h1>
          <p className="text-muted-foreground">Cultural & Religious Pluralism Barometer - Plateau & Kaduna States</p>
        </div>

        {/* Error Summary */}
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
              Please fix the following errors:
            </h3>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 ml-4">
              {Object.entries(form.formState.errors).map(([field, error]) => (
                <li key={field}>• {error.message as string}</li>
              ))}
            </ul>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Tell us about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} data-testid="input-fullname" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" {...field} data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="08012345678" {...field} data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-gender">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-dob" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Work Location *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-location">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Kaduna">Kaduna State</SelectItem>
                            <SelectItem value="Jos">Plateau State (Jos)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residential Address *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter your full address" {...field} data-testid="input-address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle>Educational Background</CardTitle>
                <CardDescription>Your academic qualifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="highestQualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Highest Qualification *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bachelor's, Master's, PhD" {...field} data-testid="input-qualification" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fieldOfStudy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field of Study *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Social Sciences, Development Studies" {...field} data-testid="input-field" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="graduationYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Graduation Year *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 2020" {...field} data-testid="input-graduation" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="institution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution *</FormLabel>
                      <FormControl>
                        <Input placeholder="Name of university or institution" {...field} data-testid="input-institution" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Research Experience */}
            <Card>
              <CardHeader>
                <CardTitle>Research Experience</CardTitle>
                <CardDescription>Your experience with qualitative research methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="hasKiiExperience"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-kii"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I have experience with Key Informant Interviews (KII)
                        </FormLabel>
                        <FormDescription>
                          Check if you have conducted or participated in KII research
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("hasKiiExperience") && (
                  <FormField
                    control={form.control}
                    name="kiiDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Describe your KII experience</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please describe your experience with KII, including projects, roles, and outcomes..."
                            className="min-h-[100px]"
                            {...field}
                            data-testid="input-kii-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="hasTgdExperience"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-tgd"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I have experience with Focus Group Discussions (FGD)
                        </FormLabel>
                        <FormDescription>
                          Check if you have conducted or participated in FGD research
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("hasTgdExperience") && (
                  <FormField
                    control={form.control}
                    name="tgdDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Describe your FGD experience</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please describe your experience with FGD, including projects, roles, and outcomes..."
                            className="min-h-[100px]"
                            {...field}
                            data-testid="input-tgd-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
                <CardDescription>When can you start?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="availabilityDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Earliest Start Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-availability-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="availabilityStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Availability Status *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-availability-status">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Immediate">Immediate</SelectItem>
                            <SelectItem value="Within 2 weeks">Within 2 weeks</SelectItem>
                            <SelectItem value="Within a month">Within a month</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* File Uploads */}
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Upload your CV and passport photo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="cv-upload">CV / Resume * (PDF only, max 5MB)</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <Input
                      id="cv-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleCvChange}
                      className="hidden"
                      data-testid="input-cv-file"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("cv-upload")?.click()}
                      className="w-full sm:w-auto"
                      data-testid="button-upload-cv"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {cvFile ? "Change CV" : "Upload CV"}
                    </Button>
                    {cvFile && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span data-testid="text-cv-filename">{cvFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="photo-upload">Passport Photo (Optional, max 2MB)</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <Input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      data-testid="input-photo-file"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("photo-upload")?.click()}
                      className="w-full sm:w-auto"
                      data-testid="button-upload-photo"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {photoFile ? "Change Photo" : "Upload Photo"}
                    </Button>
                    {photoFile && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ImageIcon className="h-4 w-4" />
                        <span data-testid="text-photo-filename">{photoFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Declaration */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="declaration"
                    checked={declared}
                    onCheckedChange={(checked) => setDeclared(checked as boolean)}
                    data-testid="checkbox-declaration"
                  />
                  <div className="space-y-1 leading-none">
                    <Label
                      htmlFor="declaration"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I declare that all information provided is accurate and true *
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      I understand that providing false information may result in disqualification
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="space-y-4">
              {(!declared || !cvFile || Object.keys(form.formState.errors).length > 0) && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                        Before you can submit:
                      </p>
                      <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 ml-2">
                        {Object.keys(form.formState.errors).length > 0 && (
                          <li>• Fix {Object.keys(form.formState.errors).length} form validation error(s)</li>
                        )}
                        {!cvFile && <li>• Upload your CV (PDF format, max 5MB)</li>}
                        {!declared && <li>• Check the declaration checkbox above</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-4">
                <Link href="/">
                  <Button type="button" variant="outline" data-testid="button-cancel">Cancel</Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={submitMutation.isPending}
                  data-testid="button-submit-application"
                  className="min-w-[200px]"
                >
                  {submitMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {submitMutation.isPending ? "Submitting Application..." : "Submit Application"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
