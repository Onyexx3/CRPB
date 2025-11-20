import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { sendApplicationConfirmation, sendStatusUpdate } from "./email";
import { insertApplicantSchema, applicantLoginSchema, adminLoginSchema, updateApplicantStatusSchema } from "@shared/schema";
import * as XLSX from "xlsx";
import { randomUUID } from "crypto";

// Session configuration
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "research-project-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
});

// File upload configuration
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${randomUUID()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

// Type declarations for session
declare module "express-session" {
  interface SessionData {
    applicantId?: number;
    applicantEmail?: string;
    adminEmail?: string;
  }
}

// Middleware to check if applicant is authenticated
function requireApplicantAuth(req: Request, res: Response, next: Function) {
  if (!req.session.applicantId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

// Middleware to check if admin is authenticated
function requireAdminAuth(req: Request, res: Response, next: Function) {
  if (!req.session.adminEmail) {
    return res.status(401).json({ error: "Admin authentication required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(sessionMiddleware);

  // Public routes
  
  // Submit application
  app.post("/api/applications", upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "photo", maxCount: 1 }
  ]), async (req: Request, res: Response) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (!files.cv || files.cv.length === 0) {
        return res.status(400).json({ error: "CV is required" });
      }

      const cvFile = files.cv[0];
      const photoFile = files.photo?.[0];

      // Parse and validate form data
      const formData = {
        ...req.body,
        hasKiiExperience: req.body.hasKiiExperience === "true" || req.body.hasKiiExperience === true,
        hasTgdExperience: req.body.hasTgdExperience === "true" || req.body.hasTgdExperience === true,
        cvFilePath: cvFile.filename,
        cvFileName: cvFile.originalname,
        passportPhotoPath: photoFile?.filename,
        passportPhotoName: photoFile?.originalname,
      };

      const validatedData = insertApplicantSchema.parse(formData);

      // Check if email already exists
      const existing = await storage.getApplicantByEmail(validatedData.email);
      if (existing) {
        // Clean up uploaded files
        fs.unlinkSync(cvFile.path);
        if (photoFile) fs.unlinkSync(photoFile.path);
        return res.status(400).json({ error: "An application with this email already exists" });
      }

      // Create applicant
      const applicant = await storage.createApplicant(validatedData);

      // Send confirmation email
      await sendApplicationConfirmation(applicant);

      res.json({ 
        message: "Application submitted successfully",
        applicantId: applicant.id 
      });
    } catch (error: any) {
      console.error("Application submission error:", error);
      
      // Clean up uploaded files on error
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files.cv) {
        files.cv.forEach(f => fs.existsSync(f.path) && fs.unlinkSync(f.path));
      }
      if (files.photo) {
        files.photo.forEach(f => fs.existsSync(f.path) && fs.unlinkSync(f.path));
      }

      if (error.name === "ZodError") {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Failed to submit application" });
    }
  });

  // Applicant login
  app.post("/api/applicant/login", async (req: Request, res: Response) => {
    try {
      const validatedData = applicantLoginSchema.parse(req.body);
      
      const applicant = await storage.getApplicantByEmailAndPhone(
        validatedData.email,
        validatedData.phoneNumber
      );

      if (!applicant) {
        return res.status(401).json({ error: "Invalid email or phone number combination" });
      }

      req.session.applicantId = applicant.id;
      req.session.applicantEmail = applicant.email;

      res.json({ message: "Login successful" });
    } catch (error: any) {
      console.error("Applicant login error:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Applicant logout
  app.post("/api/applicant/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Applicant dashboard (protected)
  app.get("/api/applicant/dashboard", requireApplicantAuth, async (req: Request, res: Response) => {
    try {
      const applicant = await storage.getApplicantById(req.session.applicantId!);
      if (!applicant) {
        return res.status(404).json({ error: "Applicant not found" });
      }

      const timeline = await storage.getApplicantTimeline(applicant.id);

      res.json({
        applicant,
        timeline,
      });
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      res.status(500).json({ error: "Failed to load dashboard" });
    }
  });

  // Admin login
  app.post("/api/admin/login", async (req: Request, res: Response) => {
    try {
      const validatedData = adminLoginSchema.parse(req.body);
      
      console.log("Admin login attempt:", {
        providedEmail: validatedData.email,
        envEmail: process.env.ADMIN_EMAIL,
        emailMatch: validatedData.email === process.env.ADMIN_EMAIL,
        passwordMatch: validatedData.password === process.env.ADMIN_PASSWORD
      });
      
      // Check against environment variables
      if (
        validatedData.email === process.env.ADMIN_EMAIL &&
        validatedData.password === process.env.ADMIN_PASSWORD
      ) {
        req.session.adminEmail = validatedData.email;
        res.json({ message: "Admin login successful" });
      } else {
        res.status(401).json({ error: "Invalid admin credentials" });
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Admin logout
  app.post("/api/admin/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get all applicants (admin only)
  app.get("/api/admin/applicants", requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const applicants = await storage.getAllApplicants();
      res.json(applicants);
    } catch (error) {
      console.error("Fetch applicants error:", error);
      res.status(500).json({ error: "Failed to fetch applicants" });
    }
  });

  // Update applicant status (admin only)
  app.patch("/api/admin/applicants/:id/status", requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateApplicantStatusSchema.parse(req.body);

      const applicant = await storage.getApplicantById(id);
      if (!applicant) {
        return res.status(404).json({ error: "Applicant not found" });
      }

      const oldStatus = applicant.status;

      // Update status
      await storage.updateApplicantStatus(
        id,
        validatedData.status,
        validatedData.adminNotes,
        validatedData.resumptionDate,
        validatedData.resumptionDetails
      );

      // Create timeline entry
      await storage.createTimelineEntry({
        applicantId: id,
        status: validatedData.status,
        notes: validatedData.adminNotes,
        changedBy: req.session.adminEmail!,
      });

      // Get updated applicant
      const updatedApplicant = await storage.getApplicantById(id);
      
      // Send email notification
      if (updatedApplicant && oldStatus !== validatedData.status) {
        await sendStatusUpdate(updatedApplicant, oldStatus);
      }

      res.json({ message: "Status updated successfully" });
    } catch (error: any) {
      console.error("Status update error:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  // Get statistics (admin only)
  app.get("/api/admin/stats", requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const stats = await storage.getApplicationStats();
      res.json(stats);
    } catch (error) {
      console.error("Stats fetch error:", error);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  // Export to CSV (admin only)
  app.get("/api/admin/export/csv", requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const applicants = await storage.getAllApplicants();
      
      // Apply filters if provided
      let filtered = applicants;
      const { search, location, status, gender, kii, tgd } = req.query;
      
      if (search) {
        const searchLower = (search as string).toLowerCase();
        filtered = filtered.filter(a => 
          a.fullName.toLowerCase().includes(searchLower) ||
          a.email.toLowerCase().includes(searchLower) ||
          a.phoneNumber.includes(searchLower)
        );
      }
      if (location) filtered = filtered.filter(a => a.location === location);
      if (status) filtered = filtered.filter(a => a.status === status);
      if (gender) filtered = filtered.filter(a => a.gender === gender);
      if (kii === "yes") filtered = filtered.filter(a => a.hasKiiExperience);
      if (kii === "no") filtered = filtered.filter(a => !a.hasKiiExperience);
      if (tgd === "yes") filtered = filtered.filter(a => a.hasTgdExperience);
      if (tgd === "no") filtered = filtered.filter(a => !a.hasTgdExperience);

      // Convert to CSV
      const headers = [
        "ID", "Name", "Email", "Phone", "Gender", "Location", "Qualification",
        "Field of Study", "Institution", "Graduation Year", "KII Experience",
        "TGD Experience", "Availability", "Status", "Applied Date"
      ];
      
      const rows = filtered.map(a => [
        a.id,
        a.fullName,
        a.email,
        a.phoneNumber,
        a.gender,
        a.location,
        a.highestQualification,
        a.fieldOfStudy,
        a.institution,
        a.graduationYear,
        a.hasKiiExperience ? "Yes" : "No",
        a.hasTgdExperience ? "Yes" : "No",
        a.availabilityStatus,
        a.status,
        new Date(a.createdAt).toLocaleDateString(),
      ]);

      const csv = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(","))
        .join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=applicants.csv");
      res.send(csv);
    } catch (error) {
      console.error("CSV export error:", error);
      res.status(500).json({ error: "Failed to export CSV" });
    }
  });

  // Export to Excel (admin only)
  app.get("/api/admin/export/excel", requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const applicants = await storage.getAllApplicants();
      
      // Apply filters (same as CSV)
      let filtered = applicants;
      const { search, location, status, gender, kii, tgd } = req.query;
      
      if (search) {
        const searchLower = (search as string).toLowerCase();
        filtered = filtered.filter(a => 
          a.fullName.toLowerCase().includes(searchLower) ||
          a.email.toLowerCase().includes(searchLower) ||
          a.phoneNumber.includes(searchLower)
        );
      }
      if (location) filtered = filtered.filter(a => a.location === location);
      if (status) filtered = filtered.filter(a => a.status === status);
      if (gender) filtered = filtered.filter(a => a.gender === gender);
      if (kii === "yes") filtered = filtered.filter(a => a.hasKiiExperience);
      if (kii === "no") filtered = filtered.filter(a => !a.hasKiiExperience);
      if (tgd === "yes") filtered = filtered.filter(a => a.hasTgdExperience);
      if (tgd === "no") filtered = filtered.filter(a => !a.hasTgdExperience);

      // Convert to Excel
      const data = filtered.map(a => ({
        ID: a.id,
        Name: a.fullName,
        Email: a.email,
        Phone: a.phoneNumber,
        Gender: a.gender,
        Location: a.location,
        Qualification: a.highestQualification,
        "Field of Study": a.fieldOfStudy,
        Institution: a.institution,
        "Graduation Year": a.graduationYear,
        "KII Experience": a.hasKiiExperience ? "Yes" : "No",
        "TGD Experience": a.hasTgdExperience ? "Yes" : "No",
        Availability: a.availabilityStatus,
        Status: a.status,
        "Applied Date": new Date(a.createdAt).toLocaleDateString(),
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Applicants");
      
      const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", "attachment; filename=applicants.xlsx");
      res.send(buffer);
    } catch (error) {
      console.error("Excel export error:", error);
      res.status(500).json({ error: "Failed to export Excel" });
    }
  });

  // Serve uploaded files (protected - requires authentication)
  app.get("/api/files/:filename", async (req: Request, res: Response) => {
    // Check if user is authenticated (either applicant or admin)
    if (!req.session.applicantId && !req.session.adminEmail) {
      return res.status(401).json({ error: "Authentication required to access files" });
    }

    const filePath = path.join(uploadsDir, req.params.filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // If applicant, verify the file belongs to them
    if (req.session.applicantId && !req.session.adminEmail) {
      const applicant = await storage.getApplicantById(req.session.applicantId);
      if (!applicant) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Check if this file belongs to the applicant
      const isOwnFile = applicant.cvFilePath === req.params.filename || 
                       applicant.passportPhotoPath === req.params.filename;
      
      if (!isOwnFile) {
        return res.status(403).json({ error: "Access denied" });
      }
    }

    // Admin can access any file
    res.sendFile(filePath);
  });

  const httpServer = createServer(app);
  return httpServer;
}
