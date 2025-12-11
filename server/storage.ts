import { drizzle } from "drizzle-orm/node-postgres";
import { eq, desc } from "drizzle-orm";
import pkg from "pg";
const Pool = pkg.Pool;
import { 
  type Applicant, 
  type InsertApplicant, 
  type StatusTimeline, 
  type InsertStatusTimeline,
  type ApplicationStats,
  applicants,
  statusTimeline
} from "@shared/schema";
import path from "path";
import fs from "fs";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
});

// Create Drizzle instance
const db = drizzle(pool);

// Initialize database schema and uploads directory
async function initializeDatabase() {
  // Create applicants table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS applicants (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone_number TEXT NOT NULL,
      gender TEXT NOT NULL,
      date_of_birth TEXT NOT NULL,
      location TEXT NOT NULL,
      address TEXT NOT NULL,
      highest_qualification TEXT NOT NULL,
      field_of_study TEXT NOT NULL,
      institution TEXT NOT NULL,
      graduation_year TEXT NOT NULL,
      has_kii_experience BOOLEAN NOT NULL,
      kii_description TEXT,
      has_tgd_experience BOOLEAN NOT NULL,
      tgd_description TEXT,
      availability_date TEXT NOT NULL,
      availability_status TEXT NOT NULL,
      cv_file_path TEXT NOT NULL,
      cv_file_name TEXT NOT NULL,
      passport_photo_path TEXT,
      passport_photo_name TEXT,
      status TEXT NOT NULL DEFAULT 'Pending',
      admin_notes TEXT,
      resumption_date TEXT,
      resumption_details TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  // Create status_timeline table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS status_timeline (
      id SERIAL PRIMARY KEY,
      applicant_id INTEGER NOT NULL REFERENCES applicants(id),
      status TEXT NOT NULL,
      notes TEXT,
      changed_by TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  // Create uploads directory
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

export interface IStorage {
  // Applicant operations
  createApplicant(applicant: InsertApplicant): Promise<Applicant>;
  getApplicantById(id: number): Promise<Applicant | undefined>;
  getApplicantByEmail(email: string): Promise<Applicant | undefined>;
  getApplicantByEmailAndPhone(email: string, phoneNumber: string): Promise<Applicant | undefined>;
  getAllApplicants(): Promise<Applicant[]>;
  updateApplicantStatus(id: number, status: string, adminNotes?: string, resumptionDate?: string, resumptionDetails?: string): Promise<void>;
  
  // Timeline operations
  createTimelineEntry(entry: InsertStatusTimeline): Promise<StatusTimeline>;
  getApplicantTimeline(applicantId: number): Promise<StatusTimeline[]>;
  
  // Statistics
  getApplicationStats(): Promise<ApplicationStats>;
}

export class PostgreSQLStorage implements IStorage {
  constructor() {
    initializeDatabase().catch(err => {
      console.error("Failed to initialize database:", err);
      throw err;
    });
  }

  async createApplicant(applicant: InsertApplicant): Promise<Applicant> {
    const [newApplicant] = await db.insert(applicants).values({
      fullName: applicant.fullName,
      email: applicant.email,
      phoneNumber: applicant.phoneNumber,
      gender: applicant.gender,
      dateOfBirth: applicant.dateOfBirth,
      location: applicant.location,
      address: applicant.address,
      highestQualification: applicant.highestQualification,
      fieldOfStudy: applicant.fieldOfStudy,
      institution: applicant.institution,
      graduationYear: applicant.graduationYear,
      hasKiiExperience: applicant.hasKiiExperience,
      kiiDescription: applicant.kiiDescription || null,
      hasTgdExperience: applicant.hasTgdExperience,
      tgdDescription: applicant.tgdDescription || null,
      availabilityDate: applicant.availabilityDate,
      availabilityStatus: applicant.availabilityStatus,
      cvFilePath: applicant.cvFilePath,
      cvFileName: applicant.cvFileName,
      passportPhotoPath: applicant.passportPhotoPath || null,
      passportPhotoName: applicant.passportPhotoName || null,
    }).returning();
    
    // Create initial timeline entry
    await this.createTimelineEntry({
      applicantId: newApplicant.id,
      status: "Pending",
      notes: "Application submitted",
      changedBy: "System",
    });

    return newApplicant;
  }

  async getApplicantById(id: number): Promise<Applicant | undefined> {
    const [applicant] = await db.select().from(applicants).where(eq(applicants.id, id));
    return applicant;
  }

  async getApplicantByEmail(email: string): Promise<Applicant | undefined> {
    const [applicant] = await db.select().from(applicants).where(eq(applicants.email, email));
    return applicant;
  }

  async getApplicantByEmailAndPhone(email: string, phoneNumber: string): Promise<Applicant | undefined> {
    const result = await pool.query(
      'SELECT * FROM applicants WHERE email = $1 AND phone_number = $2',
      [email, phoneNumber]
    );
    return result.rows[0] ? this.mapRowToApplicant(result.rows[0]) : undefined;
  }

  async getAllApplicants(): Promise<Applicant[]> {
    return await db.select().from(applicants).orderBy(desc(applicants.createdAt));
  }

  async updateApplicantStatus(
    id: number, 
    status: string, 
    adminNotes?: string, 
    resumptionDate?: string, 
    resumptionDetails?: string
  ): Promise<void> {
    await db.update(applicants)
      .set({
        status,
        adminNotes: adminNotes || null,
        resumptionDate: resumptionDate || null,
        resumptionDetails: resumptionDetails || null,
        updatedAt: new Date(),
      })
      .where(eq(applicants.id, id));
  }

  async createTimelineEntry(entry: InsertStatusTimeline): Promise<StatusTimeline> {
    const [newEntry] = await db.insert(statusTimeline).values({
      applicantId: entry.applicantId,
      status: entry.status,
      notes: entry.notes || null,
      changedBy: entry.changedBy,
    }).returning();
    
    return newEntry;
  }

  async getApplicantTimeline(applicantId: number): Promise<StatusTimeline[]> {
    return await db.select()
      .from(statusTimeline)
      .where(eq(statusTimeline.applicantId, applicantId))
      .orderBy(desc(statusTimeline.createdAt));
  }

  async getApplicationStats(): Promise<ApplicationStats> {
    const allApplicants = await db.select().from(applicants);
    
    return {
      total: allApplicants.length,
      kaduna: allApplicants.filter(a => a.location === "Kaduna").length,
      jos: allApplicants.filter(a => a.location === "Jos").length,
      kiiExperienced: allApplicants.filter(a => a.hasKiiExperience).length,
      tgdExperienced: allApplicants.filter(a => a.hasTgdExperience).length,
      pending: allApplicants.filter(a => a.status === "Pending").length,
      shortlisted: allApplicants.filter(a => a.status === "Shortlisted").length,
      employed: allApplicants.filter(a => a.status === "Employed").length,
      rejected: allApplicants.filter(a => a.status === "Rejected").length,
      male: allApplicants.filter(a => a.gender === "Male").length,
      female: allApplicants.filter(a => a.gender === "Female").length,
      other: allApplicants.filter(a => a.gender === "Other").length,
    };
  }

  private mapRowToApplicant(row: any): Applicant {
    return {
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      phoneNumber: row.phone_number,
      gender: row.gender,
      dateOfBirth: row.date_of_birth,
      location: row.location,
      address: row.address,
      highestQualification: row.highest_qualification,
      fieldOfStudy: row.field_of_study,
      institution: row.institution,
      graduationYear: row.graduation_year,
      hasKiiExperience: row.has_kii_experience,
      kiiDescription: row.kii_description,
      hasTgdExperience: row.has_tgd_experience,
      tgdDescription: row.tgd_description,
      availabilityDate: row.availability_date,
      availabilityStatus: row.availability_status,
      cvFilePath: row.cv_file_path,
      cvFileName: row.cv_file_name,
      passportPhotoPath: row.passport_photo_path,
      passportPhotoName: row.passport_photo_name,
      status: row.status,
      adminNotes: row.admin_notes,
      resumptionDate: row.resumption_date,
      resumptionDetails: row.resumption_details,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export const storage = new PostgreSQLStorage();
