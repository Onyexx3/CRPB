# Application Form Testing Guide

## Major Changes Made

### ✅ Fixed Issues:
1. **Removed file path validation** from React Hook Form (these are validated separately)
2. **Added comprehensive field validation** with detailed error messages
3. **Real-time validation** - errors show as you type (onChange mode)
4. **Error summary at top** - see all errors in one place
5. **Better visual feedback** - clear warnings about what needs to be fixed
6. **Detailed console logging** - F12 to see exactly what's happening
7. **Submit button always enabled** - click to see validation errors

## How to Test Properly

### Step 1: Refresh the Browser
- Press `Ctrl + Shift + R` or `Cmd + Shift + R` (hard refresh)
- This ensures you have the latest code

### Step 2: Open Developer Console
- Press `F12` key
- Click on "Console" tab
- Leave this open while testing

### Step 3: Fill the Form with Test Data

Use this test data to fill the form quickly:

#### Personal Information
```
Full Name: John Doe
Email: john.doe@test.com
Phone Number: 08012345678
Gender: Male (select from dropdown)
Date of Birth: 1990-01-01 (click date picker)
Location: Kaduna (select from dropdown)
Address: 123 Test Street, Kaduna, Nigeria
```

#### Educational Background
```
Highest Qualification: Bachelor's Degree
Field of Study: Social Sciences
Institution: University of Kaduna
Graduation Year: 2020
```

#### Research Experience
```
☐ KII Experience (optional - check if you want to test)
☐ TGD Experience (optional - check if you want to test)
```

#### Availability
```
Earliest Start Date: (select today or future date)
Availability Status: Immediate (select from dropdown)
```

#### Documents
```
CV: Click "Upload CV" and select any PDF file (max 5MB)
Photo: (Optional) Click "Upload Photo" and select any image
```

#### Declaration
```
☑ Check the declaration checkbox
```

### Step 4: Submit

Click "Submit Application" button.

## What You Should See

### Before Fixing Errors

If you click submit without filling everything, you should see:

1. **Red error box at top** listing all validation errors
2. **Yellow warning box at bottom** showing:
   - Number of validation errors
   - Missing CV
   - Missing declaration
3. **Red text under each field** with specific error
4. **Console messages** showing validation errors

### After Fixing Errors

When all fields are filled correctly:

1. **Error boxes disappear**
2. **Button shows "Submitting Application..."** with spinner
3. **Console shows**: 
   ```
   Form submission triggered
   Submitting form data...
   ```
4. **Success toast** appears: "Application Submitted!"
5. **Auto-redirect** to login page after 2 seconds

## Common Validation Errors

### Field-Specific Errors

| Field | Error Message | Solution |
|-------|--------------|----------|
| Full Name | "Full Name is required" | Enter any name |
| Email | "Invalid email address" | Use format: name@domain.com |
| Phone | "Phone number must be at least 10 digits" | Enter 10+ digit number |
| Gender | "Gender is required" | Select from dropdown |
| DOB | "Date of birth is required" | Use date picker |
| Location | "Location is required" | Select Kaduna or Jos |
| Address | "Address is required" | Enter full address |
| Qualification | "Highest qualification is required" | Enter degree type |
| Field of Study | "Field of study is required" | Enter your field |
| Institution | "Institution is required" | Enter school name |
| Graduation Year | "Graduation year is required" | Enter 4-digit year |
| Availability Date | "Availability date is required" | Select a date |
| Availability Status | "Availability Status is required" | Select from dropdown |
| CV | "CV file is required (PDF format)" | Upload PDF file |
| Declaration | "You must accept the declaration" | Check the checkbox |

## Console Debug Output

When you submit, check console for:

```javascript
// 1. Form submission starts
Form submission triggered {
  data: { fullName: "John Doe", ... },
  cvFile: File,
  declared: true,
  formValid: true,
  errors: {}
}

// 2. If there are errors
Validation errors: [
  "Full Name is required",
  "CV file is required (PDF format)"
]

// 3. If validation passes
Submitting form data... {
  fields: { fullName: "John Doe", ... },
  hasCV: true,
  hasPhoto: false
}

// 4. API response (check Network tab)
POST /api/applications 200 OK
```

## Troubleshooting

### Issue: Errors Not Showing

**Solution:**
1. Hard refresh: `Ctrl + Shift + R`
2. Clear cache: `Ctrl + Shift + Delete`
3. Check console for JavaScript errors (red text)

### Issue: Button Does Nothing

**Solution:**
1. Open F12 console
2. Click submit button
3. Look for "Form submission triggered" message
4. If missing, check for React errors in console

### Issue: "Invalid email address"

**Solution:**
- Email must have @ symbol and domain
- Example: `test@example.com`
- No spaces allowed

### Issue: "Phone number must be at least 10 digits"

**Solution:**
- Enter at least 10 digits
- Examples: `08012345678`, `+2348012345678`

### Issue: Dropdowns Not Selecting

**Solution:**
1. Click the dropdown trigger
2. Wait for menu to open
3. Click your choice
4. Verify it appears in the field

### Issue: Date Picker Not Working

**Solution:**
1. Click the date input field
2. Calendar should pop up
3. Select a date
4. If stuck, type manually: YYYY-MM-DD format

### Issue: CV Upload Fails

**Solution:**
- File must be PDF format (.pdf)
- File must be under 5MB
- Check file isn't corrupted
- Try a different PDF

### Issue: "Email already exists"

**Solution:**
- You've already submitted with this email
- Use the login page instead
- Or use a different email for testing

## Test Scenarios

### Scenario 1: Empty Form Submit
1. Don't fill anything
2. Click Submit
3. **Expected**: See all 13+ errors listed

### Scenario 2: Partial Form Submit
1. Fill only name and email
2. Click Submit
3. **Expected**: See remaining errors listed

### Scenario 3: No CV Upload
1. Fill all fields
2. Check declaration
3. DON'T upload CV
4. Click Submit
5. **Expected**: "CV file is required" error

### Scenario 4: No Declaration
1. Fill all fields
2. Upload CV
3. DON'T check declaration
4. Click Submit
5. **Expected**: "You must accept the declaration" error

### Scenario 5: Complete Valid Submit
1. Fill ALL fields correctly
2. Upload PDF CV
3. Check declaration
4. Click Submit
5. **Expected**: 
   - Success message
   - Redirect to login
   - Application saved to database

### Scenario 6: Real-Time Validation
1. Start typing in email field
2. Type invalid email (e.g., "test")
3. **Expected**: Error appears immediately
4. Complete email (e.g., "test@example.com")
5. **Expected**: Error disappears

## Network Tab Inspection

1. Open F12 → Network tab
2. Fill form and submit
3. Look for `POST /api/applications`
4. Click on it to see:
   - **Request**: FormData with all fields + files
   - **Response**: Success message or error
   - **Status**: 200 (success) or 400/500 (error)

## Success Indicators

✅ **Form Submitted Successfully:**
- Green toast notification
- Console shows success
- Form resets to empty
- Redirects to `/applicant-login` after 2 seconds
- Database has new record

## Visual Feedback Guide

### Red Error Box (Top of Form)
- **When**: Form has validation errors
- **Shows**: List of all errors
- **Disappears**: When all errors fixed

### Yellow Warning Box (Bottom of Form)
- **When**: Missing CV, declaration, or has errors
- **Shows**: What's needed before submit
- **Disappears**: When all requirements met

### Red Text Under Fields
- **When**: Individual field has error
- **Shows**: Specific field error message
- **Disappears**: When field is valid

### Loading Spinner on Button
- **When**: Form is submitting to server
- **Shows**: "Submitting Application..."
- **Duration**: 1-3 seconds typically

## Quick Debug Checklist

Before asking for help, check:

- [ ] Hard refreshed browser (`Ctrl + Shift + R`)
- [ ] F12 console open - no red errors
- [ ] All required fields filled (13 fields + CV)
- [ ] Email format correct (has @ and domain)
- [ ] Phone number 10+ digits
- [ ] Gender selected from dropdown
- [ ] Location selected from dropdown
- [ ] Availability Status selected from dropdown
- [ ] Date of Birth selected/entered
- [ ] Availability Date selected/entered
- [ ] CV uploaded (PDF, under 5MB)
- [ ] Declaration checkbox checked
- [ ] Seeing console messages when clicking submit
- [ ] No network errors in Network tab

## Expected Timeline

1. **0s**: Click Submit button
2. **0.1s**: Console logs appear
3. **0.2s**: Validation runs
4. **0.3s**: If errors → show error messages, STOP
5. **0.5s**: If valid → Send to server
6. **1-2s**: Server processes
7. **2s**: Success toast appears
8. **4s**: Redirect to login

## Still Not Working?

If you've tried everything above and it still doesn't work:

1. **Copy the console output** (right-click → Copy all)
2. **Take a screenshot** of the form with errors
3. **Check the Network tab** for the API call
4. **Note the exact error message** you see
5. **Share these details** for further debugging

---

## Quick Start Test (Copy & Paste Ready)

```
Name: Test User
Email: test@example.com
Phone: 08012345678
Gender: Male
DOB: 1990-01-01
Location: Kaduna
Address: 123 Test Street
Qualification: Bachelor's
Field: Social Sciences
Institution: Test University
Year: 2020
Start Date: [Today's date]
Status: Immediate
CV: [Upload any PDF]
Declaration: ✓
```

Click Submit → Should work! 🎉
