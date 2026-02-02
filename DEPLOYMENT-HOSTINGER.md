# Deploy Okaigen (Next.js + Prisma + MySQL) to Hostinger Business/Cloud

Step-by-step guide for deploying this Next.js 16 app with Prisma and MySQL on Hostinger’s **Node.js Apps** (Business or Cloud).

---

## 1. Create MySQL database in hPanel

1. Log in to **hPanel** → **Websites** → **Manage** (for your Business/Cloud hosting).
2. Go to **Databases** → **MySQL Databases**.
3. Under **Create a New MySQL Database and User**:
   - **Database name:** e.g. `appdb`
   - **Username:** e.g. `appuser`
   - **Password:** Generate a strong password and save it.
4. Click **Create**.
5. Note from the list:
   - **Full DB name:** e.g. `u123456789_appdb`
   - **Full user:** e.g. `u123456789_appuser`
   - **Host:** usually `localhost`

**Optional:** Use **phpMyAdmin** (from the same page) to create tables or import SQL. For this app you’ll normally use Prisma migrations instead (see step 4).

---

## 2. Deploy the Node.js app (Git or ZIP)

1. In hPanel → **Websites** → **Manage** → **Node.js Apps**.
2. Click **Add Website** (or **Create Node.js App**).
3. Choose **Import Git Repository** (GitHub) or **Upload** (ZIP of the project).
4. **Node.js version:** 20 or 22 (recommended).
5. **Build command:**
   ```bash
   npm ci && npx prisma generate && npm run build
   ```
   (Or if the panel only has one “install” step, use `npm ci` there and set build to: `npx prisma generate && npm run build`.)
6. **Start command:**
   ```bash
   npm start
   ```
7. **Root directory:** Leave default (project root) unless you use a monorepo subfolder.
8. **Domain:** Attach your domain or subdomain (e.g. `app.yourdomain.com` or `yourdomain.com`).
9. Click **Deploy**. Wait for the build to finish.

---

## 3. Environment variables in hPanel

In **Node.js Apps** → your app → **Environment Variables** (or **Settings** → **Env**), add:

### Required (database + auth)

| Variable | Example / notes |
|----------|------------------|
| `DATABASE_URL` | `mysql://u123456789_appuser:YOUR_STRONG_PASSWORD@localhost:3306/u123456789_appdb` |
| `NEXTAUTH_URL` | `https://yourdomain.com` (must match the app URL) |
| `AUTH_SECRET` | Generate: `openssl rand -base64 32` (or use an online generator) |
| `NEXT_PUBLIC_APP_URL` | `https://yourdomain.com` |

### Optional but recommended

| Variable | Notes |
|----------|--------|
| `OPENAI_API_KEY` | For AI features |
| `EMAIL_SERVER` | e.g. `smtps://user%40domain.com:password@smtp.hostinger.com:465` |
| `EMAIL_FROM` | e.g. `noreply@yourdomain.com` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | If using Google OAuth |
| `NEXT_PUBLIC_DEMO_BOT_ID` | Bot ID for landing/demo page |

### Payments (when you enable them)

- **Stripe:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and the `STRIPE_PRICE_*` IDs.
- **Razorpay:** `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, and `RAZORPAY_PLAN_*`.
- **PayPal:** `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID`, `PAYPAL_API_BASE`, `PAYPAL_PLAN_*`.

### Cron (if you use scheduled refresh)

- `CRON_SECRET` – same value you use in the cron job that calls `POST /api/cron/refresh-sources` with header `x-cron-secret`.

Use the same names as in your `.env.example`; only set the ones you need. After changing env vars, **redeploy or restart** the Node.js app if the panel doesn’t do it automatically.

---

## 4. Apply database schema (Prisma)

Your app uses **Prisma** with MySQL. Apply the schema once the app is deployed and `DATABASE_URL` is set.

### Option A: Migrations (recommended for production)

On your **local** machine (with production `DATABASE_URL` in `.env` or in the command):

```bash
# Create migration from current schema (if not already done)
npx prisma migrate dev --name init

# Apply migrations to production DB (run once, pointing at Hostinger DB)
npx prisma migrate deploy
```

To run `migrate deploy` against Hostinger’s MySQL from your PC, your `DATABASE_URL` must reach the server. If Hostinger only allows DB access from the same server, use Option B.

### Option B: Run migrations from Hostinger (SSH or panel)

If Hostinger gives you SSH or a “Run command” in the Node.js app:

```bash
cd /path/to/your/app
npx prisma migrate deploy
```

If you don’t have migrations yet and only use `db push` locally:

```bash
npx prisma db push
```

Use **only one** of: `migrate deploy` (with existing migrations) or `db push` (no migration history). For production, prefer migrations long term.

### Optional: Seed

If you use a seed (e.g. plans, demo data):

```bash
npm run db:seed
```

Run this once after the schema is applied, from the server or with `DATABASE_URL` pointing at the Hostinger DB.

---

## 5. Verify deployment

1. **App URL:** Open `https://yourdomain.com` – the app should load.
2. **Database:** Open `https://yourdomain.com/api/db-test` in the browser. You should see something like `{"db":"ok","result":[...]}`. If you see 500 or “DB error”, check `DATABASE_URL` and that the schema was applied (step 4).
3. **Auth:** Sign up / sign in and confirm NextAuth works (no redirect or 500 errors).
4. **Webhooks:** If you use Stripe/Razorpay/PayPal, set the webhook URLs to `https://yourdomain.com/api/stripe/webhook`, etc., and use the same secrets you put in env.

---

## 6. Build / start commands summary

| Step | Command |
|------|---------|
| Install | `npm ci` (or `npm install`) |
| Build | `npx prisma generate && npm run build` |
| Start | `npm start` |

If the panel has a single “Build” field, use:

```bash
npm ci && npx prisma generate && npm run build
```

Then set **Start** to:

```bash
npm start
```

---

## 7. Troubleshooting

| Issue | What to check |
|-------|----------------|
| Build fails on “Cannot find module '@prisma/client'” | Ensure **Build** includes `npx prisma generate` before `npm run build`. |
| 500 on app or “DB error” on `/api/db-test` | `DATABASE_URL` in hPanel; correct user/password/db name; schema applied (`migrate deploy` or `db push`). |
| NextAuth redirect or session errors | `NEXTAUTH_URL` and `AUTH_SECRET` set in hPanel; `NEXTAUTH_URL` = exact app URL (e.g. `https://yourdomain.com`). |
| Webhooks (Stripe/Razorpay/PayPal) fail | Webhook URL uses HTTPS and correct path; env has the right `*_WEBHOOK_SECRET`. |
| Styles/CSS not applied | `tailwindcss` and `@tailwindcss/postcss` are in `dependencies` (required for build). Hard refresh (Ctrl+Shift+R) to clear cache. |

---

## 8. MySQL connection string format

For Hostinger MySQL, `DATABASE_URL` should look like:

```
mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME
```

- **USER / PASSWORD / DATABASE_NAME:** From step 1 (full username and DB name, e.g. `u123456789_appuser`, `u123456789_appdb`).
- **HOST:** Usually `localhost` when the Node.js app and MySQL are on the same Hostinger account.

If the panel shows a different host (e.g. `mysql.hostinger.com`), use that. Special characters in the password should be URL-encoded (e.g. `@` → `%40`, `#` → `%23`).

---

You’re done. For a minimal run: create MySQL (step 1), deploy the app (step 2), set `DATABASE_URL`, `NEXTAUTH_URL`, and `AUTH_SECRET` (step 3), apply schema (step 4), then check the app and `/api/db-test` (step 5).
