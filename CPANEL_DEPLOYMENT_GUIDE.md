# cPanel Shared Hosting Deployment Guide

This guide provides step-by-step instructions for deploying this Node.js/Express application to cPanel shared hosting via File Manager.

## Prerequisites

Before you begin, ensure you have:
- cPanel shared hosting account with Node.js support (CloudLinux/Passenger)
- Access to cPanel File Manager
- Your domain or subdomain configured
- PostgreSQL database (cPanel PostgreSQL or external service like Neon)

## Understanding the Build

This application has two parts:
- **Frontend** (React): Built by Vite into static files
- **Backend** (Express): Bundled by esbuild into a single CommonJS file

Both are built locally before upload. cPanel runs only the bundled production code.

## Step 1: Build the Application Locally

Run the build command on your local machine:

```bash
npm install
npm run build
```

This creates:
- `dist/public/` - Frontend static files (HTML, CSS, JS, images)
- `dist/server.cjs` - Backend server bundle (all server code in one file)

Verify the build succeeded by checking these files exist.

## Step 2: Prepare Files for Upload

Create a ZIP file containing ONLY these files/folders:

**MUST INCLUDE:**
```
dist/                    # Contains both server.cjs and public/
├── server.cjs          # Bundled backend
└── public/             # Built frontend
    ├── index.html
    ├── favicon.png
    └── assets/
        ├── index-*.css
        └── index-*.js

app.cjs                  # Entry point (loads dist/server.cjs)
package.json             # For npm install (production deps only)
package-lock.json        # Lock file for consistent installs
.htaccess                # cPanel routing configuration
uploads/                 # Empty folder for user file uploads
```

**DO NOT INCLUDE:**
- `node_modules/` - Will be installed on server
- `.git/` - Not needed
- `client/` - Source files, already built in dist/public
- `server/` - Source files, already bundled in dist/server.cjs
- `shared/` - Source files, already bundled in dist/server.cjs
- `.env` - Will configure in cPanel environment variables
- `*.zip` files - Old archives

## Step 3: Configure .htaccess Before Upload

**CRITICAL:** The `.htaccess` file has placeholder values that MUST be updated before uploading.

Open `.htaccess` and find these lines:
```apache
PassengerAppRoot "/home/YOUR_USERNAME/YOUR_DOMAIN_FOLDER"
PassengerNodejs "/home/YOUR_USERNAME/nodevenv/YOUR_DOMAIN_FOLDER/20/bin/node"
```

Replace the placeholders:
- `YOUR_USERNAME` → Your cPanel username (e.g., `john123`)
- `YOUR_DOMAIN_FOLDER` → Your domain folder name (e.g., `myapp.com` or `public_html`)

**Example after editing:**
```apache
PassengerAppRoot "/home/john123/myapp.com"
PassengerNodejs "/home/john123/nodevenv/myapp.com/20/bin/node"
```

**The `20` in the path must match your Node.js version** - if using Node 18, use `/18/`.

**Alternative:** Some cPanel setups auto-generate this file when you create the Node.js application. In that case, do NOT upload .htaccess and let cPanel create it.

## Step 4: Upload Files to cPanel

1. **Log into cPanel**
2. Navigate to **File Manager**
3. Go to your application directory:
   - Main domain: `/home/yourusername/public_html` (or a subfolder)
   - Subdomain: `/home/yourusername/subdomain.yourdomain.com`
   - Addon domain: Check cPanel for the correct path
4. Click **Upload** and upload your ZIP file
5. Select the ZIP file → Click **Extract**
6. Delete the ZIP file after extraction
7. Verify all files are in the correct location

## Step 5: Set Up Node.js Application in cPanel

1. In cPanel, go to **Software** → **Setup Node.js App**
2. Click **CREATE APPLICATION**
3. Fill in the settings:

| Setting | Value |
|---------|-------|
| Node.js version | 18.x or 20.x (latest LTS available) |
| Application mode | **Production** |
| Application root | Full path to your files (e.g., `/home/john123/myapp.com`) |
| Application URL | Select your domain/subdomain |
| Application startup file | **app.cjs** |

4. Click **CREATE**

**Note:** After creation, cPanel may auto-generate or update the .htaccess file.

## Step 6: Configure Environment Variables

In the Node.js application settings, scroll to **Environment Variables** and add:

### Required Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Must be production | `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/dbname?sslmode=require` |
| `SESSION_SECRET` | Random 32+ character string | `x7k2m9p4q8r1t6w3y5u0i` |
| `ADMIN_EMAIL` | Admin login email | `admin@example.com` |
| `ADMIN_PASSWORD` | Admin login password | `YourSecurePassword123!` |

### Optional Variables (for email notifications):

| Variable | Description | Example |
|----------|-------------|---------|
| `SMTP_HOST` | Email server host | `smtp.gmail.com` |
| `SMTP_PORT` | Email server port | `587` |
| `SMTP_USER` | Email username | `your-email@gmail.com` |
| `SMTP_PASS` | Email app password | `xxxx xxxx xxxx xxxx` |
| `EMAIL_FROM` | From address | `noreply@yourdomain.com` |

**Important:** Do NOT set PORT manually - cPanel assigns it automatically.

Click **SAVE** after adding all variables.

## Step 7: Install Production Dependencies

1. In the Node.js application page, find the **Run NPM Install** button
2. Click it and wait for completion (1-3 minutes)
3. Look for a success message

**If npm install fails:**
- Check cPanel error logs
- Contact hosting provider about memory limits
- Try SSH if available: `npm install --production`

## Step 8: Set Up PostgreSQL Database

### Option A: cPanel PostgreSQL (if available)
1. Go to **Databases** → **PostgreSQL Databases**
2. Create a new database (e.g., `myapp_db`)
3. Create a new user with a strong password
4. Add the user to the database with ALL PRIVILEGES
5. Use connection string: `postgresql://user:password@localhost:5432/database`

### Option B: External PostgreSQL Service (Recommended)

**Neon** (https://neon.tech) - Free tier available:
1. Create account and project
2. Copy the connection string from dashboard
3. Add `?sslmode=require` if not included

**Supabase** (https://supabase.com):
1. Create project
2. Go to Settings → Database → Connection string
3. Use the "URI" format with your password

Example connection string:
```
postgresql://username:password@hostname.neon.tech:5432/neondb?sslmode=require
```

## Step 9: Start the Application

1. Return to **Setup Node.js App** in cPanel
2. Click **START** (or **RESTART** if already started)
3. Wait for status to show "Running" (green indicator)
4. Click **OPEN** to test your application

## Step 10: Set Uploads Directory Permissions

1. In File Manager, navigate to your application root
2. Find the `uploads` folder (create it if missing)
3. Right-click → **Change Permissions**
4. Set to **755** or **775**
5. Click **Change Permissions**

## Troubleshooting

### 503 Service Unavailable

This is the most common error. Check these in order:

1. **Application not running**
   - Go to Setup Node.js App → Click START/RESTART
   - Check if status shows "Running"

2. **.htaccess misconfigured**
   - Verify username and paths are correct
   - Delete .htaccess and let cPanel regenerate it
   - Check Node version in path matches selected version

3. **Missing dist files**
   - Verify `dist/server.cjs` exists
   - Verify `dist/public/index.html` exists
   - Re-upload the dist folder if missing

4. **Dependencies not installed**
   - Click "Run NPM Install" again
   - Check for error messages in logs

5. **Database connection failed**
   - Verify DATABASE_URL is correct and complete
   - Test database connection with a PostgreSQL client
   - Ensure `?sslmode=require` for external databases

6. **Environment variables not set**
   - Check all required variables are added
   - Verify NODE_ENV is set to `production`

### How to Check Error Logs

1. Go to Setup Node.js App
2. Click on your application
3. Look for **View Log** or **Stderr log** link
4. Check for error messages

### Cannot GET / Error
- Startup file must be `app.cjs` (not app.js or server.js)
- Verify `dist/public/index.html` exists
- Check that dist/server.cjs exists and is not corrupted

### Application Starts Then Stops
- Check error logs for crash reason
- Verify all environment variables are set
- Ensure DATABASE_URL is accessible from cPanel server

### Uploaded Files Not Working
- Check `uploads` folder has write permissions (755 or 775)
- Verify the folder exists in application root

## Updating the Application

When you make changes:

1. Run `npm run build` locally
2. Create a new ZIP with ONLY the updated `dist/` folder
3. Upload to cPanel File Manager
4. Extract (overwrite existing files)
5. Go to Setup Node.js App → Click **RESTART**

**Tip:** You don't need to re-run npm install unless package.json changed.

## Final Directory Structure

After successful deployment, your cPanel directory should look like:

```
/home/username/yourdomain/
├── app.cjs                 # Entry point (points to dist/server.cjs)
├── package.json            # Dependencies list
├── package-lock.json       # Lock file
├── .htaccess              # cPanel routing (may be auto-generated)
├── node_modules/          # Created by npm install
├── uploads/               # User file uploads
└── dist/
    ├── server.cjs         # Bundled Express server
    └── public/            # Built React frontend
        ├── index.html
        ├── favicon.png
        ├── robots.txt
        ├── sitemap.xml
        └── assets/
            ├── index-*.css
            ├── index-*.js
            └── *.png
```

## Security Recommendations

1. **Strong passwords**: Use complex passwords for ADMIN_PASSWORD and database
2. **Unique SESSION_SECRET**: Generate a random 32+ character string
3. **Enable HTTPS**: Use cPanel's free SSL certificate (Let's Encrypt)
4. **Regular backups**: Back up uploads folder and database regularly
5. **Update Node.js**: Use the latest LTS version available

## Quick Reference: Common cPanel Paths

| Item | Typical Path |
|------|--------------|
| Home directory | `/home/username/` |
| Main domain | `/home/username/public_html/` |
| Subdomain | `/home/username/subdomain.domain.com/` |
| Node virtual env | `/home/username/nodevenv/domain/VERSION/` |
| Error logs | cPanel → Setup Node.js App → View Log |

## Getting Help

If you're still stuck:
1. Check cPanel error logs first
2. Verify all steps were followed correctly
3. Contact your hosting provider's support
4. Share error log contents when asking for help
