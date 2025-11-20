# Admin Login Guide

## Fixed Issue

The admin login issue has been **resolved**. The problem was that the `.env` file wasn't being loaded because the `dotenv` package wasn't configured.

### Changes Made:
1. ✅ Installed `dotenv` package
2. ✅ Added `import "dotenv/config"` to `server/index.ts`
3. ✅ Changed server port to 5001 (to avoid conflicts)
4. ✅ Added debug logging for login attempts

## Admin Login Credentials

The default admin credentials are configured in the `.env` file:

```
ADMIN_EMAIL=admin@researchproject.com
ADMIN_PASSWORD=Admin123!
```

## How to Login

### Step 1: Access Admin Login Page

Navigate to the admin login page:
- **URL**: `http://localhost:5001/admin/login`

Or click the login dropdown on the landing page header and select "Admin Login" (if available in your UI).

### Step 2: Enter Credentials

Enter the exact credentials from your `.env` file:

**Email**: 
```
admin@researchproject.com
```

**Password**: 
```
Admin123!
```

> ⚠️ **Important**: Make sure to copy these exactly - no extra spaces!

### Step 3: Submit

Click the "Login" button. If successful, you'll be redirected to the admin dashboard.

## Troubleshooting

### Issue: "Invalid admin credentials"

**Possible causes:**
1. **Extra spaces** in email or password
2. **Wrong credentials** - check your `.env` file
3. **Browser cached old session** - try clearing cookies
4. **Case sensitivity** - the email and password are case-sensitive

**Solutions:**
1. Copy-paste the credentials directly from the `.env` file
2. Clear your browser cookies for localhost
3. Try in an incognito/private window
4. Check the server console for debug logs

### Issue: Login form not submitting

**Solutions:**
1. Check browser console for JavaScript errors (F12)
2. Verify the server is running (`npm run dev`)
3. Make sure you're on the correct port (5001)

### Issue: Environment variables not loading

**Solutions:**
1. Verify `.env` file exists in the project root
2. Restart the development server
3. Check that `dotenv` is installed: `npm list dotenv`

## Changing Admin Credentials

To change the admin credentials:

1. Open the `.env` file
2. Update the values:
   ```env
   ADMIN_EMAIL=your-new-email@example.com
   ADMIN_PASSWORD=YourNewSecurePassword123!
   ```
3. Restart the server: `Ctrl+C` then `npm run dev`
4. Login with the new credentials

## Production Deployment

When deploying to production (Render, etc.):

1. **Never commit the `.env` file to git**
2. Set environment variables in your hosting platform:
   - Go to your Render dashboard
   - Navigate to your service
   - Go to "Environment" tab
   - Add `ADMIN_EMAIL` and `ADMIN_PASSWORD`
3. Use strong, unique passwords in production
4. Consider using password managers to generate secure passwords

## Security Best Practices

1. ✅ **Use strong passwords** - at least 12 characters with mixed case, numbers, and symbols
2. ✅ **Change default credentials** immediately in production
3. ✅ **Don't share credentials** via unsecured channels (email, chat)
4. ✅ **Keep .env file secure** - never commit to version control
5. ✅ **Rotate credentials regularly** - change passwords every 3-6 months
6. ✅ **Use different credentials** for development and production

## Server Status Check

To verify the server is running and environment variables are loaded:

```bash
# Check if server is running
npm run dev

# You should see:
# Email service not configured - SMTP environment variables missing
# serving on localhost:5001
```

## Current Working Configuration

**Server**: `http://localhost:5001`
**Admin Login**: `http://localhost:5001/admin/login`

**Credentials**:
- Email: `admin@researchproject.com`
- Password: `Admin123!`

## Testing Admin Login

1. Open browser: `http://localhost:5001/admin/login`
2. Enter email: `admin@researchproject.com`
3. Enter password: `Admin123!`
4. Click "Login"
5. You should be redirected to `/admin/dashboard`

## Debug Mode

If you're still having issues, check the server console for debug output. When you attempt to login, you should see:

```
Admin login attempt: {
  providedEmail: 'admin@researchproject.com',
  envEmail: 'admin@researchproject.com',
  emailMatch: true,
  passwordMatch: true
}
```

If `emailMatch` or `passwordMatch` is `false`, there's a mismatch between what you're entering and what's in the `.env` file.

---

**The admin login is now working!** Use the credentials from the `.env` file to access the admin panel.
