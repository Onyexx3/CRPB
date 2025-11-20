import Database from "better-sqlite3";
import { 
  type Applicant, 
  type InsertApplicant, 
  type StatusTimeline, 
  type InsertStatusTimeline,
  type ApplicationStats
} from "@shared/schema";
import path from "path";
import fs from "fs";

const dbPath = path.join(process.cwd(), "database.sqlite");
const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Initialize database schema
function initializeDatabase() {
  // Create applicants table
  db.exec(`
    CREATE TABLE IF NOT EXISTS applicants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      has_kii_experience INTEGER NOT NULL,
      kii_description TEXT,
      has_tgd_experience INTEGER NOT NULL,
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
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create status_timeline table
  db.exec(`
    CREATE TABLE IF NOT EXISTS status_timeline (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      applicant_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      changed_by TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (applicant_id) REFERENCES applicants(id)
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

export class SQLiteStorage implements IStorage {
  constructor() {
    initializeDatabase();
  }

  async createApplicant(applicant: InsertApplicant): Promise<Applicant> {
    const stmt = db.prepare(`
      INSERT INTO applicants (
        full_name, email, phone_number, gender, date_of_birth, location, address,
        highest_qualification, field_of_study, institution, graduation_year,
        has_kii_experience, kii_description, has_tgd_experience, tgd_description,
        availability_date, availability_status, cv_file_path, cv_file_name,
        passport_photo_path, passport_photo_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      applicant.fullName,
      applicant.email,
      applicant.phoneNumber,
      applicant.gender,
      applicant.dateOfBirth,
      applicant.location,
      applicant.address,
      applicant.highestQualification,
      applicant.fieldOfStudy,
      applicant.institution,
      applicant.graduationYear,
      applicant.hasKiiExperience ? 1 : 0,
      applicant.kiiDescription || null,
      applicant.hasTgdExperience ? 1 : 0,
      applicant.tgdDescription || null,
      applicant.availabilityDate,
      applicant.availabilityStatus,
      applicant.cvFilePath,
      applicant.cvFileName,
      applicant.passportPhotoPath || null,
      applicant.passportPhotoName || null
    );

    const id = result.lastInsertRowid as number;
    
    // Create initial timeline entry
    await this.createTimelineEntry({
      applicantId: id,
      status: "Pending",
      notes: "Application submitted",
      changedBy: "System",
    });

    return this.getApplicantById(id) as Promise<Applicant>;
  }

  async getApplicantById(id: number): Promise<Applicant | undefined> {
    const stmt = db.prepare(`SELECT * FROM applicants WHERE id = ?`);
    const row = stmt.get(id) as any;
    
    if (!row) return undefined;
    
    return this.mapRowToApplicant(row);
  }

  async getApplicantByEmail(email: string): Promise<Applicant | undefined> {
    const stmt = db.prepare(`SELECT * FROM applicants WHERE email = ?`);
    const row = stmt.get(email) as any;
    
    if (!row) return undefined;
    
    return this.mapRowToApplicant(row);
  }

  async getApplicantByEmailAndPhone(email: string, phoneNumber: string): Promise<Applicant | undefined> {
    const stmt = db.prepare(`SELECT * FROM applicants WHERE email = ? AND phone_number = ?`);
    const row = stmt.get(email, phoneNumber) as any;
    
    if (!row) return undefined;
    
    return this.mapRowToApplicant(row);
  }

  async getAllApplicants(): Promise<Applicant[]> {
    const stmt = db.prepare(`SELECT * FROM applicants ORDER BY created_at DESC`);
    const rows = stmt.all() as any[];
    
    return rows.map(row => this.mapRowToApplicant(row));
  }

  async updateApplicantStatus(
    id: number, 
    status: string, 
    adminNotes?: string, 
    resumptionDate?: string, 
    resumptionDetails?: string
  ): Promise<void> {
    const stmt = db.prepare(`
      UPDATE applicants 
      SET status = ?, admin_notes = ?, resumption_date = ?, resumption_details = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(status, adminNotes || null, resumptionDate || null, resumptionDetails || null, id);
  }

  async createTimelineEntry(entry: InsertStatusTimeline): Promise<StatusTimeline> {
    const stmt = db.prepare(`
      INSERT INTO status_timeline (applicant_id, status, notes, changed_by)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      entry.applicantId,
      entry.status,
      entry.notes || null,
      entry.changedBy
    );

    const id = result.lastInsertRowid as number;
    
    const selectStmt = db.prepare(`SELECT * FROM status_timeline WHERE id = ?`);
    const row = selectStmt.get(id) as any;
    
    return this.mapRowToTimeline(row);
  }

  async getApplicantTimeline(applicantId: number): Promise<StatusTimeline[]> {
    const stmt = db.prepare(`
      SELECT * FROM status_timeline 
      WHERE applicant_id = ? 
      ORDER BY created_at DESC
    `);
    const rows = stmt.all(applicantId) as any[];
    
    return rows.map(row => this.mapRowToTimeline(row));
  }

  async getApplicationStats(): Promise<ApplicationStats> {
    const allStmt = db.prepare(`SELECT * FROM applicants`);
    const applicants = allStmt.all() as any[];
    
    return {
      total: applicants.length,
      kaduna: applicants.filter(a => a.location === "Kaduna").length,
      jos: applicants.filter(a => a.location === "Jos").length,
      kiiExperienced: applicants.filter(a => a.has_kii_experience === 1).length,
      tgdExperienced: applicants.filter(a => a.has_tgd_experience === 1).length,
      pending: applicants.filter(a => a.status === "Pending").length,
      shortlisted: applicants.filter(a => a.status === "Shortlisted").length,
      employed: applicants.filter(a => a.status === "Employed").length,
      rejected: applicants.filter(a => a.status === "Rejected").length,
      male: applicants.filter(a => a.gender === "Male").length,
      female: applicants.filter(a => a.gender === "Female").length,
      other: applicants.filter(a => a.gender === "Other").length,
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
      hasKiiExperience: row.has_kii_experience === 1,
      kiiDescription: row.kii_description,
      hasTgdExperience: row.has_tgd_experience === 1,
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

  private mapRowToTimeline(row: any): StatusTimeline {
    return {
      id: row.id,
      applicantId: row.applicant_id,
      status: row.status,
      notes: row.notes,
      changedBy: row.changed_by,
      createdAt: row.created_at,
    };
  }
}

export const storage = new SQLiteStorage();
