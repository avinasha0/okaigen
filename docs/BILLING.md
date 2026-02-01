# Billing Setup (Stripe, Razorpay, PayPal)

**Production website:** [https://sitebotgpt.com](https://sitebotgpt.com). All webhook URLs below use this base.

This app supports three payment gateways. After payment, the user's plan (Growth/Scale) is assigned in the DB and limits/features from `plans-config` apply automatically.

- **Razorpay** — for **Indian users** (INR, UPI, cards, netbanking).
- **PayPal** — for **international users**.
- **Stripe** — for **international users** (cards, etc.).

## 1. Stripe Dashboard

1. Create a [Stripe account](https://dashboard.stripe.com) and get:
   - **Secret key** (Settings → Developers → API keys) → `STRIPE_SECRET_KEY`
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

2. Create **Products** and **Prices**:
   - Product: "Growth" → Price monthly (e.g. $49/mo) and yearly (e.g. $39/mo, billed yearly). Copy Price IDs.
   - Product: "Scale" → Price monthly (e.g. $149/mo) and yearly (e.g. $119/mo). Copy Price IDs.

3. **Webhook** (Settings → Developers → Webhooks):
   - Endpoint URL: `https://sitebotgpt.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

## 2. Environment

In `.env`:

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

STRIPE_PRICE_GROWTH_MONTHLY=price_...
STRIPE_PRICE_GROWTH_YEARLY=price_...
STRIPE_PRICE_SCALE_MONTHLY=price_...
STRIPE_PRICE_SCALE_YEARLY=price_...
```

## 3. Database

- Run migrations for new Stripe fields: `npx prisma db push` (or `migrate deploy`).
- Seed plans with Price IDs: `npm run db:seed`.

## 4. Flow

- **Checkout**: Dashboard → Pricing → user picks Growth/Scale and monthly/yearly → POST `/api/stripe/create-checkout-session` → redirect to Stripe Checkout.
- **Webhook**: Stripe sends `checkout.session.completed` and `customer.subscription.*` → `/api/stripe/webhook` verifies signature, then creates/updates `UserPlan` and links `User.stripeCustomerId`.
- **Plan assignment**: `getPlanUsage()` reads `UserPlan` → `Plan`; `plans-config` and UI use plan name for limits and features.
- **Manage/cancel**: Settings → Billing → "Manage billing" → POST `/api/stripe/create-portal-session` → redirect to Stripe Customer Portal.

## 5. Local webhook testing (Stripe)

Use [Stripe CLI](https://stripe.com/docs/stripe-cli): `stripe listen --forward-to localhost:3000/api/stripe/webhook` and set `STRIPE_WEBHOOK_SECRET` to the CLI’s signing secret.

---

## Razorpay (India)

1. Create a [Razorpay account](https://dashboard.razorpay.com) and get **Key ID** and **Key Secret** (Settings → API Keys) → `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`.

2. Create **Plans** (Subscriptions → Plans):
   - Create a plan for Growth monthly (amount in paise, period: monthly), copy Plan ID → `RAZORPAY_PLAN_GROWTH_MONTHLY`.
   - Create a plan for Growth yearly (period: yearly) → `RAZORPAY_PLAN_GROWTH_YEARLY`.
   - Same for Scale monthly/yearly → `RAZORPAY_PLAN_SCALE_MONTHLY`, `RAZORPAY_PLAN_SCALE_YEARLY`.

3. **Webhook** (Settings → Webhooks):
   - URL: `https://sitebotgpt.com/api/razorpay/webhook`
   - Events: `subscription.activated`, `subscription.charged`, `subscription.cancelled`, `subscription.completed`, `subscription.expired`
   - Set a **Secret** → `RAZORPAY_WEBHOOK_SECRET`

4. Add env vars and run `npm run db:seed`.

Flow: User clicks Upgrade → chooses "Razorpay (India)" → POST `/api/razorpay/create-subscription` → redirect to `short_url` → after payment Razorpay sends `subscription.activated` → webhook assigns plan.

---

## PayPal (International)

1. Create a [PayPal Developer](https://developer.paypal.com) app and get **Client ID** and **Secret** → `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`. Use sandbox for testing (`PAYPAL_API_BASE=https://api-m.sandbox.paypal.com`).

2. Create **Product** and **Plans** (Subscriptions → create product, then create plan with billing cycle monthly/yearly). Copy Plan IDs → `PAYPAL_PLAN_GROWTH_MONTHLY`, etc.

3. **Webhook** (App → Webhooks):
   - URL: `https://sitebotgpt.com/api/paypal/webhook`
   - Events: `BILLING.SUBSCRIPTION.ACTIVATED`, `BILLING.SUBSCRIPTION.CANCELLED`, `BILLING.SUBSCRIPTION.EXPIRED`, `BILLING.SUBSCRIPTION.SUSPENDED`
   - Copy **Webhook ID** → `PAYPAL_WEBHOOK_ID`

4. Add env vars and run `npm run db:seed`.

Flow: User clicks Upgrade → chooses "PayPal (International)" → POST `/api/paypal/create-subscription` → redirect to `approvalUrl` → user approves in PayPal → PayPal sends `BILLING.SUBSCRIPTION.ACTIVATED` → webhook assigns plan.
