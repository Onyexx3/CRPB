# SEO Assets Checklist

## Images and Files Required for Complete SEO Implementation

---

## 🚨 Critical Assets (Required Before Deployment)

### 1. Open Graph Image
**File**: `client/public/og-image.jpg`

**Specifications:**
- **Size**: 1200 x 630 pixels
- **Aspect Ratio**: 1.91:1
- **Format**: JPG or PNG
- **Max File Size**: 8 MB
- **Color Mode**: RGB

**Content Recommendations:**
```
┌─────────────────────────────────┐
│   Pharos Observatory Logo       │
│                                 │
│  CULTURAL & RELIGIOUS           │
│  PLURALISM BAROMETER            │
│                                 │
│  Field Officers Recruitment     │
│  Plateau & Kaduna States        │
│                                 │
│  [Map of Nigeria highlighting   │
│   Plateau and Kaduna States]    │
│                                 │
│  Apply Now → yoursite.com       │
└─────────────────────────────────┘
```

**Where It's Used:**
- Facebook shares
- LinkedIn posts
- WhatsApp previews
- Messenger shares
- Any Open Graph-compatible platform

**Testing:**
- https://developers.facebook.com/tools/debug/

---

### 2. Twitter Card Image
**File**: `client/public/twitter-image.jpg`

**Specifications:**
- **Size**: 1200 x 675 pixels
- **Aspect Ratio**: 16:9
- **Format**: JPG or PNG
- **Max File Size**: 5 MB
- **Color Mode**: RGB

**Content Recommendations:**
```
┌──────────────────────────────────────┐
│  Cultural & Religious Pluralism      │
│  Barometer                           │
│  ────────────────────────────────   │
│  Field Officers Needed               │
│  🗺️ Plateau & Kaduna States         │
│  📋 Apply: yoursite.com/apply        │
└──────────────────────────────────────┘
```

**Where It's Used:**
- Twitter/X posts
- Tweet previews
- Twitter cards

**Testing:**
- https://cards-dev.twitter.com/validator

---

### 3. Favicon (Primary)
**File**: `client/public/favicon.png`

**Specifications:**
- **Size**: 32 x 32 pixels
- **Format**: PNG with transparency
- **Alternative**: 16x16, 48x48, 64x64

**OR Multi-Size ICO:**
**File**: `client/public/favicon.ico`
- **Sizes included**: 16x16, 32x32, 48x48
- **Format**: ICO (multi-resolution)

**Content:**
- Project logo/symbol
- Simple, recognizable at small sizes
- Works on both light and dark backgrounds

**Where It's Used:**
- Browser tabs
- Bookmarks
- Address bar
- Browser history

**Tool to Create:**
- https://realfavicongenerator.net/

---

### 4. Apple Touch Icon
**File**: `client/public/apple-touch-icon.png`

**Specifications:**
- **Size**: 180 x 180 pixels
- **Format**: PNG
- **Border**: None (iOS adds automatically)
- **Background**: Opaque (not transparent)

**Content:**
- Same as favicon but larger
- Clear, simple design
- High contrast

**Where It's Used:**
- iOS home screen shortcuts
- Safari bookmarks
- iPad home screen
- MacOS favorites

---

### 5. Logo (Structured Data)
**File**: `client/public/logo.png`

**Specifications:**
- **Size**: 512 x 512 pixels (recommended)
- **Format**: PNG with transparency
- **Aspect Ratio**: 1:1 (square)
- **Background**: Transparent

**Content:**
- Full project logo
- High resolution
- Used in search results

**Where It's Used:**
- Google Knowledge Graph
- Search result enhancements
- Schema.org Organization markup

---

## 📋 Asset Creation Checklist

### Before You Start:
- [ ] Choose brand colors
- [ ] Select fonts (if needed in images)
- [ ] Gather logos (Pharos Observatory, project logo)
- [ ] Get map of Nigeria (with Plateau & Kaduna highlighted)

### Image Creation:
- [ ] Design og-image.jpg (1200x630)
- [ ] Design twitter-image.jpg (1200x675)
- [ ] Create favicon.png (32x32) or favicon.ico (multi-size)
- [ ] Create apple-touch-icon.png (180x180)
- [ ] Create logo.png (512x512)

### Testing:
- [ ] Test OG image on Facebook debugger
- [ ] Test Twitter card on Twitter validator
- [ ] Test favicon displays correctly in browser
- [ ] Test Apple touch icon on iOS device
- [ ] Verify all images load correctly

### Optimization:
- [ ] Compress all images (TinyPNG, ImageOptim)
- [ ] Verify file sizes are reasonable
- [ ] Check color accuracy
- [ ] Ensure text is readable

---

## 🎨 Design Guidelines

### Color Scheme (Suggested)
Based on professional research aesthetics:

**Primary Colors:**
- Deep Blue: #0F172A (trust, stability)
- Teal/Cyan: #06B6D4 (innovation, progress)
- Warm Orange: #F97316 (energy, warmth)

**Accent Colors:**
- Light Gray: #F8FAFC (backgrounds)
- Dark Gray: #334155 (text)
- Success Green: #10B981
- Warning Yellow: #FBBF24

### Typography
**Recommended Fonts:**
- Headers: Inter, Poppins, or Montserrat (bold)
- Body: Inter, Open Sans, or Roboto
- All fonts should be web-safe or embedded

### Visual Elements
**Include:**
- ✓ Pharos Observatory attribution
- ✓ Map of Nigeria (Plateau & Kaduna highlighted)
- ✓ Diverse people imagery (if using photos)
- ✓ Peace/unity symbols
- ✓ Research/documentation icons

**Avoid:**
- ✗ Cluttered designs
- ✗ Too much text
- ✗ Low-resolution images
- ✗ Offensive or divisive imagery
- ✗ Generic stock photos

---

## 🛠️ Tools for Creating Assets

### Design Tools:
1. **Canva** (Easiest)
   - Free templates
   - Correct dimensions built-in
   - Export to various formats
   - https://canva.com

2. **Figma** (Professional)
   - Free for individuals
   - Precise control
   - Collaborative
   - https://figma.com

3. **Adobe Express** (Mid-range)
   - Template library
   - Quick edits
   - Social media presets
   - https://express.adobe.com

4. **GIMP** (Free Desktop)
   - Photoshop alternative
   - Powerful editing
   - All formats
   - https://gimp.org

### Compression Tools:
1. **TinyPNG**
   - https://tinypng.com
   - Reduces file size 70%+
   - Maintains quality

2. **ImageOptim** (Mac)
   - https://imageoptim.com
   - Batch processing
   - Lossless compression

3. **Squoosh** (Google)
   - https://squoosh.app
   - Visual comparison
   - Multiple formats

### Favicon Generators:
1. **RealFaviconGenerator**
   - https://realfavicongenerator.net/
   - All sizes automatically
   - All platforms covered

2. **Favicon.io**
   - https://favicon.io/
   - Text to favicon
   - Simple interface

---

## 📍 File Placement

All files should be placed in:
```
client/public/
├── og-image.jpg           (1200x630)
├── twitter-image.jpg      (1200x675)
├── favicon.png            (32x32)
├── favicon.ico            (optional, multi-size)
├── apple-touch-icon.png   (180x180)
└── logo.png               (512x512)
```

**Important:** These files are served from the root URL:
- `https://yoursite.com/og-image.jpg`
- `https://yoursite.com/favicon.png`
- etc.

---

## ✅ Verification Steps

### After Creating Assets:

1. **Visual Check**
   - [ ] All images render correctly
   - [ ] Text is readable
   - [ ] Colors are accurate
   - [ ] No distortion

2. **Technical Check**
   - [ ] Correct dimensions
   - [ ] Correct format
   - [ ] Optimized file size
   - [ ] No corruption

3. **Placement Check**
   - [ ] Files in `client/public/`
   - [ ] Correct filenames
   - [ ] Referenced in `index.html`
   - [ ] Accessible via URL

4. **Testing Check**
   - [ ] Facebook OG debugger passes
   - [ ] Twitter card validator passes
   - [ ] Favicon shows in browser
   - [ ] Mobile preview works
   - [ ] Schema.org validator passes

---

## 🎯 Quick Start Template

### Canva Template Search Terms:
1. "Open Graph Template"
2. "Social Media Post 1200x630"
3. "Twitter Header 1200x675"
4. "Logo 512x512"
5. "Favicon Template"

### Pre-made Elements to Use:
- Nigeria map outline
- Peace dove/olive branch
- Handshake illustration
- Diverse people silhouettes
- Research/clipboard icons
- Pharos/lighthouse imagery

---

## 📸 Image Content Ideas

### OG Image Options:

**Option 1: Map Focus**
- Large map of Nigeria
- Plateau & Kaduna highlighted
- Title overlay
- CTA button

**Option 2: People Focus**
- Diverse Nigerian faces
- Unity theme
- Project name
- Location text

**Option 3: Data Focus**
- Barometer/gauge visualization
- Statistics overlay
- Professional look
- Brand colors

**Option 4: Logo Focus**
- Large Pharos Observatory logo
- Project title
- Clean, minimal
- Professional

---

## 🔄 Asset Update Schedule

### When to Update Images:

**Immediately:**
- Rebranding
- Logo change
- Major announcement
- URL change

**Quarterly:**
- Refresh statistics
- Update recruitment status
- Add testimonials
- Seasonal variations

**Annually:**
- New project phase
- Impact report release
- Anniversary milestone
- Major achievements

---

## 💡 Pro Tips

1. **Consistency**: Use the same visual style across all images
2. **Branding**: Include Pharos Observatory logo on all assets
3. **Text**: Keep text large and readable (especially on mobile)
4. **Contrast**: Ensure text is readable on background
5. **Testing**: Always test on actual devices
6. **Backup**: Keep source files (PSD, Figma, etc.)
7. **Version**: Name files with version/date if updating
8. **Documentation**: Note changes in CHANGELOG

---

## 📞 Need Help?

### Design Resources:
- Fiverr: Affordable freelance designers
- 99designs: Design contests
- Upwork: Professional designers
- Local design agencies

### Design Communities:
- Dribbble: Design inspiration
- Behance: Portfolio examples
- Reddit r/graphic_design
- Designer News

---

## Summary

**Required Files:** 5
**Estimated Time:** 2-4 hours
**Difficulty:** Beginner-Intermediate
**Tools Needed:** Canva (free) or similar

**Priority Order:**
1. og-image.jpg (most visible)
2. favicon.png (brand recognition)
3. twitter-image.jpg (social sharing)
4. apple-touch-icon.png (iOS users)
5. logo.png (structured data)

---

**Status**: 📋 Assets needed before full SEO deployment
**Next Step**: Create images using guidelines above
**Deadline**: Before public launch
