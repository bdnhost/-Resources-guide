#!/usr/bin/env node
/**
 * Course/Guide Generator
 *
 * Usage:
 *   node scripts/generate-course.js --type=course --name="my-new-course" --title="הקורס החדש שלי" --lessons=5
 *   node scripts/generate-course.js --type=guide --name="my-new-guide" --title="המדריך החדש שלי"
 *
 * This script generates a complete course or guide structure with:
 * - Index file with proper header/footer
 * - Lesson/chapter files
 * - Consistent styling
 * - Proper navigation
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2).reduce((acc, arg) => {
    const [key, value] = arg.split('=');
    acc[key.replace('--', '')] = value;
    return acc;
}, {});

const { type, name, title, lessons = 5, category = 'general' } = args;

if (!type || !name || !title) {
    console.error('Usage: node generate-course.js --type=course|guide --name="folder-name" --title="Display Title" [--lessons=5] [--category="category"]');
    process.exit(1);
}

// Templates
const getHeaderTemplate = (relativePath = '../../') => `                <a href="#main-content" class="sr-only">דלג לתוכן הראשי</a>

    <!-- Top Banner -->
    <div class="top-banner">
        🎓 <strong>תלמיד רשום?</strong>
        <a href="https://edu-manage.org/">חזור לפורטל לאחר הלימוד</a>
        |
        🚀 <strong>גולש חדש?</strong>
        <a href="https://edu-manage.org/JoinCourse?org=69391901350762829f9a50b1">הצטרף חינם</a>
    </div>

    <!-- Header -->
    <header>
        <div class="container">
            <div class="header-content">
                <a href="${relativePath}index.html" class="logo" aria-label="חזרה לעמוד הבית">
                    <span>🎓</span>
                    <span>LearningHub</span>
                </a>
                <nav aria-label="ניווט ראשי">
                    <ul>
                        <li><a href="${relativePath}index.html">ראשי</a></li>
                        <li><a href="${relativePath}categories.html">קטגוריות</a></li>
                        <li><a href="${relativePath}sitemap.html">מפת אתר</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>
`;

const getFooterTemplate = (relativePath = '../../') => `    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>🎓 LearningHub</h4>
                    <p style="color: rgba(255, 255, 255, 0.7);">פורטל הלמידה והחדשנות המוביל בישראל. כלים דיגיטליים, בינה מלאכותית ואוטומציה לכל מקצוע ותחום.</p>
                </div>
                <div class="footer-section">
                    <h4>למידה</h4>
                    <ul>
                        <li><a href="${relativePath}categories.html">כל הקטגוריות</a></li>
                        <li><a href="${relativePath}guides/ai-automation/python_guide.html">Python</a></li>
                        <li><a href="${relativePath}guides/ai-automation/chatgpt_guide.html">ChatGPT</a></li>
                        <li><a href="${relativePath}guides/data-business/data_analysis_guide.html">ניתוח נתונים</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>משאבים</h4>
                    <ul>
                        <li><a href="${relativePath}sitemap.html">מפת האתר</a></li>
                        <li><a href="${relativePath}guides/ai-automation/prompts.html">ספריית פרומפטים</a></li>
                        <li><a href="${relativePath}guides/ai-automation/ai_ethics.html">אתיקה ב-AI</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>EduManage LMS</h4>
                    <ul>
                        <li><a href="https://edu-manage.org/">כניסה לפורטל</a></li>
                        <li><a href="https://edu-manage.org/JoinCourse?org=69391901350762829f9a50b1">הצטרפות לקורס</a></li>
                        <li><a href="#support">תמיכה טכנית</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <div class="social-links">
                    <a href="#linkedin" aria-label="LinkedIn" title="LinkedIn">💼</a>
                    <a href="#github" aria-label="GitHub" title="GitHub">🐙</a>
                    <a href="#youtube" aria-label="YouTube" title="YouTube">📺</a>
                </div>
                <p style="margin-top: 1rem;">© 2025 פורטל הלמידה והחדשנות | נבנה ע"י יעקב בידני</p>
                <p style="margin-top: 0.5rem; font-size: 0.85rem;">
                    <a href="https://edu-manage.org/" style="color: rgba(255, 255, 255, 0.5);">EduManage</a> • מערכת לניהול פדגוגי ולמידה
                </p>
            </div>
        </div>
    </footer>
`;

const getStylesTemplate = () => `    <style>
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;800;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Heebo', sans-serif;
            background: #f0f4f8;
            color: #1a202c;
            line-height: 1.6;
        }

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

        /* Header */
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
        }
        header nav a {
            color: #1e293b;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s;
        }
        header nav a:hover {
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

        /* Container */
        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* Main Content */
        main {
            min-height: 60vh;
            padding: 3rem 0;
        }

        h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: #1a202c;
        }

        .lesson-card {
            background: white;
            padding: 1.5rem;
            margin-bottom: 1rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-decoration: none;
            display: block;
            color: inherit;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .lesson-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
    </style>`;

const generateIndexFile = (courseType, courseName, courseTitle, lessonCount) => {
    const relativePath = courseType === 'course' ? '../../' : '../../';

    let lessonsHTML = '';
    for (let i = 1; i <= lessonCount; i++) {
        lessonsHTML += `
        <a href="lesson-${i}.html" class="lesson-card">
            <h3>שיעור ${i}</h3>
            <p>תיאור השיעור ${i}</p>
        </a>`;
    }

    return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${courseTitle} | LearningHub</title>
${getStylesTemplate()}
</head>
<body>
${getHeaderTemplate(relativePath)}

    <main class="container">
        <h1>${courseTitle}</h1>
        <p>ברוכים הבאים ל${courseTitle}</p>

        <h2>תוכן העניינים</h2>
        ${lessonsHTML}
    </main>

${getFooterTemplate(relativePath)}
</body>
</html>`;
};

const generateLessonFile = (courseType, courseName, courseTitle, lessonNumber) => {
    const relativePath = courseType === 'course' ? '../../' : '../../';

    return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>שיעור ${lessonNumber} - ${courseTitle} | LearningHub</title>
${getStylesTemplate()}
</head>
<body>
${getHeaderTemplate(relativePath)}

    <main class="container">
        <h1>שיעור ${lessonNumber}: כותרת השיעור</h1>

        <section>
            <h2>מבוא</h2>
            <p>תוכן השיעור כאן...</p>
        </section>

        <nav style="margin-top: 3rem; display: flex; justify-content: space-between;">
            ${lessonNumber > 1 ? `<a href="lesson-${lessonNumber - 1}.html">← שיעור קודם</a>` : '<span></span>'}
            <a href="index.html">חזרה לתוכן</a>
            <a href="lesson-${lessonNumber + 1}.html">שיעור הבא →</a>
        </nav>
    </main>

${getFooterTemplate(relativePath)}
</body>
</html>`;
};

// Create directory structure
const baseDir = type === 'course' ? 'courses' : 'guides';
const fullPath = path.join(process.cwd(), baseDir, name);

if (fs.existsSync(fullPath)) {
    console.error(`Error: Directory ${fullPath} already exists!`);
    process.exit(1);
}

fs.mkdirSync(fullPath, { recursive: true });

// Generate index file
fs.writeFileSync(
    path.join(fullPath, 'index.html'),
    generateIndexFile(type, name, title, parseInt(lessons))
);

// Generate lesson files
for (let i = 1; i <= parseInt(lessons); i++) {
    fs.writeFileSync(
        path.join(fullPath, `lesson-${i}.html`),
        generateLessonFile(type, name, title, i)
    );
}

console.log(`✅ Successfully created ${type}: ${title}`);
console.log(`📁 Location: ${fullPath}`);
console.log(`📝 Files created:`);
console.log(`   - index.html`);
for (let i = 1; i <= parseInt(lessons); i++) {
    console.log(`   - lesson-${i}.html`);
}
console.log('\n💡 Next steps:');
console.log('   1. Edit the generated files with your content');
console.log('   2. Run: node scripts/update-catalog.js');
console.log('   3. Commit and push your changes');
