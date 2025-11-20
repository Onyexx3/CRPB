# Troubleshooting: Application Form Submission

## Issue: Form Not Submitting

If the "Submit Application" button is not working, check the following:

### 1. Button is Disabled (Grey/Unclickable)

The submit button will be **disabled** if:

✅ **Declaration checkbox not checked** - Scroll down and check the "I declare that all information provided is accurate and true" checkbox

✅ **CV not uploaded** - Upload your CV (PDF only, max 5MB) in the Documents section

✅ **Form is currently submitting** - Wait for the current submission to complete

**Solution**: 
- Make sure you've checked the declaration checkbox at the bottom
- Ensure you've uploaded a PDF CV file
- All required fields (marked with *) must be filled

### 2. Button is Clickable But Nothing Happens

**Check these items:**

#### A. Open Browser Console (F12)
1. Press `F12` to open Developer Tools
2. Go to the "Console" tab
3. Look for any red error messages
4. Try submitting again and watch for errors

#### B. Common Errors and Solutions

**Error: "CV Required"**
- You need to upload your CV as a PDF file
- Click "Upload CV" button in the Documents section
- Select a PDF file (max 5MB)

**Error: "Declaration Required"**
- Scroll to the bottom and check the declaration checkbox
- Read and accept the declaration statement

**Error: "Invalid File Type"**
- CV must be a PDF file (.pdf extension)
- Passport photo must be an image file (jpg, png, etc.)
- Check file size: CV max 5MB, Photo max 2MB

**Error: "Email already exists"**
- You've already submitted an application with this email
- Use your email and phone number to log in and check your status
- Contact admin if you need to resubmit

#### C. Network Issues

**Check if server is running:**
- Look at the URL - should be `http://localhost:5001`
- Server must be running (`npm run dev` in terminal)
- No network errors in browser console

**If you see CORS or fetch errors:**
- Restart the development server
- Clear browser cache (Ctrl+Shift+Delete)
- Try in an incognito/private window

### 3. Form Fields Not Validating

**Required Fields Checklist:**

Personal Information:
- [ ] Full Name
- [ ] Email Address
- [ ] Phone Number
- [ ] Gender (select from dropdown)
- [ ] Date of Birth (use date picker)
- [ ] Preferred Location (Kaduna or Jos)
- [ ] Residential Address

Education:
- [ ] Highest Qualification
- [ ] Field of Study
- [ ] Institution
- [ ] Graduation Year

Availability:
- [ ] Earliest Start Date
- [ ] Availability Status (select from dropdown)

Documents:
- [ ] CV uploaded (PDF)
- [ ] Declaration checkbox checked

### 4. Specific Field Validation Errors

**Email format:**
- Must be a valid email address (e.g., name@example.com)
- No spaces allowed

**Phone number:**
- Must be at least 10 digits
- Can include country code

**Date of Birth:**
- Use the date picker
- Must be in the past

**Graduation Year:**
- Enter the year (e.g., 2020)
- Must be 4 digits

### 5. File Upload Issues

**CV Upload:**
```
✅ Format: PDF only (.pdf)
✅ Size: Max 5MB
❌ Word documents (.doc, .docx) not accepted
❌ Images not accepted as CV
```

**Passport Photo (Optional):**
```
✅ Format: Images (jpg, png, etc.)
✅ Size: Max 2MB
```

**If file won't upload:**
- Check file size (use a PDF compressor if too large)
- Ensure file is not corrupted
- Try a different file
- Check file permissions

### 6. Testing the Form Step-by-Step

Follow these steps to test:

1. **Fill Personal Information**
   - Enter your full name
   - Enter valid email
   - Enter phone number (10+ digits)
   - Select gender from dropdown
   - Pick date of birth
   - Select location (Kaduna or Jos)
   - Enter full address

2. **Fill Education**
   - Enter highest qualification
   - Enter field of study
   - Enter institution name
   - Enter graduation year

3. **Research Experience (Optional)**
   - Check KII/TGD boxes if you have experience
   - Fill description if checked

4. **Availability**
   - Select earliest start date
   - Select availability status

5. **Upload Documents**
   - Click "Upload CV" and select PDF file
   - (Optional) Upload passport photo

6. **Declaration**
   - Scroll to bottom
   - Check the declaration checkbox

7. **Submit**
   - Button should now be blue/enabled
   - Click "Submit Application"
   - Wait for success message

### 7. Success Indicators

When submission succeeds:
- ✅ Green toast notification: "Application Submitted!"
- ✅ Automatic redirect to login page after 2 seconds
- ✅ Form resets to blank

### 8. Server-Side Issues

**Check server logs:**
```bash
# Look at the terminal where you ran npm run dev
# You should see:
POST /api/applications 200 in XXms
```

**Common server errors:**

**"Email already exists"**
- Solution: Log in with existing credentials instead of resubmitting

**"CV is required"**
- Solution: Make sure file upload is working

**"Invalid data"**
- Solution: Check all fields are filled correctly
- Look at specific error message in toast

### 9. Browser-Specific Issues

**Safari:**
- May have issues with file uploads
- Try Chrome or Firefox

**Internet Explorer:**
- Not supported
- Use modern browser (Chrome, Firefox, Edge, Safari)

**Mobile Browsers:**
- Should work but may have UI issues
- Use desktop for best experience

### 10. Still Not Working?

If none of the above helps:

1. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete
   - Select "Cached images and files"
   - Clear data

2. **Try incognito/private window:**
   - Opens fresh session without cache
   - Rules out cookie/cache issues

3. **Restart development server:**
   ```bash
   # Press Ctrl+C in terminal
   # Then run again:
   npm run dev
   ```

4. **Check for JavaScript errors:**
   - Open F12 console
   - Look for red errors
   - Take screenshot and report issue

5. **Check environment variables:**
   ```bash
   # Make sure .env file exists with:
   SESSION_SECRET=...
   ADMIN_EMAIL=...
   ADMIN_PASSWORD=...
   ```

6. **Try with test data:**
   - Use sample email: test@example.com
   - Use sample phone: 08012345678
   - Upload a small test PDF

### Debug Checklist

- [ ] Browser console open (F12) - no errors
- [ ] All required fields filled
- [ ] CV uploaded (PDF)
- [ ] Declaration checked
- [ ] Submit button is blue/enabled (not grey)
- [ ] Server running (check terminal)
- [ ] No network errors
- [ ] Using supported browser (Chrome/Firefox/Edge)

---

**Quick Fix Summary:**
1. ✅ Check declaration checkbox
2. ✅ Upload CV (PDF)
3. ✅ Fill all required fields (*)
4. ✅ Open browser console for errors
5. ✅ Restart server if needed

If you followed all steps and still have issues, the problem might be with the server configuration or database. Check the server logs for detailed error messages.
