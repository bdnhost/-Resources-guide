# 🎨 Header/Footer Template System

## Overview
This directory contains centralized header and footer templates used across the entire site. These templates ensure consistent navigation and branding.

## Files

### `header.html`
- Top banner with student portal links
- Main navigation header with logo and menu
- Uses `{{ROOT_PATH}}` placeholder for dynamic path resolution

### `footer.html`
- Four-column footer with links
- Social media links
- Copyright information
- Uses `{{ROOT_PATH}}` placeholder for dynamic path resolution

## Usage

### Updating Templates

1. **Edit the template:**
   ```bash
   nano templates/header.html
   # or
   nano templates/footer.html
   ```

2. **Run the injection script:**
   ```bash
   python3 inject_templates.py
   ```

3. **Verify changes:**
   - Check a few files to ensure templates were injected correctly
   - Test navigation links work from different directory levels

4. **Commit changes:**
   ```bash
   git add -A
   git commit -m "Update: Header/footer templates"
   git push
   ```

### Path Resolution

The `{{ROOT_PATH}}` placeholder is automatically replaced based on file location:

- **Root files** (`index.html`, `categories.html`): `{{ROOT_PATH}}` → `` (empty)
  - Example: `href="{{ROOT_PATH}}index.html"` → `href="index.html"`

- **Guides** (`guides/*/file.html`): `{{ROOT_PATH}}` → `../../`
  - Example: `href="{{ROOT_PATH}}index.html"` → `href="../../index.html"`

- **Courses** (`courses/*/file.html`): `{{ROOT_PATH}}` → `../../`
  - Example: `href="{{ROOT_PATH}}index.html"` → `href="../../index.html"`

## Styling

All styles for the templates are in `/public/global.css` under the section:
```css
/* ===== CENTRALIZED HEADER/FOOTER TEMPLATES ===== */
```

### CSS Classes Used

**Header:**
- `.top-banner` - Top notification bar
- `header` - Main header element
- `.header-content` - Header container
- `.logo` - Logo link
- `nav` - Navigation container

**Footer:**
- `footer` - Main footer element
- `.footer-content` - Grid container
- `.footer-section` - Each footer column
- `.footer-bottom` - Copyright area
- `.social-links` - Social media icons

## Architecture

```
templates/
├── header.html      # Header template with {{ROOT_PATH}}
├── footer.html      # Footer template with {{ROOT_PATH}}
└── README.md        # This file

inject_templates.py  # Script to inject templates into all HTML files
```

## How It Works

1. **Template Definition:** HTML templates use `{{ROOT_PATH}}` as placeholder
2. **Path Calculation:** Script calculates relative path depth for each file
3. **Template Injection:** Script replaces old header/footer with new ones
4. **Path Replacement:** `{{ROOT_PATH}}` is replaced with correct path (e.g., `../../`)

## Benefits

✅ **Single Source of Truth** - Update 2 files instead of 120
✅ **Consistent Navigation** - All pages have identical header/footer
✅ **Easy Maintenance** - One script updates everything
✅ **Correct Paths** - Automatic path resolution prevents broken links
✅ **Production Ready** - Works for deployment to any subdirectory

## Troubleshooting

**Templates not updating?**
- Make sure you run `python3 inject_templates.py` after editing templates
- Check file permissions

**Broken links?**
- Verify `{{ROOT_PATH}}` is used in template files
- Check that inject script calculated correct depth
- Test links from different directory levels

**Styling issues?**
- Check `/public/global.css` is loaded correctly
- Verify CSS classes match those in templates
- Clear browser cache

## Example Workflow

```bash
# 1. Edit navigation menu
nano templates/header.html

# 2. Update all files (120 files)
python3 inject_templates.py

# 3. Check result
git status
# Should show 120 modified files

# 4. Commit
git add -A
git commit -m "Update: Navigation menu items"
git push
```

## Notes

- Templates are injected between `<body>` and content, and before `</body>`
- Old headers/footers are automatically removed
- Script is idempotent - safe to run multiple times
- Works with any HTML file structure

---

**Last Updated:** 2025-12-24
**Maintainer:** LearningHub Team
