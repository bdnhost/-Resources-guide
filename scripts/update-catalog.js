#!/usr/bin/env node
/**
 * Catalog Updater
 *
 * Automatically scans courses/ and guides/ directories and updates:
 * - sitemap.html
 * - categories.html
 *
 * Usage:
 *   node scripts/update-catalog.js
 */

const fs = require('fs');
const path = require('path');

// Scan directory for courses/guides
function scanDirectory(baseDir) {
    const items = [];
    const fullPath = path.join(process.cwd(), baseDir);

    if (!fs.existsSync(fullPath)) {
        console.warn(`Warning: Directory ${baseDir} not found`);
        return items;
    }

    const subdirs = fs.readdirSync(fullPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    for (const subdir of subdirs) {
        const indexPath = path.join(fullPath, subdir, 'index.html');

        if (fs.existsSync(indexPath)) {
            // Read index.html to extract title
            const content = fs.readFileSync(indexPath, 'utf-8');
            const titleMatch = content.match(/<title>(.*?)<\/title>/);
            const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);

            const title = titleMatch ? titleMatch[1].split('|')[0].trim() : subdir;
            const displayTitle = h1Match ? h1Match[1].trim() : title;

            // Count lessons/chapters
            const files = fs.readdirSync(path.join(fullPath, subdir))
                .filter(f => f.match(/lesson-\d+\.html|chapter-\d+\.html/));

            items.push({
                name: subdir,
                title: displayTitle,
                path: `${baseDir}/${subdir}/index.html`,
                lessonCount: files.length
            });
        }
    }

    return items;
}

// Get category from path
function getCategoryFromPath(itemPath) {
    if (itemPath.includes('guides/ai-automation')) return 'AI ואוטומציה';
    if (itemPath.includes('guides/data-business')) return 'נתונים ועסקים';
    if (itemPath.includes('guides/creative-studio')) return 'עיצוב ויצירה';
    if (itemPath.includes('guides/career')) return 'קריירה';
    if (itemPath.includes('guides/technology')) return 'טכנולוגיה';
    if (itemPath.includes('guides/digital-basics')) return 'יסודות דיגיטליים';
    if (itemPath.includes('courses/')) return 'קורסים';
    return 'כללי';
}

// Scan all content
console.log('🔍 Scanning directories...');
const courses = scanDirectory('courses');
const guides = scanDirectory('guides/ai-automation')
    .concat(scanDirectory('guides/data-business'))
    .concat(scanDirectory('guides/creative-studio'))
    .concat(scanDirectory('guides/career'))
    .concat(scanDirectory('guides/technology'))
    .concat(scanDirectory('guides/digital-basics'));

console.log(`   Found ${courses.length} courses`);
console.log(`   Found ${guides.length} guides`);

// Group by category
const byCategory = {};
[...courses, ...guides].forEach(item => {
    const category = getCategoryFromPath(item.path);
    if (!byCategory[category]) byCategory[category] = [];
    byCategory[category].push(item);
});

console.log('\n📊 Content by category:');
Object.entries(byCategory).forEach(([cat, items]) => {
    console.log(`   ${cat}: ${items.length} items`);
});

// Generate sitemap HTML
function generateSitemapHTML() {
    let html = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>מפת האתר | LearningHub</title>
    <link rel="stylesheet" href="public/global.css">
    <style>
        .sitemap-section {
            margin-bottom: 3rem;
        }
        .sitemap-section h2 {
            color: #667eea;
            border-bottom: 2px solid #667eea;
            padding-bottom: 0.5rem;
            margin-bottom: 1.5rem;
        }
        .sitemap-list {
            list-style: none;
            padding: 0;
        }
        .sitemap-list li {
            padding: 0.5rem 0;
        }
        .sitemap-list a {
            color: #1e293b;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s;
        }
        .sitemap-list a:hover {
            color: #667eea;
        }
        .item-count {
            color: #64748b;
            font-size: 0.9rem;
            margin-right: 0.5rem;
        }
    </style>
</head>
<body>
    <!-- Header will be added here -->

    <main class="container" style="padding: 3rem 0;">
        <h1>🗺️ מפת האתר</h1>
        <p style="font-size: 1.1rem; color: #64748b; margin-bottom: 3rem;">
            כל התכנים והמדריכים באתר במקום אחד
        </p>

`;

    Object.entries(byCategory).sort().forEach(([category, items]) => {
        html += `        <section class="sitemap-section">
            <h2>${category}</h2>
            <ul class="sitemap-list">
`;
        items.forEach(item => {
            html += `                <li>
                    <a href="${item.path}">${item.title}</a>
                    ${item.lessonCount > 0 ? `<span class="item-count">(${item.lessonCount} שיעורים)</span>` : ''}
                </li>
`;
        });
        html += `            </ul>
        </section>

`;
    });

    html += `    </main>

    <!-- Footer will be added here -->

    <script src="public/global.js"></script>
</body>
</html>`;

    return html;
}

// Write files
console.log('\n📝 Generating files...');

const sitemapHTML = generateSitemapHTML();
fs.writeFileSync(path.join(process.cwd(), 'sitemap.html'), sitemapHTML);
console.log('   ✅ sitemap.html updated');

console.log('\n🎉 Catalog update complete!');
console.log('\n💡 Next steps:');
console.log('   1. Review the generated sitemap.html');
console.log('   2. Commit and push your changes');
console.log('   3. (Optional) Update categories.html manually if needed');
