import { sql } from "drizzle-orm";
import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Applicants table - stores application submissions
export const applicants = pgTable("applicants", {
  id: serial("id").primaryKey(),
  // Personal Information
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number").notNull(),
  gender: text("gender").notNull(), // Male, Female, Other
  dateOfBirth: text("date_of_birth").notNull(),
  location: text("location").notNull(), // Kaduna or Jos
  address: text("address").notNull(),
  
  // Education
  highestQualification: text("highest_qualification").notNull(),
  fieldOfStudy: text("field_of_study").notNull(),
  institution: text("institution").notNull(),
  graduationYear: text("graduation_year").notNull(),
  
  // Experience
  hasKiiExperience: boolean("has_kii_experience").notNull(), // Key Informant Interview
  kiiDescription: text("kii_description"),
  hasTgdExperience: boolean("has_tgd_experience").notNull(), // Target Group Discussion
  tgdDescription: text("tgd_description"),
  
  // Availability
  availabilityDate: text("availability_date").notNull(),
  availabilityStatus: text("availability_status").notNull(), // Immediate, Within 2 weeks, Within a month
  
  // File uploads
  cvFilePath: text("cv_file_path").notNull(),
  cvFileName: text("cv_file_name").notNull(),
  passportPhotoPath: text("passport_photo_path"),
  passportPhotoName: text("passport_photo_name"),
  
  // Application metadata
  status: text("status").notNull().default("Pending"), // Pending, Shortlisted, Employed, Rejected
  adminNotes: text("admin_notes"),
  resumptionDate: text("resumption_date"),
  resumptionDetails: text("resumption_details"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Status timeline - tracks all status changes
export const statusTimeline = pgTable("status_timeline", {
  id: serial("id").primaryKey(),
  applicantId: serial("applicant_id").notNull().references(() => applicants.id),
  status: text("status").notNull(),
  notes: text("notes"),
  changedBy: text("changed_by").notNull(), // admin email
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas with validation
export const insertApplicantSchema = createInsertSchema(applicants).omit({
  id: true,
  status: true,
  adminNotes: true,
  resumptionDate: true,
  resumptionDetails: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  gender: z.enum(["Male", "Female", "Other"]),
  location: z.enum(["Kaduna", "Jos"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  highestQualification: z.string().min(1, "Highest qualification is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  institution: z.string().min(1, "Institution is required"),
  graduationYear: z.string().min(4, "Graduation year is required"),
  kiiDescription: z.string().optional(),
  tgdDescription: z.string().optional(),
  availabilityDate: z.string().min(1, "Availability date is required"),
  availabilityStatus: z.enum(["Immediate", "Within 2 weeks", "Within a month"]),
  cvFilePath: z.string().min(1, "CV is required"),
  cvFileName: z.string().min(1),
  passportPhotoPath: z.string().optional(),
  passportPhotoName: z.string().optional(),
});

export const insertStatusTimelineSchema = createInsertSchema(statusTimeline).omit({
  id: true,
  createdAt: true,
});

// Update schemas
export const updateApplicantStatusSchema = z.object({
  status: z.enum(["Pending", "Shortlisted", "Employed", "Rejected"]),
  adminNotes: z.string().optional(),
  resumptionDate: z.string().optional(),
  resumptionDetails: z.string().optional(),
});

// Login schemas
export const applicantLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Types
export type Applicant = typeof applicants.$inferSelect;
export type InsertApplicant = z.infer<typeof insertApplicantSchema>;
export type StatusTimeline = typeof statusTimeline.$inferSelect;
export type InsertStatusTimeline = z.infer<typeof insertStatusTimelineSchema>;
export type UpdateApplicantStatus = z.infer<typeof updateApplicantStatusSchema>;
export type ApplicantLogin = z.infer<typeof applicantLoginSchema>;
export type AdminLogin = z.infer<typeof adminLoginSchema>;

// Statistics type
export type ApplicationStats = {
  total: number;
  kaduna: number;
  jos: number;
  kiiExperienced: number;
  tgdExperienced: number;
  pending: number;
  shortlisted: number;
  employed: number;
  rejected: number;
  male: number;
  female: number;
  other: number;
};
