# Pre-Production Checklist

**Production website:** [https://sitebotgpt.com](https://sitebotgpt.com)

Use this before going live. Payment APIs (Stripe, Razorpay, PayPal) use **test keys** in development and are switched to **live keys** after deploying to production.

---

## 1. Environment (production)

- [ ] **DATABASE_URL** — Production MySQL (not localhost)
- [ ] **NEXTAUTH_URL** — `https://sitebotgpt.com`
- [ ] **NEXT_PUBLIC_APP_URL** — `https://sitebotgpt.com`
- [ ] **AUTH_SECRET** — Strong random value (e.g. `openssl rand -base64 32`); keep secret
- [ ] **OPENAI_API_KEY** — Valid key; never exposed to client
- [ ] **NEXT_PUBLIC_DEMO_BOT_ID** — ID of the bot used on landing/demo (create & train first)
- [ ] **CRON_SECRET** — If using cron for source refresh; set and use in `x-cron-secret` header
- [ ] **EMAIL_SERVER** / **EMAIL_FROM** — Production SMTP for magic links, password reset
- [ ] **GOOGLE_CLIENT_ID** / **GOOGLE_CLIENT_SECRET** — If using Google OAuth; add production redirect URI in Google Console

---

## 2. Payment APIs (update after deploying to production)

Payment is **not** configured until you set live keys and production webhooks. Do this **after** the app is deployed so webhook URLs are reachable.

### Stripe

- [ ] In Stripe Dashboard → API keys: use **Live** keys (not Test)
- [ ] Set in `.env`:
  - `STRIPE_SECRET_KEY=sk_live_...`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`
- [ ] Webhooks → Add endpoint: `https://sitebotgpt.com/api/stripe/webhook`
- [ ] Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
- [ ] Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET=whsec_...`
- [ ] Create Products/Prices (Growth & Scale, monthly/yearly); set:
  - `STRIPE_PRICE_GROWTH_MONTHLY`, `STRIPE_PRICE_GROWTH_YEARLY`
  - `STRIPE_PRICE_SCALE_MONTHLY`, `STRIPE_PRICE_SCALE_YEARLY`
- [ ] Run `npm run db:seed` so plans get these Price IDs

### Razorpay (if offering India / INR)

- [ ] Razorpay Dashboard → API Keys: use **Live** keys
- [ ] Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
- [ ] Webhooks → URL: `https://sitebotgpt.com/api/razorpay/webhook`; set secret → `RAZORPAY_WEBHOOK_SECRET`
- [ ] Create Plans (Growth/Scale, monthly/yearly); set env and run `npm run db:seed`

### PayPal (if offering international)

- [ ] PayPal Developer → use **Live** app credentials
- [ ] Set `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`
- [ ] `PAYPAL_API_BASE=https://api-m.paypal.com` (not sandbox)
- [ ] Webhook URL: `https://sitebotgpt.com/api/paypal/webhook`; set `PAYPAL_WEBHOOK_ID`
- [ ] Create Plans; set env and run `npm run db:seed`

---

## 3. Database & app

- [ ] `npx prisma db push` (or `prisma migrate deploy`) on production DB
- [ ] `npm run db:seed` after setting Stripe/Razorpay/PayPal Price/Plan IDs
- [ ] Ensure `public/uploads` exists and is writable on server

---

## 4. Security (from DEPLOYMENT.md)

- [ ] Firewall: allow 80, 443; enable ufw
- [ ] Strong MySQL password
- [ ] AUTH_SECRET random and secret
- [ ] No API keys in client bundle (only `NEXT_PUBLIC_*` are exposed)
- [ ] Rate limiting (app has built-in for chat API)

---

## 5. Post-deploy verification

- [ ] Homepage and /demo load; demo bot responds
- [ ] Login/signup (email + Google if configured)
- [ ] Dashboard: create bot, add source, train
- [ ] Pricing: one test payment with live gateway (then refund if needed)
- [ ] Billing portal: “Manage billing” works (Stripe)
- [ ] Webhooks: in Stripe/Razorpay/PayPal dashboards, confirm events are received (200 OK)

---

**Summary:** Payment APIs are updated **after** deploying to production: switch to **live** keys, register **production** webhook URLs, copy new webhook secrets into env, set Price/Plan IDs, and run `db:seed`.
