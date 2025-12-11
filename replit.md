# Cultural & Religious Pluralism Barometer (CRPB)

## Overview

A web application for managing field officer applications for the Cultural and Religious Pluralism Barometer research project in Plateau and Kaduna States, Nigeria. The system enables applicants to submit their applications, track their status, and allows administrators to manage the entire recruitment workflow including status updates, email notifications, and data exports.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme configuration
- **Form Handling**: React Hook Form with Zod validation

The frontend is a single-page application with the following main pages:
- Landing page with project information
- Multi-step application form with file uploads
- Applicant login and dashboard for status tracking
- Admin login, dashboard for applicant management, and statistics view

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript compiled to CommonJS for production
- **Build**: esbuild bundles server code into a single `dist/server.cjs` file
- **Session Management**: express-session for authentication state
- **File Uploads**: Multer middleware storing files to `/uploads` directory

The server handles:
- RESTful API endpoints under `/api/`
- Applicant and admin authentication via sessions
- File upload processing (CV PDFs, passport photos)
- Email notifications on status changes

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Connection**: Uses `pg` Pool with Neon serverless driver support
- **Schema**: Two main tables - `applicants` (application data) and `statusTimeline` (status change history)
- **Migrations**: Drizzle Kit for schema management (`npm run db:push`)

The choice of PostgreSQL ensures:
- Cross-platform compatibility (pure JavaScript driver)
- Production-ready scalability
- Free cloud hosting options (Neon, Supabase)
- Full TypeScript type safety through Drizzle

### Authentication
- **Applicant Login**: Email + phone number verification (no password)
- **Admin Login**: Email + password from environment variables
- **Session Storage**: Server-side sessions with secure cookies

### Status Workflow
Applications progress through: Pending → Shortlisted → Employed/Rejected
Each status change:
- Creates a timeline entry with timestamp
- Triggers email notification to applicant
- Can include admin notes and resumption details

## External Dependencies

### Database
- **PostgreSQL**: Primary database (configure via `DATABASE_URL` environment variable)
- **Neon Serverless**: Compatible with Neon's serverless PostgreSQL driver

### Email Service
- **Nodemailer**: SMTP email sending for notifications
- **Required Environment Variables**:
  - `SMTP_HOST`: SMTP server hostname
  - `SMTP_PORT`: SMTP port (587 or 465)
  - `SMTP_USER`: SMTP username
  - `SMTP_PASS`: SMTP password
  - `SMTP_FROM`: Sender email address

### Third-Party Libraries
- **xlsx**: Excel file generation for data exports
- **date-fns**: Date formatting utilities
- **bcryptjs**: Password hashing for admin authentication
- **nanoid**: Unique ID generation

### Required Environment Variables
```
DATABASE_URL=postgresql://...
SESSION_SECRET=your-session-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user
SMTP_PASS=password
SMTP_FROM=noreply@example.com
```