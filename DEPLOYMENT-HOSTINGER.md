# Deploy Okaigen (Next.js + Prisma + MySQL) to Hostinger Business/Cloud

Step-by-step guide for deploying this Next.js 16 app with Prisma and MySQL on Hostinger's **Node.js Apps** (Business or Cloud).

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

---

## 2. Set environment variables **before** first deploy

In **Node.js Apps** → your app → **Environment Variables**, add at minimum:

| Variable | Example |
|----------|---------|
| `DATABASE_URL` | `mysql://u123456789_appuser:PASSWORD@localhost:3306/u123456789_appdb` |
| `NEXTAUTH_URL` | `https://yourdomain.com` |
| `AUTH_SECRET` | Generate: `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | `https://yourdomain.com` |

**Important:** Add these **before** deploying so migrations run during the build.

---

## 3. Deploy the Node.js app (Git or ZIP)

1. In hPanel → **Websites** → **Manage** → **Node.js Apps**.
2. Click **Add Website** (or **Create Node.js App**).
3. Choose **Import Git Repository** (GitHub) or **Upload** (ZIP).
4. **Node.js version:** 20 or 22.
5. **Build command:** `npm run build` (default)
   - `postinstall` runs `prisma generate`
   - `prebuild` runs `prisma migrate deploy` → creates tables automatically
6. **Start command:** `npm start`
7. **Root directory:** Leave default.
8. **Domain:** Attach your domain (e.g. `sitebotgpt.com`).
9. Click **Deploy**.

Tables are created automatically during the build. No manual schema steps.

---

## 4. Additional environment variables (optional)

| Variable | Notes |
|----------|-------|
| `OPENAI_API_KEY` | For AI features |
| `EMAIL_SERVER` / `EMAIL_FROM` | SMTP for magic links |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `NEXT_PUBLIC_DEMO_BOT_ID` | Demo bot for landing page |

See `.env.example` for full list.

---

## 5. Verify deployment

1. **App URL:** Open `https://yourdomain.com`
2. **Database:** Open `https://yourdomain.com/api/db-test` → should show `{"db":"ok",...}`
3. **Auth:** Sign up / sign in

---

## 6. Build / start commands summary

| Step | Command |
|------|---------|
| Install | `npm install` (runs `postinstall` → prisma generate) |
| Build | `npm run build` (runs `prebuild` → prisma migrate deploy, then next build) |
| Start | `npm start` |

Use the default Hostinger build settings.

---

## 7. Troubleshooting

| Issue | What to check |
|-------|---------------|
| Build fails on "Cannot find module '@prisma/client'" | `postinstall` should run prisma generate. Check `.npmrc` has `legacy-peer-deps=true` if needed. |
| 500 or "DB error" on `/api/db-test` | `DATABASE_URL` correct; env vars set **before** first deploy so migrations ran. |
| No tables in database | `DATABASE_URL` must be in env **before** deploy. Redeploy after adding it. |
| NextAuth redirect errors | `NEXTAUTH_URL` = exact app URL. |
| Styles not applied | Tailwind in `dependencies`; hard refresh (Ctrl+Shift+R). |

---

## 8. MySQL connection string

```
mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME
```

URL-encode special chars in password: `@` → `%40`, `#` → `%23`, `)` → `%29`.

---

## 9. Future schema changes

1. Locally: `npx prisma migrate dev --name your_change`
2. Commit the new migration in `prisma/migrations/`
3. Push and redeploy on Hostinger

Migrations run automatically on each deploy.
