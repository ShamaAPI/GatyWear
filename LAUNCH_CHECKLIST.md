# Gaty Wear — Launch Checklist

## Domain & SSL
- [ ] Point domain DNS to production host.
- [ ] Enable SSL certificate and force HTTPS.
- [ ] Verify canonical domain redirect (`www` vs non-`www`).

## Database & Backup
- [ ] Confirm production MySQL is reachable from app runtime.
- [ ] Run migrations: `npm run prisma:migrate:deploy`.
- [ ] Take pre-launch DB backup snapshot.
- [ ] Validate restore procedure on a staging clone.

## Environment Variables
- [ ] Set `DATABASE_URL`.
- [ ] Set `AUTH_SESSION_SECRET` (long random secret).
- [ ] Set `NEXT_PUBLIC_SITE_URL`.
- [ ] Set `NEXT_PUBLIC_META_PIXEL_ID` (if enabled).
- [ ] Set `NEXT_PUBLIC_GA_ID` (if enabled).

## Admin Access
- [ ] Create first admin via seed script:
  - `ADMIN_EMAIL=... ADMIN_PASSWORD=... ADMIN_ROLE=admin npm run seed:admin`
- [ ] Verify admin login works in production.
- [ ] Store admin credentials securely (password manager).

## Analytics & Tracking
- [ ] Verify Meta Pixel fires: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase.
- [ ] Verify GA4 fires page views and purchase event.
- [ ] Validate events in browser tools and dashboards.

## Catalog & Assets
- [ ] Replace placeholder product images with real assets.
- [ ] Replace category placeholder images.
- [ ] Validate image compression/size for mobile performance.

## Checkout & Orders
- [ ] Test full order journey on production:
  - add to cart → coupon → checkout → success page
- [ ] Verify order appears in admin orders.
- [ ] Verify status updates: processing → shipped → delivered.
- [ ] Verify shipping/tracking fields save correctly.

## Shipping & Payment
- [ ] Verify governorate shipping fees are correct.
- [ ] Confirm COD policy text and flow are accurate.
- [ ] Validate return/shipping/privacy/terms pages content.

## SEO & Crawlability
- [ ] Verify `robots.txt` is accessible and correct.
- [ ] Verify `sitemap.xml` is accessible.
- [ ] Submit sitemap to Google Search Console.
- [ ] Confirm social metadata previews.

## Final Quality Gate
- [ ] Run `npm run lint`.
- [ ] Run `npm run build -- --webpack`.
- [ ] Perform mobile smoke test on key routes.
- [ ] Confirm no critical console/server errors.

