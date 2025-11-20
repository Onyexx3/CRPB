# Deployment Guide for Render

This guide will walk you through deploying the Research Project Application Management System on Render.

## Prerequisites

- A GitHub account
- A Render account (free tier works fine)
- Your project code pushed to a GitHub repository

## Step 1: Prepare Your Project

1. Make sure your `.env.example` file exists with all necessary environment variables
2. Ensure your `package.json` has the correct scripts:
   - `build`: Builds both frontend and backend
   - `start`: Starts the production server

## Step 2: Create a Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** and select **"Web Service"**
3. Connect your GitHub repository
4. Select the repository containing this project

## Step 3: Configure the Web Service

Fill in the following settings:

### Basic Configuration

- **Name**: `research-application-system` (or your preferred name)
- **Region**: Choose the closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave blank (unless your code is in a subdirectory)
- **Runtime**: `Node`

### Build & Deploy Settings

- **Build Command**: 
  ```
  npm install && npm run build
  ```

- **Start Command**: 
  ```
  npm start
  ```

### Environment Variables

Click **"Add Environment Variable"** and add the following:

#### Required Variables

1. **NODE_ENV**
   - Value: `production`

2. **SESSION_SECRET**
   - Value: Generate a random 32+ character string
   - Example: `kJ8$mP2@nQ5#rT9&vX3*wY7!zB4^cD1%`
   - You can generate one at: https://randomkeygen.com/

3. **ADMIN_EMAIL**
   - Value: Your admin email address
   - Example: `admin@researchproject.com`

4. **ADMIN_PASSWORD**
   - Value: A strong password for admin access
   - Example: `SecureAdminPass123!`

#### Optional Variables (for Email Notifications)

5. **SMTP_HOST**
   - Value: Your email provider's SMTP host
   - Gmail: `smtp.gmail.com`
   - Outlook: `smtp-mail.outlook.com`

6. **SMTP_PORT**
   - Value: `587` (for TLS) or `465` (for SSL)

7. **SMTP_USER**
   - Value: Your email address

8. **SMTP_PASS**
   - Value: Your email password or app-specific password
   - For Gmail: Generate an [App Password](https://support.google.com/accounts/answer/185833)

9. **SMTP_FROM**
   - Value: The sender email address
   - Example: `noreply@researchproject.com`

### Instance Configuration

- **Instance Type**: Select **Free** (or paid if you need more resources)
- **Auto-Deploy**: Enable this to automatically deploy on git push

## Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will automatically start building and deploying your application
3. Wait for the deployment to complete (usually 5-10 minutes)
4. Once deployed, you'll get a URL like: `https://your-app-name.onrender.com`

## Step 5: Test Your Application

1. Visit your Render URL
2. Test the following:
   - Landing page loads correctly
   - Application form submission works
   - Applicant login and dashboard work
   - Admin login with your configured credentials
   - Admin can view, filter, and export applicants
   - Admin can update applicant status
   - Statistics page displays correctly

## Important Notes

### Database

- The application uses SQLite, which stores data in a `database.sqlite` file
- **Important**: Render's free tier has ephemeral storage, meaning your database will be reset on each deployment or restart
- For production use, consider:
  - Upgrading to a paid Render plan with persistent disk
  - Or migrating to PostgreSQL using a service like [Render PostgreSQL](https://render.com/docs/databases) or [Neon](https://neon.tech/)

### File Uploads

- CV and photo uploads are stored in the `/uploads` directory
- Same storage limitation applies: files will be lost on restart with free tier
- For production, consider using cloud storage (AWS S3, Cloudinary, etc.)

### Email Configuration

- If you don't configure SMTP settings, the application will work but won't send email notifications
- Users will still receive status updates when they log in to their dashboard
- For Gmail: You need to enable 2-factor authentication and create an [App Password](https://support.google.com/accounts/answer/185833)

## Troubleshooting

### Build Fails

1. Check the build logs in Render
2. Ensure all dependencies are in `package.json`
3. Make sure Node version is compatible (v18+)

### Application Won't Start

1. Check the deploy logs
2. Verify all required environment variables are set
3. Ensure `start` script in `package.json` is correct

### Admin Login Not Working

1. Double-check `ADMIN_EMAIL` and `ADMIN_PASSWORD` in environment variables
2. Ensure there are no extra spaces in the values
3. Try clearing browser cookies

### Database Issues

1. Check if the application has write permissions
2. For persistent storage, upgrade to a paid plan or use PostgreSQL

## Upgrading to PostgreSQL (Optional)

If you need persistent storage:

1. Create a PostgreSQL database on Render
2. Update `drizzle.config.ts` to use PostgreSQL
3. Install PostgreSQL dependencies: `npm install pg`
4. Add `DATABASE_URL` environment variable with your PostgreSQL connection string
5. Modify `server/storage.ts` to use PostgreSQL instead of SQLite
6. Run migrations: `npm run db:push`

## Local Development

To run locally:

1. Clone the repository
2. Copy `.env.example` to `.env`
3. Fill in the environment variables
4. Run `npm install`
5. Run `npm run dev`
6. Open `http://localhost:5000` in your browser

## Admin Access

After deployment:

- Admin login URL: `https://your-app-name.onrender.com/admin/login`
- Use the credentials from your environment variables

## Support

For issues or questions:
- Check the application logs in Render dashboard
- Review the `README.md` file for architecture details
- Check project documentation for additional information

## Security Recommendations

1. Use strong passwords for admin access
2. Keep your environment variables secret
3. Regularly update dependencies
4. Enable HTTPS (Render provides this automatically)
5. Consider adding rate limiting for API endpoints
6. Implement CAPTCHA for public forms if you experience spam

## Cost Considerations

### Free Tier
- Render free tier is great for testing
- Services sleep after 15 minutes of inactivity
- First request after sleep may take 30-60 seconds

### Paid Tier ($7/month)
- 24/7 availability
- No sleep
- Faster cold starts
- Persistent disk storage available

## Backup Strategy

Since the free tier doesn't have persistent storage:

1. Regularly export data to CSV/Excel through the admin panel
2. Consider scheduled backups if using paid tier with persistent disk
3. Keep local development database backed up

## Performance Optimization

1. Enable caching in Express
2. Optimize images and assets
3. Use CDN for static assets if needed
4. Consider upgrading instance type for high traffic

## Monitoring

Render provides:
- Real-time logs
- Metrics dashboard
- Health checks
- Automatic SSL renewal

---

**Congratulations!** Your application should now be live and accessible to users. Test all features thoroughly before sharing with real users.
