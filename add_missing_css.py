#!/usr/bin/env python3
"""
Add Missing CSS for Headers and Footers

This script adds CSS for .top-banner, header, and footer to ALL HTML files
in guides/ and courses/ directories that are missing these styles.
"""

import os
import re
from pathlib import Path

# CSS template to inject
CSS_TEMPLATE = """
    /* Top Banner */
    .top-banner {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-align: center;
        padding: 0.75rem 1rem;
        font-size: 0.9rem;
    }

    .top-banner a {
        color: white;
        text-decoration: underline;
        margin: 0 0.5rem;
    }

    .top-banner a:hover {
        text-decoration: none;
    }

    /* Header (if not already styled) */
    header {
        background: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 1000;
    }

    .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
    }

    .logo {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.5rem;
        font-weight: 900;
        color: #667eea;
        text-decoration: none;
    }

    header nav ul {
        display: flex;
        list-style: none;
        gap: 2rem;
        margin: 0;
        padding: 0;
    }

    header nav a {
        color: #1e293b;
        text-decoration: none;
        font-weight: 600;
        transition: color 0.3s;
    }

    header nav a:hover,
    header nav a[aria-current="page"] {
        color: #667eea;
    }

    /* Footer */
    footer {
        background: #1e293b;
        color: white;
        padding: 3rem 0 1.5rem;
        margin-top: 4rem;
    }

    .footer-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .footer-section h4 {
        font-size: 1.1rem;
        margin-bottom: 1rem;
    }

    .footer-section ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .footer-section ul li {
        margin-bottom: 0.5rem;
    }

    .footer-section a {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        transition: color 0.3s;
    }

    .footer-section a:hover {
        color: white;
    }

    .footer-bottom {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 2rem;
        text-align: center;
    }

    .social-links {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .social-links a {
        font-size: 1.5rem;
        transition: transform 0.3s;
    }

    .social-links a:hover {
        transform: scale(1.2);
    }
"""

def has_css_for(content, selector):
    """Check if CSS exists for a specific selector"""
    # Look for selector in CSS (between <style> tags)
    pattern = rf'{re.escape(selector)}\s*{{'
    return bool(re.search(pattern, content))

def add_css_to_file(filepath):
    """Add missing CSS to a single HTML file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if file has <style> tag
        if '</style>' not in content:
            return False, "No <style> tag found"

        # Check what's missing
        has_top_banner = has_css_for(content, '.top-banner')
        has_footer = has_css_for(content, 'footer')

        # If both exist, skip
        if has_top_banner and has_footer:
            return False, "CSS already exists"

        # Find the last </style> tag
        style_end_pos = content.rfind('</style>')
        if style_end_pos == -1:
            return False, "No closing </style> tag"

        # Insert CSS before </style>
        new_content = (
            content[:style_end_pos] +
            CSS_TEMPLATE +
            '\n    ' +
            content[style_end_pos:]
        )

        # Write back
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

        return True, "CSS added successfully"

    except Exception as e:
        return False, f"Error: {str(e)}"

def scan_and_fix_directory(base_dir):
    """Scan directory and fix all HTML files"""
    results = {
        'fixed': [],
        'skipped': [],
        'errors': []
    }

    html_files = list(Path(base_dir).rglob('*.html'))

    for filepath in html_files:
        was_fixed, message = add_css_to_file(filepath)

        if was_fixed:
            results['fixed'].append(str(filepath))
        elif 'Error' in message:
            results['errors'].append((str(filepath), message))
        else:
            results['skipped'].append(str(filepath))

    return results

def main():
    print("🔧 Adding Missing CSS to Headers and Footers")
    print("=" * 70)

    # Process guides
    print("\n📚 Processing guides/...")
    guides_results = scan_and_fix_directory('guides')

    # Process courses
    print("\n🎓 Processing courses/...")
    courses_results = scan_and_fix_directory('courses')

    # Combine results
    total_fixed = len(guides_results['fixed']) + len(courses_results['fixed'])
    total_skipped = len(guides_results['skipped']) + len(courses_results['skipped'])
    total_errors = len(guides_results['errors']) + len(courses_results['errors'])

    print("\n" + "=" * 70)
    print("📊 SUMMARY")
    print("=" * 70)
    print(f"✅ Fixed: {total_fixed} files")
    print(f"⏭️  Skipped: {total_skipped} files (already have CSS)")
    print(f"❌ Errors: {total_errors} files")

    if guides_results['fixed']:
        print(f"\n📚 Guides fixed ({len(guides_results['fixed'])}):")
        for f in guides_results['fixed'][:10]:  # Show first 10
            print(f"   ✓ {f}")
        if len(guides_results['fixed']) > 10:
            print(f"   ... and {len(guides_results['fixed']) - 10} more")

    if courses_results['fixed']:
        print(f"\n🎓 Courses fixed ({len(courses_results['fixed'])}):")
        for f in courses_results['fixed'][:10]:  # Show first 10
            print(f"   ✓ {f}")
        if len(courses_results['fixed']) > 10:
            print(f"   ... and {len(courses_results['fixed']) - 10} more")

    if total_errors > 0:
        print(f"\n❌ Errors encountered:")
        for filepath, error in (guides_results['errors'] + courses_results['errors'])[:5]:
            print(f"   ✗ {filepath}: {error}")

    print("\n🎉 Done!")
    print("\n💡 Next steps:")
    print("   1. Review the changes")
    print("   2. Test a few files in browser")
    print("   3. Commit: git add . && git commit -m 'Fix: Add missing header/footer CSS'")

if __name__ == "__main__":
    main()
