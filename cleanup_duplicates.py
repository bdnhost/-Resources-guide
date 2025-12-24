#!/usr/bin/env python3
"""
Cleanup script to remove duplicate headers and old navigation elements.
"""

import re
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent

def cleanup_file(file_path):
    """Remove duplicate headers and old navigation elements from a file."""

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Find <body> tag
    body_match = re.search(r'<body[^>]*>', content)
    if not body_match:
        return False

    body_end = body_match.end()

    # Find the first occurrence of our injected header (Top Banner + Header)
    first_header_match = re.search(
        r'(<!-- Top Banner -->.*?</header>)',
        content[body_end:],
        re.DOTALL
    )

    if not first_header_match:
        print(f"  ⚠️  No header found in {file_path.name}")
        return False

    # Keep track of where the first header ends
    first_header_end = body_end + first_header_match.end()

    # Now remove ALL duplicate occurrences of:
    # 1. Top Banner divs
    # 2. Duplicate headers that match our template
    # 3. LMS Notice Banners
    # 4. global-nav elements

    # Get everything after the first header
    after_first_header = content[first_header_end:]

    # Remove duplicate Top Banners
    after_first_header = re.sub(
        r'<div class="top-banner">.*?</div>',
        '',
        after_first_header,
        flags=re.DOTALL
    )

    # Remove duplicate Headers that match our template structure
    after_first_header = re.sub(
        r'<!-- Header -->\s*<header>\s*<div class="container">\s*<div class="header-content">.*?</header>',
        '',
        after_first_header,
        flags=re.DOTALL
    )

    # Remove LMS Notice Banner divs
    after_first_header = re.sub(
        r'<!-- LMS Notice Banner -->.*?</div>',
        '',
        after_first_header,
        flags=re.DOTALL
    )

    # Remove standalone LMS banner divs (without comment)
    after_first_header = re.sub(
        r'<div style="background: linear-gradient\(135deg, #28a745.*?</div>\s*</div>',
        '',
        after_first_header,
        flags=re.DOTALL
    )

    # Remove global-nav elements
    after_first_header = re.sub(
        r'<nav class="global-nav">.*?</nav>',
        '',
        after_first_header,
        flags=re.DOTALL
    )

    # Also remove orphaned <div class="container"> that might be from broken duplicates
    # But only if it contains header-content
    after_first_header = re.sub(
        r'<div class="container">\s*<div class="header-content">.*?(?=<div class="top-banner|<header|<!-- |<nav |<div class="container">)',
        '',
        after_first_header,
        flags=re.DOTALL
    )

    # Reconstruct the content
    cleaned_content = content[:first_header_end] + '\n\n' + after_first_header

    # Clean up excessive whitespace (more than 3 newlines)
    cleaned_content = re.sub(r'\n{4,}', '\n\n\n', cleaned_content)

    # Write back if changed
    if cleaned_content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(cleaned_content)
        return True
    return False


def process_all_files():
    """Process all HTML files."""

    files_to_process = []

    # Root level files
    for html_file in PROJECT_ROOT.glob('*.html'):
        if html_file.name not in ['header.html', 'footer.html']:
            files_to_process.append(html_file)

    # Guides
    guides_dir = PROJECT_ROOT / 'guides'
    if guides_dir.exists():
        for html_file in guides_dir.rglob('*.html'):
            files_to_process.append(html_file)

    # Courses
    courses_dir = PROJECT_ROOT / 'courses'
    if courses_dir.exists():
        for html_file in courses_dir.rglob('*.html'):
            files_to_process.append(html_file)

    # Process each file
    updated_count = 0
    for file_path in sorted(files_to_process):
        if cleanup_file(file_path):
            updated_count += 1
            print(f"✅ Cleaned: {file_path.relative_to(PROJECT_ROOT)}")

    print(f"\n{'='*60}")
    print(f"✅ Total files cleaned: {updated_count}/{len(files_to_process)}")
    print(f"{'='*60}")


if __name__ == '__main__':
    print("🧹 Cleaning up duplicate headers and old navigation...\n")
    process_all_files()
