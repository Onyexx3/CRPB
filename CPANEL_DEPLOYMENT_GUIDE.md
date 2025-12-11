# cPanel Shared Hosting Deployment Guide

This guide provides step-by-step instructions for deploying this Node.js/Express application to cPanel shared hosting via File Manager.

## Prerequisites

Before you begin, ensure you have:
- cPanel shared hosting account with Node.js support
- Access to cPanel File Manager
- Your domain or subdomain configured
- Database credentials (PostgreSQL or MySQL)

## Step 1: Build the Application Locally

Before uploading, you need to build the production version:

```bash
npm run build
```

This creates:
- `dist/public/` - Frontend static files
- `dist/server.cjs` - Backend server bundle

## Step 2: Prepare Files for Upload

Create a ZIP file containing these files/folders:

**INCLUDE:**
- `dist/` folder (entire folder with public/ and server.cjs)
- `uploads/` folder (create empty if doesn't exist)
- `app.cjs` (root entry point)
- `package.json`
- `package-lock.json`
- `.htaccess` (create this - see below)

**DO NOT INCLUDE:**
- `node_modules/`
- `.git/`
- `client/` (source files - already built in dist)
- `server/` (source files - already bundled)
- `.env` (will configure in cPanel)
- Any `.zip` files

## Step 3: Configure .htaccess File

A `.htaccess` file is already included in your project. Before uploading, you MUST update the placeholder values:

Open `.htaccess` and replace:
- `YOUR_USERNAME` with your actual cPanel username
- `YOUR_DOMAIN_FOLDER` with your actual domain folder name

Example - Before:
```apache
PassengerAppRoot "/home/YOUR_USERNAME/YOUR_DOMAIN_FOLDER"
PassengerNodejs "/home/YOUR_USERNAME/nodevenv/YOUR_DOMAIN_FOLDER/20/bin/node"
```

Example - After (if username is "john" and domain folder is "myapp.com"):
```apache
PassengerAppRoot "/home/john/myapp.com"
PassengerNodejs "/home/john/nodevenv/myapp.com/20/bin/node"
```

**Important:** The Node.js version in the path (e.g., `/20/`) must match the version selected in cPanel Setup Node.js App.

**Note:** If your cPanel uses a different Node.js setup method, it may auto-generate this file when you create the Node.js application.

## Step 4: Upload Files to cPanel

1. **Log into cPanel**
2. Navigate to **File Manager**
3. Go to your application directory (NOT public_html for main domain)
   - For subdomain: `/home/yourusername/yourdomain`
   - For main domain with Node.js: `/home/yourusername/myapp`
4. Click **Upload** and upload your ZIP file
5. Select the ZIP file and click **Extract**
6. Delete the ZIP file after extraction

## Step 5: Set Up Node.js Application in cPanel

1. In cPanel, go to **Software** > **Setup Node.js App**
2. Click **CREATE APPLICATION**
3. Configure the following:

| Setting | Value |
|---------|-------|
| Node.js version | 18.x or higher (latest available) |
| Application mode | Production |
| Application root | Path to your uploaded files (e.g., `/home/username/myapp`) |
| Application URL | Select your domain/subdomain |
| Application startup file | `app.cjs` |

4. Click **CREATE**

## Step 6: Configure Environment Variables

In the Node.js application settings, add these environment variables:

### Required Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/dbname` |
| `SESSION_SECRET` | Random secure string for sessions | `your-random-32-char-string` |
| `ADMIN_EMAIL` | Admin login email | `admin@example.com` |
| `ADMIN_PASSWORD` | Admin login password | `your-secure-password` |

### Optional Variables (for email notifications):

| Variable | Description | Example |
|----------|-------------|---------|
| `SMTP_HOST` | Email server host | `smtp.gmail.com` |
| `SMTP_PORT` | Email server port | `587` |
| `SMTP_USER` | Email username | `your-email@gmail.com` |
| `SMTP_PASS` | Email password/app password | `app-specific-password` |
| `EMAIL_FROM` | From address for emails | `noreply@yourdomain.com` |

**Note:** PORT is automatically assigned by cPanel - do not set it manually.

## Step 7: Install Dependencies

1. Return to your Node.js application in cPanel
2. Click **Run NPM Install**
3. Wait for completion (may take 1-2 minutes)

If npm install fails due to memory limits, you may need to:
- Contact your hosting provider to increase memory limits
- Or install dependencies locally and upload `node_modules/` (not recommended)

## Step 8: Set Up Database

### Option A: Using cPanel PostgreSQL (if available)
1. Go to **Databases** > **PostgreSQL Databases**
2. Create a new database and user
3. Note the connection details for your DATABASE_URL

### Option B: Using External Database Service
Use services like:
- Neon (https://neon.tech) - Free PostgreSQL
- Supabase (https://supabase.com) - Free PostgreSQL
- ElephantSQL (https://elephantsql.com)

Connection string format:
```
postgresql://username:password@host:port/database?sslmode=require
```

## Step 9: Initialize Database Tables

The application will automatically create required tables on first run. If you need to manually initialize:

1. Connect to your database using a PostgreSQL client
2. The tables `applicants` and `status_timeline` will be created automatically

## Step 10: Start the Application

1. Return to **Setup Node.js App** in cPanel
2. Click **START** or **RESTART**
3. Wait for status to show "Running"
4. Click **OPEN** to view your application

## Step 11: Configure Uploads Directory

1. In File Manager, navigate to your application root
2. Create an `uploads` folder if it doesn't exist
3. Right-click on `uploads` > **Change Permissions**
4. Set permissions to **755** or **775**

## Troubleshooting

### 503 Service Unavailable
**Causes & Solutions:**

1. **Application not started**
   - Go to Setup Node.js App and click START/RESTART

2. **Missing dependencies**
   - Click "Run NPM Install" in Node.js settings

3. **Database connection error**
   - Verify DATABASE_URL is correct
   - Check if database server allows external connections
   - For Neon/Supabase, ensure SSL is enabled in connection string

4. **Port conflict**
   - Ensure your code uses `process.env.PORT` (already configured)

5. **Build files missing**
   - Verify `dist/public/` and `dist/server.cjs` exist
   - Re-run `npm run build` locally and re-upload

### Cannot GET / Error
- Check that startup file is set to `app.cjs`
- Verify `dist/public/index.html` exists
- Check cPanel error logs

### Application Crashes on Startup
- Check error logs in cPanel (Setup Node.js App > Logs)
- Verify all environment variables are set
- Ensure DATABASE_URL is valid

### Static Files Not Loading
- Verify `dist/public/` folder was uploaded
- Check that files have correct permissions

## Updating the Application

When you need to deploy updates:

1. Run `npm run build` locally
2. Create a new ZIP with updated `dist/` folder
3. Upload and extract via File Manager (overwrite existing)
4. Go to Setup Node.js App and click **RESTART**

## File Structure After Deployment

Your cPanel application directory should look like:

```
/home/username/myapp/
├── app.cjs              # Entry point
├── package.json
├── package-lock.json
├── .htaccess
├── node_modules/        # Created by npm install
├── uploads/             # User uploads
└── dist/
    ├── server.cjs       # Bundled server
    └── public/          # Built frontend
        ├── index.html
        ├── favicon.png
        └── assets/
            ├── index-*.css
            └── index-*.js
```

## Security Recommendations

1. **Use strong passwords** for ADMIN_PASSWORD and database
2. **Set SESSION_SECRET** to a random 32+ character string
3. **Enable HTTPS** in cPanel (most hosts provide free SSL)
4. **Regular backups** of uploads folder and database
5. **Keep Node.js updated** to the latest LTS version

## Support

If you encounter issues:
1. Check cPanel error logs (Setup Node.js App > View Log)
2. Verify all environment variables are set correctly
3. Contact your hosting provider for Node.js specific issues
