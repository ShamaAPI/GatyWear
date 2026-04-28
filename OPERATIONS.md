# إجراءات التشغيل — Gaty Wear

## 1) البرامج المطلوبة (مرة واحدة)
- `Node.js` إصدار LTS (يفضل 20 أو أحدث)
- `npm` (يأتي مع Node.js)
- `Git` لإدارة الإصدارات ورفع التعديلات
- `VS Code` كمحرر أساسي للمشروع
- `PowerShell 7` أو Windows PowerShell لتشغيل السكربتات المحلية
- متصفح حديث (`Chrome` أو `Edge`) لاختبار الواجهة

## 1.1 أدوات مساعدة موصى بها
- `GitHub Desktop` (اختياري) لتسهيل إدارة الـ Git لو تفضّل واجهة رسومية
- إضافات VS Code مفيدة:
  - `ESLint`
  - `Tailwind CSS IntelliSense`
  - `Prettier - Code formatter`
  - `Path Intellisense`

## 2) تجهيز المشروع أول مرة
```bash
npm install
```

## 3) أوامر التشغيل اليومية
- تشغيل بيئة التطوير:
```bash
npm run dev
```

- تشغيل نظيف لو حصلت مشاكل كاش:
```bash
npm run dev:clean
```

- فحص الجودة:
```bash
npm run lint
```

## 4) أوامر البناء (Production)
- البناء الافتراضي:
```bash
npm run build
```

- لو ظهر خطأ `EPERM` على ويندوز:
```bash
npm run build:webpack
```

- تشغيل نسخة الإنتاج بعد البناء:
```bash
npm run start
```

## 5) أوامر الصيانة
- تنظيف ملفات البناء والكاش:
```bash
npm run clean
```

- إعادة تثبيت الاعتماديات بالكامل:
```bash
npm run reinstall
```

## 6) ملاحظات تشغيل مهمة للمشروع
- المشروع حاليًا يعمل بـ Mock Data (بدون قاعدة بيانات).
- التدفق الحالي شامل: Home, Catalog, Product, Cart, Checkout, Success.
- عند أي تعديل كبير اتبع التسلسل:
```bash
npm run lint
npm run build:webpack
```

## 7) Check سريع قبل التسليم
- `lint` بدون أخطاء.
- `build` ناجح (أو `build:webpack` على ويندوز إذا لزم).
- تجربة المسارات الأساسية:
  - `/`
  - `/category/tshirts`
  - `/search?q=tee`
  - `/product/oversized-black-tee`
  - `/cart`
  - `/checkout`
