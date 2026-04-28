# وثيقة المشروع النهائية — Gaty Wear

## SRS + Scope + Sitemap + User Flow + Admin + Database + Execution Plan

**اسم المشروع:** Gaty Wear
**نوع المشروع:** متجر إلكتروني ملابس / Streetwear
**اللغة:** عربي RTL
**العملة:** جنيه مصري EGP
**قاعدة البيانات:** MySQL
**طريقة الطلب:** Guest Checkout
**طريقة الدفع:** Cash on Delivery
**حساب المبيعات:** الطلبات Delivered فقط
**التصميم:** Mobile-First Responsive
**المرحلة الحالية:** MVP قابل للتوسع

---

# 1) نظرة عامة على المشروع

## 1.1 الهدف

إنشاء متجر إلكتروني احترافي باسم **Gaty Wear** لبيع الملابس، يعمل بشكل ممتاز على الموبايل أولًا، مع لوحة تحكم كاملة لإدارة المنتجات، الفئات، المخزون، الكوبونات، الطلبات، الشحن، والتقارير.

المتجر يعتمد على:

* تصفح المنتجات والفئات
* بنرات إعلانية في الصفحة الرئيسية
* صفحة منتج بتفاصيل كاملة
* اختيار لون ومقاس وكمية
* سلة مشتريات
* حجز مخزون لمدة 24 ساعة
* Checkout كضيف
* شحن حسب المحافظة
* كوبونات على منتجات محددة فقط
* الدفع عند الاستلام
* لوحة أدمن لإدارة التشغيل
* تقارير مبيعات على الطلبات Delivered فقط

---

# 2) نطاق المشروع

## 2.1 داخل النطاق

### Storefront

* Home
* Categories
* Category Page
* Search
* Product Details
* Cart
* Checkout
* Order Success
* Contact
* Shipping Policy
* Return Policy
* Privacy Policy
* Terms

### Admin Panel

* Login
* Dashboard
* Products
* Categories
* Banners
* Inventory
* Coupons
* Shipping Governorates
* Orders
* Order Details
* Order Timeline
* Users / Roles
* Settings
* Analytics

---

## 2.2 خارج النطاق في المرحلة الحالية

* Online Payment
* Customer Accounts
* Multi-language
* Multi-currency
* Dynamic shipping by weight/distance
* Full courier API integration في البداية
* Customer order tracking page المتقدمة

---

# 3) Design Direction

## 3.1 الهوية البصرية

* Style: Premium Streetwear
* Primary color: `#111111`
* Accent: Amber CTA
* Background: White / Black
* Typography: Tajawal أو Cairo
* Border radius: 12px
* Minimal, clean, high contrast
* Arabic RTL بالكامل

---

## 3.2 Mobile-First

الموقع يبنى للموبايل أولًا ثم يتوسع للديسكتوب.

### Breakpoints

* Mobile: 360–430px
* Tablet: 768–1024px
* Desktop: 1280px+

---

# 4) Splash Loading Screen

عند فتح الموقع لأول مرة:

* تظهر شاشة Full Screen
* اللوجو في منتصف الشاشة
* Animation خفيف:

  * Fade in
  * Scale بسيط
  * Pulse اختياري
* المدة: 1.5 إلى 2 ثانية
* يظهر مرة واحدة فقط باستخدام `sessionStorage`
* بعده تظهر الصفحة الرئيسية بـ Smooth Fade

---

# 5) Weak Internet / Offline Screen

لو الاتصال ضعيف أو الموقع لم يحمل:

## المحتوى

**الاتصال بالإنترنت ضعيف**
من فضلك تحقق من اتصالك وحاول مرة أخرى

زر:

**إعادة المحاولة**

## السلوك

* تظهر بعد Timeout منطقي
* الزر يعيد تحميل الصفحة أو يعيد المحاولة
* لو الاتصال رجع، الموقع يكمل تلقائيًا
* التصميم بنفس هوية Gaty Wear

---

# 6) Sitemap

## 6.1 Storefront

* `/`
  الصفحة الرئيسية

* `/categories`
  كل الفئات

* `/category/{category-slug}`
  صفحة فئة
  Filters:

  * `?color=`
  * `?size=`
  * `?minPrice=`
  * `?maxPrice=`
  * `?sort=latest|price_asc|price_desc`

* `/search?q={keyword}`
  صفحة البحث

* `/product/{product-slug}`
  تفاصيل المنتج

* `/cart`
  السلة

* `/checkout`
  إتمام الطلب

* `/order/success/{order-number}`
  نجاح الطلب

* `/contact`

* `/shipping-policy`

* `/return-policy`

* `/privacy-policy`

* `/terms`

* `/404`

* `/500`

---

## 6.2 Admin Panel

* `/admin/login`

* `/admin`
  Dashboard

* `/admin/analytics`

* `/admin/banners`

  * `/admin/banners/new`
  * `/admin/banners/{id}/edit`

* `/admin/categories`

  * `/admin/categories/new`
  * `/admin/categories/{id}/edit`

* `/admin/products`

  * `/admin/products/new`
  * `/admin/products/{id}/edit`
  * `/admin/products/{id}/images`
  * `/admin/products/{id}/variants`

* `/admin/inventory`

* `/admin/shipping`

  * `/admin/shipping/new`
  * `/admin/shipping/{id}/edit`

* `/admin/coupons`

  * `/admin/coupons/new`
  * `/admin/coupons/{id}/edit`

* `/admin/orders`

  * `/admin/orders?status=pending|processing|shipped|delivered|canceled`
  * `/admin/orders/{id}`

* `/admin/users`

* `/admin/settings`

* `/admin/logout`

---

# 7) User Flow

## 7.1 الرحلة الأساسية

### 1. Home `/`

العميل يرى:

* بنرات
* فئات
* منتجات مميزة
* Best Sellers
* Sticky Cart Icon على الموبايل

---

### 2. Search `/search?q=`

* يبحث عن منتج
* تظهر النتائج
* لو لا توجد نتائج:

  * **لا توجد نتائج**

---

### 3. Category `/category/{slug}`

* منتجات الفئة
* Filters
* Sorting
* Breadcrumbs:

  * الرئيسية > الفئة

---

### 4. Product `/product/{slug}`

يعرض:

* صور متعددة
* اسم المنتج
* السعر
* الوصف
* اختيار اللون
* اختيار المقاس
* تحديد الكمية
* حالة المخزون

### UX مطلوب

* Sticky CTA على الموبايل:

  * أضف للسلة
  * شراء الآن

* Urgency:

  * **متبقي X قطع فقط**

* Suggested Products

* Breadcrumbs:

  * الرئيسية > الفئة > المنتج

---

### 5. Add to Cart

عند الضغط:

* Loading state
* التحقق من المخزون
* حجز الكمية
* Toast:

  * **تم إضافة المنتج إلى السلة**

### Mini Cart Popup

يظهر بعد الإضافة ويحتوي على:

* المنتج المضاف
* الكمية
* السعر
* زر:

  * إتمام الشراء
  * متابعة التسوق

---

### 6. Buy Now

زر **شراء الآن** ينقل المستخدم مباشرة إلى Checkout بنفس منطق الحجز.

---

### 7. Cart `/cart`

يعرض:

* اسم المنتج
* اللون
* المقاس
* الكمية
* السعر
* الإجمالي

العميل يستطيع:

* زيادة الكمية
* تقليل الكمية
* حذف المنتج
* إدخال كوبون

### Empty State

لو السلة فارغة:

**السلة فارغة**
زر: **ابدأ التسوق**

---

### 8. Checkout `/checkout`

Guest Checkout فقط.

الحقول:

* الاسم
* رقم الهاتف
* العنوان
* المحافظة
* ملاحظات اختيارية

### Phone Validation

رقم الهاتف المصري:

* 11 رقم
* يبدأ بـ 01
* يمنع الحروف

### المحافظة

عند اختيار المحافظة:

* يظهر سعر الشحن
* يتحدث الإجمالي فورًا

### الفاتورة

* Subtotal
* Discount
* Shipping
* Total

### الدفع

* Cash on Delivery فقط

### Trust Elements

* الدفع عند الاستلام
* استبدال خلال X يوم

### UX

* Loading عند Apply Coupon
* Loading عند Confirm Order
* تعطيل زر تأكيد الطلب بعد أول ضغط

---

### 9. Create Order

عند تأكيد الطلب:

* إعادة التحقق من:

  * المخزون
  * الكوبون
  * الشحن

ثم:

* إنشاء Order
* إنشاء Order Items
* تثبيت Snapshot للأسعار والـ variants
* تحويل الحجز إلى بيع:

  * `reserved_qty -= qty`
  * `stock_qty -= qty`

---

### 10. Success `/order/success/{order-number}`

يعرض:

* رقم الطلب
* رسالة تأكيد
* ملخص بسيط
* زر العودة للتسوق
* منتجات مقترحة
* CTA واتساب اختياري

---

# 8) Storefront Functional Requirements

## 8.1 Home

* Banner carousel قابل للسحب
* Square categories بزوايا دائرية بسيطة
* Featured products
* Best sellers
* Sticky cart icon للموبايل
* CTA واضح داخل البنرات

---

## 8.2 Banners

كل Banner يحتوي على:

* صورة Desktop
* صورة Mobile اختيارية
* عنوان اختياري
* Subtitle اختياري
* CTA اختياري
* Target:

  * Product
  * Category
  * URL
* Active / Inactive
* Sort order
* Optional schedule

### Banner Tracking

* كل ضغطة على Banner يتم تسجيلها
* يمكن ترتيب البنرات لاحقًا حسب الأداء

---

## 8.3 Category

* Product Grid
* Filters
* Sorting
* Empty state:

  * **لا يوجد منتجات في هذه الفئة**

---

## 8.4 Product

* Gallery
* Zoom اختياري
* Price EGP
* Variant selector:

  * Color
  * Size
* Quantity selector
* Available stock
* Add to cart
* Buy now
* Suggested products
* Urgency message

---

## 8.5 Cart

* Cart مرتبط بـ `cart_token`
* Backend Session fallback
* تعديل كمية
* حذف منتج
* كوبون
* Continue shopping
* Empty state

---

## 8.6 Checkout

* Guest only
* COD only
* Shipping by governorate
* Coupon validation
* Final server-side validation
* Error handling

---

# 9) Coupons

## 9.1 خصائص الكوبون

* Code unique
* Type:

  * Percentage
  * Fixed
* Value
* Active
* Starts at
* Ends at
* Max uses
* Used count
* Eligible products

---

## 9.2 قواعد الحساب

```text
subtotal = مجموع المنتجات
eligible_subtotal = مجموع المنتجات المؤهلة للكوبون
discount = حسب نوع الكوبون
subtotal_after_discount = subtotal - discount
total = subtotal_after_discount + shipping_fee
```

## 9.3 قواعد مهمة

* الكوبون يطبق فقط على المنتجات المؤهلة
* الشحن لا يدخل في الخصم
* لا يتم الاعتماد على Frontend في الحساب
* الحساب النهائي من Backend فقط

---

## 9.4 رسائل الكوبون

* **كود غير صحيح**
* **الكوبون منتهي**
* **الكوبون لا ينطبق على المنتجات الحالية**
* **تم استهلاك الكوبون بالكامل**

---

# 10) Cart Reservation System

## 10.1 القاعدة

```text
available = stock_qty - reserved_qty
```

## 10.2 Add to Cart

لو المتاح يكفي:

```text
reserved_qty += qty
```

## 10.3 Remove / Decrease

```text
reserved_qty -= delta
```

## 10.4 Checkout Success

```text
reserved_qty -= qty
stock_qty -= qty
```

## 10.5 Cart Expiry

بعد 24 ساعة:

```text
reserved_qty -= qty
delete cart items
```

---

## 10.6 رسائل انتهاء السلة

لو العميل فتح السلة بعد انتهاء المدة:

**تم تفريغ السلة لانتهاء مدة الحجز**

---

# 11) Edge Cases

## 11.1 المنتج نفد

* يعطل زر الإضافة
* تظهر رسالة:

  * **غير متاح**

---

## 11.2 الكمية المطلوبة أكبر من المتاح

* تظهر:

  * **المتاح X فقط**

---

## 11.3 كوبون غير صالح

* رسالة واضحة داخل حقل الكوبون

---

## 11.4 تغيير المحافظة

* الشحن يتغير فورًا
* الإجمالي يتحدث فورًا

---

## 11.5 فشل إنشاء الطلب

* تظهر رسالة:

  * **حدث خطأ، حاول مرة أخرى**
* لا يتم خصم `stock_qty` إلا بعد نجاح إنشاء الطلب
* يتم تسجيل الخطأ في النظام

---

## 11.6 Double Click Protection

* تعطيل زر Confirm Order بعد الضغط
* إظهار Loading

---

# 12) Admin Panel

## 12.1 Admin Auth

* Login
* Sessions آمنة
* Password hashing:

  * bcrypt أو argon2
* Roles:

  * Admin
  * Staff

---

## 12.2 Dashboard

يعرض:

* إجمالي مبيعات Delivered فقط
* عدد الطلبات حسب الحالة
* مبيعات اليوم
* مبيعات الأسبوع
* مبيعات الشهر
* AOV
* Best sellers
* أفضل المحافظات
* Low stock
* Conversion Rate
* Add to Cart Rate
* Checkout Drop-off

---

## 12.3 Analytics

صفحة `/admin/analytics` تشمل:

* Funnel performance
* Product performance
* Banner clicks
* Coupon usage
* Governorate performance

---

## 12.4 Products

* Create / Edit / Delete
* Product images
* Variants
* Stock
* Active / Hidden
* Bulk actions:

  * Activate
  * Deactivate
  * Delete

---

## 12.5 Inventory

* عرض كل Variants
* تعديل سريع للكميات
* فلترة Low Stock
* بحث بالمنتج / SKU

---

## 12.6 Categories

* CRUD
* Image
* Sort order
* Active / Hidden

---

## 12.7 Banners

* CRUD
* Desktop image
* Mobile image
* Target
* Schedule
* Active / Hidden
* Sort order

---

## 12.8 Coupons

* CRUD
* ربط بمنتجات معينة
* Active / Disabled
* Max uses
* Used count
* Bulk actions

---

## 12.9 Shipping Governorates

* CRUD
* Governorate name
* Shipping fee
* Active / Disabled

---

# 13) Orders Management

## 13.1 حالات الطلب

* Pending = جديد
* Processing = قيد التجهيز
* Shipped = تم الشحن / خرج للتوصيل
* Delivered = تم التسليم
* Canceled = ملغي

---

## 13.2 Orders Page

داخل `/admin/orders` تظهر Tabs:

* جديد
* قيد التجهيز
* تم الشحن
* تم التسليم
* ملغي

مع:

* بحث
* فلترة
* تاريخ
* Bulk actions
* تغيير حالة

---

## 13.3 Order Details

داخل `/admin/orders/{id}` يظهر:

* بيانات العميل
* رقم الهاتف
* العنوان
* المحافظة
* المنتجات
* اللون / المقاس
* الكمية
* السعر
* الخصم
* الشحن
* الإجمالي
* حالة الطلب
* ملاحظات داخلية
* Order Timeline
* Shipping actions

---

## 13.4 Order Timeline

داخل تفاصيل الطلب يظهر خط زمني:

* تم إنشاء الطلب
* قيد التجهيز
* تم تسليم الشحنة لشركة الشحن
* رقم التتبع
* تم التسليم
* تم الإلغاء إن وجد

---

## 13.5 Shipping Actions

### في حالة Processing

يظهر زر:

**Mark as Shipped / إنشاء شحنة**

وعند الضغط يطلب:

* شركة الشحن
* رقم التتبع

ثم:

* status = Shipped
* تسجيل `shipped_at`

---

### في حالة Shipped

يظهر زر:

**Mark as Delivered**

ثم:

* status = Delivered
* تسجيل `delivered_at`
* يدخل الطلب في تقارير المبيعات

---

## 13.6 قرار مهم

زر إنشاء الشحنة يظهر من:

**Processing فقط**

ولا يظهر من Pending.

السبب: Pending طلب خام، لازم يتراجع الأول قبل الشحن.

---

# 14) Shipping Implementation Plan

## Phase 1

* إدخال يدوي لشركة الشحن
* إدخال رقم التتبع
* تحديث حالات الطلب يدويًا

## Phase 2

* تكامل Bosta

## Phase 3

* تكامل Aramex

---

# 15) Funnel Tracking

## 15.1 Events

* `view_product`
* `add_to_cart`
* `begin_checkout`
* `purchase`
* `banner_click`
* `coupon_apply`

---

## 15.2 Event Data

* product_id
* product_name
* category
* price
* quantity
* currency
* order_id
* total
* coupon_code

---

## 15.3 Meta Pixel Events

* PageView
* ViewContent
* AddToCart
* InitiateCheckout
* Purchase

---

# 16) SEO & Performance

## 16.1 SEO

لكل صفحة:

* Meta title
* Meta description
* Clean URL
* Open Graph image
* Product structured data لاحقًا

URLs:

* `/product/product-name`
* `/category/category-name`

---

## 16.2 Performance

* WebP images
* Lazy loading
* Optimized image sizes
* Minify CSS / JS
* Cache static assets
* Avoid oversized images
* Mobile performance priority

---

# 17) UX Requirements

## 17.1 Toasts

* **تم إضافة المنتج إلى السلة**
* **تم حذف المنتج من السلة**
* **تم تحديث السلة**

---

## 17.2 Empty States

* Cart:

  * **السلة فارغة**

* Search:

  * **لا توجد نتائج**

* Category:

  * **لا يوجد منتجات في هذه الفئة**

---

## 17.3 Loading States

* Add to cart
* Apply coupon
* Confirm order
* Page loading
* Admin actions

---

## 17.4 Error States

* Stock unavailable
* Invalid coupon
* Expired coupon
* Shipping unavailable
* Server error

---

## 17.5 Conversion Features

* Buy Now
* Mini Cart
* Sticky CTA
* Sticky Cart Icon
* Suggested Products
* Best Sellers
* Urgency message
* Continue shopping
* Buy again

---

# 18) Database Schema

## 18.1 categories

```sql
id
name
slug unique
description nullable
image_url nullable
is_active boolean
sort_order int
created_at
updated_at
```

---

## 18.2 products

```sql
id
category_id FK
name
slug unique
description
price decimal
is_active boolean
created_at
updated_at
```

---

## 18.3 product_images

```sql
id
product_id FK
image_url
sort_order
```

---

## 18.4 product_variants

```sql
id
product_id FK
color
size
sku nullable unique
stock_qty int
reserved_qty int default 0
is_active boolean
UNIQUE(product_id, color, size)
```

---

## 18.5 shipping_governorates

```sql
id
name unique
fee decimal
is_active boolean
```

---

## 18.6 home_banners

```sql
id
title nullable
subtitle nullable
button_text nullable
image_url_desktop not null
image_url_mobile nullable
target_type enum(product, category, url)
target_product_id nullable
target_category_id nullable
target_url nullable
sort_order int default 0
is_active boolean default true
starts_at nullable
ends_at nullable
created_at
updated_at
```

---

## 18.7 coupons

```sql
id
code unique
type enum(percentage, fixed)
value decimal
is_active boolean
starts_at nullable
ends_at nullable
max_uses nullable
used_count int default 0
created_at
updated_at
```

---

## 18.8 coupon_products

```sql
coupon_id FK
product_id FK
PRIMARY KEY(coupon_id, product_id)
```

---

## 18.9 carts

```sql
id
cart_token unique
expires_at datetime
created_at
updated_at
```

---

## 18.10 cart_items

```sql
id
cart_id FK
product_id FK
variant_id FK
qty int
unit_price_snapshot decimal
added_at datetime
```

---

## 18.11 orders

```sql
id
order_number unique
customer_name
customer_phone not null
customer_email nullable
address_text not null
governorate_id FK
shipping_fee_snapshot decimal
status enum(pending, processing, shipped, delivered, canceled)
subtotal decimal
discount_total decimal
total decimal
coupon_id nullable FK
shipping_provider nullable
shipping_company nullable
tracking_number nullable
shipped_at nullable
delivered_at nullable
created_at
updated_at
```

---

## 18.12 order_items

```sql
id
order_id FK
product_id FK
variant_id FK
product_name_snapshot
color_snapshot
size_snapshot
unit_price_snapshot decimal
qty int
line_total decimal
```

---

## 18.13 admin_users

```sql
id
email unique
username unique nullable
password_hash
role enum(admin, staff)
created_at
updated_at
```

---

## 18.14 order_status_logs

```sql
id
order_id FK
from_status nullable
to_status
note nullable
created_by nullable
created_at
```

---

## 18.15 order_internal_notes

```sql
id
order_id FK
note text
created_by FK
created_at
```

---

## 18.16 shipments Optional Later

```sql
id
order_id FK
provider
tracking_number nullable
status
raw_response JSON nullable
created_at
updated_at
```

---

# 19) Security & Validation

## 19.1 Server-side Validation

لازم Backend يتحقق من:

* المخزون
* الكوبون
* الشحن
* السعر
* الإجمالي
* حالة الطلب

---

## 19.2 Security

* حماية Admin Routes
* Password hashing
* XSS protection
* SQL Injection protection
* Rate limit على Login
* CSRF protection إذا استخدمنا Cookies
* عدم تمرير الأسعار من Frontend كحقيقة

---

# 20) Acceptance Criteria

## 20.1 Storefront

* الموقع يعمل على الموبايل بدون كسر
* RTL مضبوط
* البنرات تعمل وتفتح الهدف الصحيح
* Search يعمل
* الفئة تعرض المنتجات
* صفحة المنتج تعرض variants
* لا يمكن إضافة منتج بدون لون ومقاس
* لا يمكن إضافة كمية أكبر من المتاح
* Add to cart يحجز المخزون
* Cart expiry بعد 24 ساعة يفك الحجز
* الكوبون يطبق على المنتجات المؤهلة فقط
* الشحن لا يتم خصمه
* Checkout ينشئ طلب
* Success page تظهر رقم الطلب

---

## 20.2 Admin

* Login آمن
* Dashboard يعرض Delivered sales فقط
* إدارة المنتجات والفئات والبنرات والمخزون
* إدارة الكوبونات والشحن
* إدارة الطلبات
* Order Timeline
* Mark as Shipped من Processing فقط
* Mark as Delivered من Shipped فقط
* Delivered فقط يدخل في تقارير المبيعات

---

# 21) Execution Plan

## Phase 1 — Project Foundation

* Next.js setup
* Tailwind
* RTL
* Layout
* Splash loader
* Offline fallback
* Basic components

---

## Phase 2 — Storefront UI

* Home
* Category
* Product
* Search
* Cart
* Checkout
* Success
* Mock data

---

## Phase 3 — Cart Logic

* Add to cart
* Mini cart
* Quantity updates
* Coupon UI
* Reservation logic mock

---

## Phase 4 — Admin UI

* Dashboard
* Products
* Inventory
* Orders
* Order details
* Timeline
* Shipping actions

---

## Phase 5 — Backend + Database

* MySQL
* Prisma أو ORM مناسب
* Products API
* Cart API
* Checkout API
* Orders API
* Admin APIs

---

## Phase 6 — Tracking

* Meta Pixel
* GA4
* Events
* Purchase tracking

---

## Phase 7 — Testing

* Mobile testing
* Checkout testing
* Coupon testing
* Stock testing
* Admin testing
* Edge cases

---

## Phase 8 — Deployment

* Hosting
* Domain
* SSL
* DB production
* Environment variables
* Backup
* Final QA

---

# 22) Suggested Tech Stack

## Frontend

* Next.js
* TypeScript
* Tailwind CSS
* App Router

## Backend

* Next.js API Routes أو Express

## Database

* MySQL

## ORM

* Prisma

## Hosting

* حسب المتاح:

  * VPS
  * Hostinger
  * Railway
  * Render
  * Vercel للواجهة فقط إذا مناسب

## Deployment

* Local test
* Git commit
* FTP/SFTP upload أو CI/CD حسب النظام
* Backup قبل كل رفع

---

# 23) Codex Execution Strategy

لا يتم إعطاء Codex أمر واحد ضخم.

التنفيذ يتم بالمراحل:

1. Foundation
2. Home
3. Catalog
4. Product
5. Cart
6. Checkout
7. Admin
8. Backend
9. Tracking
10. Testing

بعد كل مرحلة:

```bash
npm run lint
npm run build
npm run dev
```

ولا يتم الانتقال للمرحلة التالية فوق Error.

---

# 24) Final Notes

هذه الوثيقة الآن تشمل:

* SRS
* Scope
* Sitemap
* User Flow
* UX behavior
* Edge cases
* Cart reservation
* Coupon rules
* Shipping management
* Admin order timeline
* Database schema
* Tracking
* SEO
* Performance
* Execution plan

ودي النسخة اللي تتسلم لمطور أو تستخدمها مع Codex بدون ما يرجع يسألك في الأساسيات.
