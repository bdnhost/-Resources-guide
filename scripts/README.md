# 🛠️ סקריפטים לניהול תוכן - LearningHub

מערכת סקריפטים לניהול אוטומטי של קורסים ומדריכים באתר.

## 📚 סקריפטים זמינים

### 1. `generate-course.js` - יצירת קורס/מדריך חדש

יוצר מבנה קורס או מדריך חדש עם כל הקבצים הנדרשים.

**שימוש:**

```bash
# יצירת קורס חדש עם 5 שיעורים
node scripts/generate-course.js \
  --type=course \
  --name="my-new-course" \
  --title="הקורס החדש שלי" \
  --lessons=5

# יצירת מדריך חדש
node scripts/generate-course.js \
  --type=guide \
  --name="my-new-guide" \
  --title="המדריך החדש שלי" \
  --lessons=3 \
  --category="ai-automation"
```

**פרמטרים:**
- `--type`: סוג התוכן (`course` או `guide`)
- `--name`: שם התיקייה (באנגלית, עם מקפים)
- `--title`: כותרת בעברית
- `--lessons`: מספר שיעורים (ברירת מחדל: 5)
- `--category`: קטגוריה (רק למדריכים)

**מה הסקריפט יוצר:**
- ✅ תיקייה חדשה בנתיב המתאים
- ✅ קובץ `index.html` עם רשימת שיעורים
- ✅ קבצי `lesson-X.html` לכל שיעור
- ✅ כל הקבצים כוללים header/footer סטנדרטיים
- ✅ עיצוב אחיד עם שאר האתר

---

### 2. `update-catalog.js` - עדכון מפת האתר

סורק את כל התיקיות ומעדכן אוטומטית את `sitemap.html`.

**שימוש:**

```bash
node scripts/update-catalog.js
```

**מה הסקריפט עושה:**
- 🔍 סורק את `courses/` ו-`guides/`
- 📊 מזהה קטגוריות אוטומטית
- 📝 יוצר sitemap מעודכן
- ✅ שומר ל-`sitemap.html`

---

## 🚀 תהליך עבודה מומלץ

### הוספת קורס/מדריך חדש:

1. **יצירת התוכן:**
   ```bash
   node scripts/generate-course.js \
     --type=course \
     --name="excel-advanced" \
     --title="Excel מתקדם" \
     --lessons=8
   ```

2. **עריכת הקבצים:**
   - פתח את `courses/excel-advanced/index.html`
   - ערוך את כל קבצי `lesson-X.html`
   - הוסף תוכן, תמונות, וכו'

3. **עדכון הקטלוג:**
   ```bash
   node scripts/update-catalog.js
   ```

4. **בדיקה:**
   - פתח את `sitemap.html` בדפדפן
   - ודא שהקורס מופיע ברשימה

5. **שמירה ל-Git:**
   ```bash
   git add .
   git commit -m "Add: Excel מתקדם course with 8 lessons"
   git push
   ```

---

## 📋 מבנה קבצים שנוצר

```
courses/my-new-course/
├── index.html          # דף ראשי עם רשימת שיעורים
├── lesson-1.html       # שיעור 1
├── lesson-2.html       # שיעור 2
├── lesson-3.html       # שיעור 3
└── ...

guides/ai-automation/my-new-guide/
├── index.html
├── lesson-1.html
└── ...
```

---

## 🎨 התאמה אישית

### שינוי תבנית ברירת המחדל:

ערוך את `scripts/generate-course.js`:

- **CSS**: חפש את `getStylesTemplate()`
- **Header**: חפש את `getHeaderTemplate()`
- **Footer**: חפש את `getFooterTemplate()`

### הוספת קטגוריות חדשות:

ערוך את `scripts/update-catalog.js`:

```javascript
function getCategoryFromPath(itemPath) {
    if (itemPath.includes('guides/my-category')) return 'הקטגוריה שלי';
    // ... קטגוריות נוספות
}
```

---

## ⚠️ הערות חשובות

1. **שמות תיקיות**: השתמש רק באנגלית ומקפים (לא רווחים!)
   - ✅ `my-new-course`
   - ❌ `my new course`

2. **קבצים קיימים**: הסקריפט לא יכתוב על תיקיות קיימות

3. **נתיבים**: כל הנתיבים יחסיים, אז הקבצים יעבדו מכל מקום

4. **עדכון Sitemap**: אל תערוך ידנית את `sitemap.html` - הרץ את הסקריפט!

---

## 🐛 פתרון בעיות

### "Directory already exists"
התיקייה כבר קיימת. בחר שם אחר או מחק את התיקייה הקיימת.

### "node: command not found"
התקן Node.js מ-https://nodejs.org

### הקורס לא מופיע ב-sitemap
ודא שיש `index.html` בתיקייה ושהוא כולל תג `<title>`.

---

## 📞 תמיכה

שאלות? בעיות? פתח issue ב-GitHub או פנה לתמיכה.

---

**נוצר עבור LearningHub** 🎓
