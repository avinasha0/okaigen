# How to Seed Plans in Database

Plans need to be seeded in the database for user registration to work. Here are the steps:

## Method 1: Using npm seed script (Recommended)

### Local Development:

```bash
# Make sure DATABASE_URL is set in .env
npm run db:seed
```

This will:
- Create/update Starter, Growth, Scale, and Enterprise plans
- Use plan limits from `src/lib/plans-config.ts`
- Set prices: Starter ($0), Growth ($49), Scale ($149), Enterprise ($999)

### Production (Hostinger):

1. **SSH into your server** (if you have SSH access), or
2. **Use Hostinger's terminal/command runner** (if available), or
3. **Run via Node.js Apps console** (if they provide a command runner)

Then run:
```bash
cd /path/to/your/app
npm run db:seed
```

**Note:** Make sure `DATABASE_URL` is set in your Hostinger Environment Variables.

---

## Method 2: Via Prisma Migrate (Automatic)

If you're using migrations, plans are automatically seeded when migrations run:

### Local:
```bash
npx prisma migrate dev
```

### Production:
```bash
npx prisma migrate deploy
```

The migration file (`prisma/migrations/20240202000000_init/migration.sql`) includes plan inserts at the end (lines 364-369).

**Note:** If you're using `npm start` on Hostinger, migrations run automatically via `scripts/start-with-migrate.js`, which should seed plans.

---

## Method 3: Manual SQL (If needed)

If the above methods don't work, you can manually insert plans via MySQL:

```sql
INSERT INTO `Plan` (`id`, `name`, `dailyLimit`, `botLimit`, `storageLimit`, `teamMemberLimit`, `price`, `isActive`, `createdAt`, `updatedAt`) VALUES
(REPLACE(UUID(), '-', ''), 'Starter', 10, 1, 50, 1, 0, 1, NOW(3), NOW(3)),
(REPLACE(UUID(), '-', ''), 'Growth', 70, 3, 500, 3, 49, 1, NOW(3), NOW(3)),
(REPLACE(UUID(), '-', ''), 'Scale', 334, 10, 2000, 10, 149, 1, NOW(3), NOW(3)),
(REPLACE(UUID(), '-', ''), 'Enterprise', 100000, 999, 10000, 999, 999, 1, NOW(3), NOW(3));
```

---

## Verify Plans Are Seeded

After seeding, verify plans exist:

```bash
# Using Prisma Studio (local)
npx prisma studio

# Or check via MySQL
mysql -u your_user -p your_database
SELECT * FROM Plan;
```

You should see 4 plans: Starter, Growth, Scale, Enterprise.

---

## Troubleshooting

### "Starter plan not found" error:

1. **Check if migrations ran:**
   ```bash
   npx prisma migrate status
   ```

2. **If migrations haven't run:**
   ```bash
   npx prisma migrate deploy
   ```

3. **If migrations ran but plans are missing:**
   ```bash
   npm run db:seed
   ```

4. **Check DATABASE_URL:**
   - Make sure `DATABASE_URL` is correctly set in `.env` (local) or Environment Variables (production)
   - Format: `mysql://user:password@host:3306/database_name`

---

## Plan Details

| Plan | Daily Messages | Bots | Storage (MB) | Team Members | Price |
|------|---------------|------|--------------|--------------|-------|
| Starter | 10 | 1 | 50 | 1 | $0 |
| Growth | 70 | 3 | 500 | 3 | $49 |
| Scale | 334 | 10 | 2000 | 10 | $149 |
| Enterprise | 100,000 | 999 | 10000 | 999 | $999 |

These limits are defined in `src/lib/plans-config.ts` and used by the seed script.
