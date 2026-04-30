# Checkout QA Report

## Scope Tested
- Product add-to-cart API path.
- Coupon validation API path.
- Checkout order creation API path.
- Order retrieval by order number.
- Admin order status progression logic (pending → processing → shipped → delivered).

## Test Data Prepared
- Category: `qa-category`
- Product: `qa-product`
- Variant: `Black / L`
- Shipping governorate: `Cairo`
- Coupon: `QA10` (percentage with product restriction)
- Admin user: `admin@gatywear.local`

## Findings
- **Critical discovered and fixed:** proxy auth guard was blocking `/api/admin/login` with `401 Unauthorized`.
  - Fix applied by limiting proxy protection to `/admin/:path*` only and leaving `/api/admin/*` protection to per-route server guards.
  - File: `H:\APP-AI\Codex\Gaty-Wear\src\proxy.ts:1`

## Current Status
- Checkout/auth flow logic is wired and build-valid.
- Live end-to-end verification through local HTTP session still needs one final manual pass in your runtime environment after deploy env variables are finalized.

