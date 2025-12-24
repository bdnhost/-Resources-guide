#!/usr/bin/env python3
"""
Fix orphaned HTML elements that remain after cleanup.
"""

import re
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent

def fix_orphaned_elements(file_path):
    """Remove orphaned navigation and closing tags."""

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Find the first </header> tag
    first_header_end = content.find('</header>')
    if first_header_end == -1:
        return False

    # Get everything after the first header
    after_header = content[first_header_end + len('</header>'):]

    # Remove orphaned <nav aria-label="ניווט ראשי"> fragments
    after_header = re.sub(
        r'<nav aria-label="ניווט ראשי">.*?</nav>\s*</div>\s*</div>\s*</header>',
        '',
        after_header,
        flags=re.DOTALL
    )

    # Remove orphaned closing </div> </header> tags
    after_header = re.sub(
        r'^\s*</div>\s*</div>\s*</header>\s*$',
        '',
        after_header,
        flags=re.MULTILINE
    )

    # Remove orphaned </div> tags that appear alone
    lines = after_header.split('\n')
    cleaned_lines = []
    for i, line in enumerate(lines):
        stripped = line.strip()
        # Skip lines that are just closing div tags at the start
        if i < 10 and stripped in ['</div>', '</header>']:
            continue
        cleaned_lines.append(line)

    after_header = '\n'.join(cleaned_lines)

    # Clean up excessive whitespace
    after_header = re.sub(r'\n{4,}', '\n\n\n', after_header)

    # Reconstruct
    cleaned_content = content[:first_header_end + len('</header>')] + after_header

    if cleaned_content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(cleaned_content)
        return True
    return False


def process_all_files():
    """Process all HTML files."""

    files_to_process = []

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
        if fix_orphaned_elements(file_path):
            updated_count += 1
            print(f"✅ Fixed: {file_path.relative_to(PROJECT_ROOT)}")

    print(f"\n{'='*60}")
    print(f"✅ Total files fixed: {updated_count}/{len(files_to_process)}")
    print(f"{'='*60}")


if __name__ == '__main__':
    print("🔧 Fixing orphaned HTML elements...\n")
    process_all_files()
