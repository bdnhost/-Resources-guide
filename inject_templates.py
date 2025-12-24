#!/usr/bin/env python3
"""
Script to inject header and footer templates into all HTML files.
This ensures consistent navigation across the entire site.
"""

import os
import re
from pathlib import Path

# Project root
PROJECT_ROOT = Path(__file__).parent

# Load templates
with open(PROJECT_ROOT / 'templates' / 'header.html', 'r', encoding='utf-8') as f:
    HEADER_TEMPLATE = f.read()

with open(PROJECT_ROOT / 'templates' / 'footer.html', 'r', encoding='utf-8') as f:
    FOOTER_TEMPLATE = f.read()


def calculate_root_path(file_path):
    """Calculate the relative path to root from a given file."""
    rel_path = file_path.relative_to(PROJECT_ROOT)
    depth = len(rel_path.parts) - 1

    if depth == 0:
        # File is in root
        return ""
    else:
        # File is in subdirectory
        return "../" * depth


def inject_header_footer(file_path):
    """Inject header and footer into an HTML file."""

    # Calculate root path
    root_path = calculate_root_path(file_path)

    # Prepare header and footer with correct paths
    header = HEADER_TEMPLATE.replace('{{ROOT_PATH}}', root_path)
    footer = FOOTER_TEMPLATE.replace('{{ROOT_PATH}}', root_path)

    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Remove existing header if present (between <body> and first main content)
    # Pattern: <body>...any existing header/banner...until first <section or <main or other content
    content = re.sub(
        r'(<body[^>]*>\s*)(?:.*?<!-- Top Banner -->.*?</header>\s*)?',
        r'\1' + header + '\n\n',
        content,
        count=1,
        flags=re.DOTALL
    )

    # Remove existing footer if present (before </body>)
    # Pattern: <footer>...</footer> before </body>
    content = re.sub(
        r'\s*<footer>.*?</footer>\s*(?=\s*<script|</body>)',
        '\n' + footer + '\n\n',
        content,
        flags=re.DOTALL
    )

    # If no footer was replaced, insert before script or </body>
    if '<footer>' not in content:
        # Try to insert before script tag
        if re.search(r'<script\s+src=', content):
            content = re.sub(
                r'(\s*<script\s+src=)',
                '\n' + footer + '\n\n' + r'\1',
                content,
                count=1
            )
        # Otherwise insert before </body>
        elif '</body>' in content:
            content = re.sub(
                r'(\s*</body>)',
                '\n' + footer + '\n' + r'\1',
                content,
                count=1
            )

    # Only write if content changed
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False


def process_all_files():
    """Process all HTML files in the project."""

    # Files to process
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
        if inject_header_footer(file_path):
            updated_count += 1
            print(f"✅ Updated: {file_path.relative_to(PROJECT_ROOT)}")

    print(f"\n{'='*60}")
    print(f"✅ Total files updated: {updated_count}/{len(files_to_process)}")
    print(f"{'='*60}")


if __name__ == '__main__':
    print("🚀 Injecting header and footer templates...\n")
    process_all_files()
