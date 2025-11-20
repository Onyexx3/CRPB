# Cultural & Religious Pluralism Barometer (CRPB)
## Field Officers Application System

[![GitHub](https://img.shields.io/badge/GitHub-Onyexx3%2FCRPB-blue?logo=github)](https://github.com/Onyexx3/CRPB)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)

A comprehensive web application for managing field officer applications for the Cultural and Religious Pluralism Barometer research project in Plateau and Kaduna States, Nigeria.

## 📋 Project Overview

The **Cultural and Religious Pluralism Barometer** is an innovative assessment tool developed by the **Pharos Observatory** to measure identity-related tensions within society. This application system manages field officer recruitment for the research project in Plateau and Kaduna States, providing:

### Key Objectives
- 🔍 Assess identity-related tensions in Plateau and Kaduna States
- 🤝 Identify forces of fragmentation and cohesion
- 📊 Provide evidence-based diagnosis and recommendations
- 🕊️ Support peacebuilding and conflict prevention initiatives
- 📈 Preserve the common good through data-driven insights

## Features

### Public Features
- **Landing Page**: Professional landing page with information about the project, requirements, and benefits
- **Application Form**: Multi-step form collecting:
  - Personal information (name, email, phone, gender, DOB, location, address)
  - Education details (qualification, field of study, institution, graduation year)
  - Research experience (KII and FGD experience with descriptions)
  - Availability information
  - File uploads (CV PDF required, passport photo optional)
  - Declaration checkbox

### Applicant Features
- **Login System**: Simple authentication using email + phone number
- **Dashboard**: View application status, timeline, and admin notes
- **File Access**: Download submitted CV
- **Status Tracking**: Real-time view of application progress

### Admin Features
- **Secure Login**: Email and password authentication (credentials in .env)
- **Applicant Management**: 
  - View all applications in a searchable, filterable table
  - Search by name, email, or phone
  - Filter by location, gender, status, KII/FGD experience
  - View detailed applicant information
- **Status Management**:
  - Update applicant status (Pending → Shortlisted → Employed/Rejected)
  - Add admin notes visible to applicants
  - Set resumption date and onboarding details
  - Automatic email notifications on status changes
- **Data Export**:
  - Export to CSV or Excel
  - Apply filters before export
- **Statistics Dashboard**:
  - Total applicants count
  - Location breakdown (Kaduna State vs Plateau State)
  - Research experience statistics (KII, FGD)
  - Gender distribution
  - Status breakdown (pending, shortlisted, employed, rejected)

### Email Notifications
- Application confirmation email
- Status change notifications (shortlisted, employed, rejected)
- Include resumption details when applicable

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for development and building
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Hook Form** with Zod validation
- **TanStack Query** for state management
- **Wouter** for routing

### Backend
- **Express.js** with TypeScript
- **better-sqlite3** for database
- **Multer** for file uploads
- **Nodemailer** for email
- **Express-session** for authentication

### Database
- **SQLite** for development (easily upgradeable to PostgreSQL)
- Two tables: `applicants` and `status_timeline`

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Onyexx3/CRPB.git
cd CRPB
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
# Required
SESSION_SECRET=your-secret-key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-password

# Optional (for email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@example.com
```

5. Start development server:
```bash
npm run dev
```

6. Open browser:
```
http://localhost:5000
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Type check with TypeScript
- `npm run db:push` - Push database schema changes

## Project Structure

```
KadunaResearchApp/
├── client/                 # Frontend React application
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page components
│       ├── hooks/          # Custom React hooks
│       └── lib/            # Utility functions
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── email.ts           # Email service
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Zod schemas and types
├── uploads/               # Uploaded files directory
├── database.sqlite        # SQLite database
└── package.json           # Project dependencies
```

## Usage

### For Applicants

1. Visit the landing page
2. Click "Apply Now"
3. Fill out the application form with all required information
4. Upload your CV (PDF, max 5MB)
5. Optionally upload a passport photo
6. Accept the declaration
7. Submit the form
8. Use your email and phone number to log in and check status

### For Administrators

1. Navigate to `/admin/login`
2. Enter admin credentials from `.env`
3. View and manage applications from the dashboard
4. Use filters to find specific applicants
5. Click on an applicant to view details
6. Update status and add notes as needed
7. Export data to CSV or Excel
8. View statistics at `/admin/stats`

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions on deploying to Render.

### Quick Deployment Steps

1. Push code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Set environment variables
5. Deploy!

**Note**: The free tier uses ephemeral storage. For production, consider:
- Upgrading to a paid plan with persistent disk
- Migrating to PostgreSQL for the database

## Configuration

### Admin Credentials
Set in `.env`:
```env
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-password
```

### Email Setup (Optional)
For Gmail:
1. Enable 2-factor authentication
2. Generate an [App Password](https://support.google.com/accounts/answer/185833)
3. Use the app password in `SMTP_PASS`

If email is not configured, the app will work but won't send notifications.

## Security

- Passwords should be strong and unique
- Session secrets should be random and secure
- File uploads are validated (type and size)
- Admin routes are protected by authentication
- Applicants can only access their own data
- SQL injection protection via parameterized queries
- XSS protection via React's built-in escaping
- CSRF protection via session tokens

## API Endpoints

### Public Endpoints
- `POST /api/applications` - Submit application
- `POST /api/applicant/login` - Applicant login

### Applicant Endpoints (Authenticated)
- `GET /api/applicant/dashboard` - Get applicant data and timeline
- `POST /api/applicant/logout` - Logout
- `GET /api/files/:filename` - Download file (CV/photo)

### Admin Endpoints (Authenticated)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/applicants` - Get all applicants
- `PATCH /api/admin/applicants/:id/status` - Update status
- `GET /api/admin/stats` - Get statistics
- `GET /api/admin/export/csv` - Export to CSV
- `GET /api/admin/export/excel` - Export to Excel

## Database Schema

### applicants table
- Personal info: name, email, phone, gender, DOB, location, address
- Education: qualification, field, institution, graduation year
- Experience: KII/TGD experience and descriptions
- Availability: date and status
- Files: CV and photo paths
- Admin fields: status, notes, resumption details
- Timestamps: created_at, updated_at

### status_timeline table
- applicant_id (foreign key)
- status
- notes
- changed_by (admin email)
- created_at

## Troubleshooting

### Port Already in Use
If port 5000 is in use, modify `server/index.ts`:
```typescript
const PORT = process.env.PORT || 3000;
```

### Database Locked
Stop all running instances of the application and try again.

### File Upload Fails
- Check file size (max 5MB)
- Ensure file is PDF for CV
- Verify uploads directory exists and is writable

### Email Not Sending
- Verify SMTP credentials
- Check spam folder
- For Gmail, ensure app password is used
- Check server logs for error messages

### Admin Can't Login
- Verify ADMIN_EMAIL and ADMIN_PASSWORD in .env
- Check for extra spaces in environment variables
- Try clearing browser cookies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Credits

**Designed and Developed by:**
- **Desmond Ignatius**
- **Contact:** 08160038381

**Project:** Cultural & Religious Pluralism Barometer  
**Organization:** Pharos Observatory  
**Location:** Plateau & Kaduna States, Nigeria

## Recent Updates

### Version 1.9.0 (November 2025)
- ✅ Complete rebranding to Cultural & Religious Pluralism Barometer
- ✅ Updated from generic research to Barometer-specific project
- ✅ Changed TGD to FGD (Focus Group Discussions) terminology
- ✅ Comprehensive SEO implementation with meta tags and structured data
- ✅ Added robots.txt and sitemap.xml for search engine optimization
- ✅ Updated locations to Plateau State and Kaduna State
- ✅ Added designer attribution
- ✅ Removed all Replit dependencies
- ✅ Enhanced admin dashboard with better filtering
- ✅ Improved form validation with real-time error feedback

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
1. Check the documentation
2. Review the code comments
3. Check existing issues on GitHub
4. Create a new issue if needed

**Technical Support:**
- Email: admin@researchproject.com (update with actual contact)
- Phone: 08160038381 (Designer/Developer)

## Roadmap

Potential future enhancements:
- [ ] SMS notifications
- [ ] Document preview in admin panel
- [ ] Bulk status updates
- [ ] Advanced analytics
- [ ] Interview scheduling
- [ ] Multi-admin support with roles
- [ ] Applicant profile editing
- [ ] Application withdrawal feature

## Credits

Built with modern web technologies and best practices for production use.

---

**Version**: 1.1.0  
**Last Updated**: November 2024
