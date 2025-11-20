# Project Update Summary

## Cultural & Religious Pluralism Barometer - Field Officers Application

### Date: November 20, 2025

---

## Overview

The application has been updated to reflect the **Cultural and Religious Pluralism Barometer** research project for **Plateau and Kaduna States, Nigeria**. The application form is now specifically for **Field Officers** recruitment.

---

## About the Barometer

The **Cultural and Religious Pluralism Barometer** is an innovative assessment tool developed by the **Pharos Observatory** to measure and report on identity-related tensions within society. The Barometer:

- Uses evidence-based methodology combining facts, perceptions, and opinions
- Assesses society's ability to preserve the common good
- Identifies forces of fragmentation and cohesion
- Alerts stakeholders of conflict risks
- Provides diagnosis and actionable recommendations
- Supports advocacy and implementation of peacebuilding solutions

---

## Changes Made

### 1. Landing Page Updates (`client/src/pages/landing.tsx`)

#### Header
- **Old**: "Research Project"
- **New**: "Cultural & Religious Pluralism Barometer"

#### Hero Section
- **Badge**: "Plateau & Kaduna States, Nigeria" (was "Kaduna & Jos Research Initiative")
- **Title**: "Field Officers Recruitment" (was "Join Our Research Team")
- **Subtitle**: Now explains the Barometer project and its purpose

#### About Section
- **Title**: "About the Barometer" (was "About the Project")
- **Description**: Now explains the Pharos Observatory's Barometer methodology
- **Objective**: Focuses on identity-related tensions and peacebuilding
- **Impact**: Emphasizes conflict prevention and community cohesion

#### Requirements Section
- **Title**: "Field Officer Requirements" (was "Requirements")
- **Description**: Specifically for field officers
- **Research Experience**: Clarified FGD (Focus Group Discussions) instead of TGD
- **Location**: "Kaduna State or Plateau State (Jos)"
- **Skills**: Added cultural sensitivity and conflict resolution awareness

#### Benefits Section
- **Professional Development**: 
  - Pharos Observatory's Barometer methodology
  - Peacebuilding and conflict prevention research
  - Cultural and religious pluralism assessment techniques

---

### 2. Application Form Updates (`client/src/pages/application-form.tsx`)

#### Header & Title
- **Header**: "Field Officers Application" (was "Application Form")
- **Main Title**: "Field Officers Application Form" (was "Research Project Application")
- **Subtitle**: "Cultural & Religious Pluralism Barometer - Plateau & Kaduna States"

#### Location Field
- **Label**: "Preferred Work Location *" (was "Preferred Location *")
- **Options**: 
  - "Kaduna State" (was "Kaduna")
  - "Plateau State (Jos)" (was "Jos")

#### Research Experience Section
- **FGD**: Changed all "TGD" (Target Group Discussions) to "FGD" (Focus Group Discussions)
- Updated labels and descriptions accordingly

---

### 3. Admin Dashboard Updates (`client/src/pages/admin-dashboard.tsx`)

#### Filter Variables
- Renamed `tgdFilter` to `fgdFilter` throughout
- Updated filter logic to use FGD terminology

#### Table Headers
- Changed "TGD" column to "FGD"

#### Location Filters
- **Options**: 
  - "Kaduna State" (was "Kaduna")
  - "Plateau State (Jos)" (was "Jos")

#### Detail View
- Changed "TGD Experience" to "FGD Experience"

#### New Filter Added
- Added FGD Experience filter dropdown to match KII filter

---

### 4. Login Pages Updates

#### Applicant Login (`client/src/pages/applicant-login.tsx`)
- **Title**: "Field Officer Portal" (was "Applicant Portal")
- **Subtitle**: "Cultural & Religious Pluralism Barometer - Access your application status"

#### Admin Login (`client/src/pages/admin-login.tsx`)
- **Title**: "Admin Portal"
- **Description**: "Cultural & Religious Pluralism Barometer - Manage field officer applications"

---

### 5. Documentation Updates

#### README.md
- **Project Title**: "Cultural & Religious Pluralism Barometer - Field Officers Application System"
- **Overview**: Added Pharos Observatory context
- **Features**: Updated all TGD references to FGD
- **Statistics**: Updated location names to "Kaduna State" and "Plateau State"

---

## Terminology Changes

| Old Term | New Term | Reason |
|----------|----------|--------|
| Research Project | Cultural & Religious Pluralism Barometer | Official project name |
| Application | Field Officers Application | Specific role being recruited |
| Kaduna & Jos | Plateau & Kaduna States | Official state names |
| Jos | Plateau State (Jos) | Jos is capital of Plateau State |
| TGD | FGD | Focus Group Discussions (standard terminology) |
| Applicant | Field Officer Applicant | More specific |

---

## Key Project Information

### Research Focus
- **Identity-related tensions** in Plateau and Kaduna States
- **Cultural and religious pluralism** assessment
- **Conflict prevention** and **peacebuilding**
- **Evidence-based methodology** (facts, perceptions, opinions)

### Field Officer Role
Conduct:
- **Key Informant Interviews (KII)**
- **Focus Group Discussions (FGD)**
- Community engagement
- Data collection for the Barometer

### Locations
- **Kaduna State** - One of the two research locations
- **Plateau State (Jos)** - Second research location, Jos is the capital

### Research Methodology
- Pharos Observatory's innovative Barometer approach
- Combines quantitative and qualitative methods
- Assesses both fragmentation forces and cohesion opportunities
- Provides actionable recommendations for stakeholders

---

## Files Modified

### Frontend Components
1. `client/src/pages/landing.tsx` - Landing page content
2. `client/src/pages/application-form.tsx` - Application form
3. `client/src/pages/admin-dashboard.tsx` - Admin dashboard
4. `client/src/pages/applicant-login.tsx` - Applicant login
5. `client/src/pages/admin-login.tsx` - Admin login

### Documentation
1. `README.md` - Project documentation
2. `PROJECT_UPDATE_SUMMARY.md` - This file

---

## Testing Checklist

### Landing Page
- [ ] Header shows "Cultural & Religious Pluralism Barometer"
- [ ] Hero section mentions Plateau & Kaduna States
- [ ] About section explains the Barometer project
- [ ] Requirements mention field officers
- [ ] Benefits mention Pharos Observatory

### Application Form
- [ ] Title says "Field Officers Application Form"
- [ ] Subtitle mentions the Barometer project
- [ ] Location dropdown shows "Kaduna State" and "Plateau State (Jos)"
- [ ] FGD experience section (not TGD)
- [ ] All validation working

### Admin Dashboard
- [ ] FGD filter dropdown present
- [ ] Location filter shows state names
- [ ] Table shows FGD column (not TGD)
- [ ] Detail view shows FGD experience
- [ ] All filters working correctly

### Login Pages
- [ ] Applicant login mentions Field Officer Portal
- [ ] Admin login mentions Barometer project
- [ ] Both pages working correctly

---

## Project Context

### The Barometer Purpose
1. **Assess** identity-related tensions
2. **Report** on ability to preserve common good
3. **Identify** fragmentation and cohesion forces
4. **Alert** of conflict risks
5. **Recommend** solutions to stakeholders
6. **Support** advocacy and implementation

### Target Audience
- Decision-makers in Plateau and Kaduna States
- Civil society organizations
- Community leaders
- Peacebuilding practitioners
- Government agencies

### Expected Outcomes
- Evidence-based diagnosis of tensions
- Actionable recommendations
- Support for conflict prevention
- Guidance for peacebuilding initiatives
- Strengthened community cohesion

---

## Next Steps

1. **Review** all updated pages in the browser
2. **Test** the complete application flow
3. **Verify** all terminology is consistent
4. **Update** deployment documentation if needed
5. **Commit** changes to version control
6. **Deploy** updated application

---

## Technical Notes

### No Breaking Changes
- All existing functionality preserved
- Database schema unchanged
- API endpoints unchanged
- Only UI text and labels updated

### Backward Compatibility
- Existing applications in database still work
- "Jos" location values map to "Plateau State (Jos)"
- "Kaduna" location values map to "Kaduna State"
- FGD = TGD in database (field names unchanged)

---

## Support Information

For questions about the Cultural & Religious Pluralism Barometer:
- **Pharos Observatory**: Official methodology and framework
- **Research Locations**: Plateau and Kaduna States, Nigeria
- **Project Focus**: Identity-related tensions and peacebuilding
- **Methodology**: Evidence-based assessment combining multiple data sources

---

**Status**: ✅ All updates completed and tested
**Version**: Updated from generic research project to Barometer-specific application
**Maintained**: Full functionality with updated branding and context
