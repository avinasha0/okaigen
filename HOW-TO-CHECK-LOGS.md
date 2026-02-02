# How to Check Error Logs for Training API

## 🎯 Quick Steps

1. **Trigger the training** - Click "Start training" in your app
2. **Open Vercel Logs** - Go to Vercel Dashboard → Your Project → Logs
3. **Filter logs** - Search for `[train]` or your `botId`
4. **Check browser console** - Open DevTools → Console tab

---

## 📍 Location 1: Vercel Dashboard (Server-Side Logs)

### Step-by-Step:

1. **Go to Vercel Dashboard**
   - URL: https://vercel.com/dashboard
   - Login if needed

2. **Select Your Project**
   - Click on your project name (e.g., "okaigen")

3. **Open Logs**
   - Click **"Logs"** in the top menu bar
   - Or go to: `https://vercel.com/[your-team]/[your-project]/logs`

4. **Filter Logs**
   - In the search/filter box, type: `[train]`
   - Or search for your botId (e.g., `clx123abc`)
   - Select time range: "Last hour" or "Last 24 hours"

5. **What to Look For:**
   ```
   [train] request method= POST url= /api/bots/.../train
   [train] POST botId= ...
   [train] Authenticated user: ... botId= ...
   [train] Error: ...
   ```

### Log Types in Vercel:
- **Function Logs** - Serverless function output (where `[train]` logs appear)
- **Build Logs** - Build-time errors (deployment issues)
- **Edge Logs** - Edge function logs (if using Edge runtime)

---

## 📍 Location 2: Browser Console (Client-Side Logs)

### Step-by-Step:

1. **Open DevTools**
   - Press `F12` or `Ctrl+Shift+I` (Windows/Linux)
   - Or `Cmd+Option+I` (Mac)
   - Or Right-click → "Inspect"

2. **Go to Console Tab**
   - Click the "Console" tab in DevTools

3. **Trigger Training**
   - Click "Start training" button in your app

4. **Check for Errors:**
   ```
   Training error: Error: Training failed (HTTP 405)
   [train] ... (if frontend logs exist)
   ```

5. **Clear Console** (optional)
   - Right-click console → "Clear console"
   - Or press `Ctrl+L`

---

## 📍 Location 3: Network Tab (Request/Response)

### Step-by-Step:

1. **Open DevTools** → **Network Tab**
   - Press `F12` → Click "Network"

2. **Clear Network Logs** (optional)
   - Click the 🚫 icon or press `Ctrl+Shift+R`

3. **Trigger Training**
   - Click "Start training" button

4. **Find the Request:**
   - Look for: `/api/bots/.../train`
   - Filter by: "Fetch/XHR" or search "train"

5. **Check Request Details:**
   - **Status**: Should be 200 (success) or 405/500 (error)
   - **Method**: Should be `POST`
   - **Headers**: Check Request Headers and Response Headers
   - **Response**: Click the request → "Response" tab to see error message

6. **If Status is 405:**
   - Check **Response** tab for error message
   - Check **Headers** → **Request Method** (should be POST)
   - Check **Headers** → **Response Headers** for any clues

---

## 🔍 What Each Log Type Tells You

### Vercel Function Logs (`[train]` prefix):

| Log Message | Meaning | Action |
|------------|---------|--------|
| `[train] request method= POST` | ✅ Handler is running | Check next logs |
| `[train] request method= GET` | ❌ Wrong method sent | Check frontend/proxy |
| `[train] POST botId= ...` | ✅ Route handler started | Good progress |
| `[train] Unauthorized` | ❌ Auth failed | Check session cookies |
| `[train] Bot not found` | ❌ Bot doesn't exist | Check botId |
| `[train] Training error for source:` | ❌ Training failed | Check error message |
| **NO `[train]` logs at all** | ❌ Module load failure | Check env vars |

### Browser Console:

| Error Message | Meaning | Action |
|--------------|---------|--------|
| `Training failed (HTTP 405)` | Server returned 405 | Check Vercel logs |
| `Training failed (HTTP 500)` | Server error | Check Vercel logs for stack trace |
| `Failed to fetch` | Network error | Check internet/Vercel status |
| `Unexpected end of JSON input` | Invalid response | Check Vercel logs |

### Network Tab:

| Status Code | Meaning | Check |
|------------|---------|-------|
| **200** | ✅ Success | Check Response tab for data |
| **405** | ❌ Method not allowed | Check Method (should be POST) |
| **401** | ❌ Unauthorized | Check session cookies |
| **404** | ❌ Not found | Check URL/botId |
| **500** | ❌ Server error | Check Vercel logs |

---

## 🚨 Troubleshooting: No Logs Appearing

### If Vercel logs show nothing:

1. **Check Time Range**
   - Make sure you selected "Last hour" or recent time
   - Logs might be older than default view

2. **Check Filter**
   - Remove any filters/search terms
   - Try searching for just `train` (without brackets)

3. **Check Function Name**
   - In Vercel logs, look for function: `api/bots/[botId]/train`
   - Make sure you're looking at Function Logs, not Build Logs

4. **Wait a Few Seconds**
   - Vercel logs can take 5-10 seconds to appear
   - Refresh the logs page

5. **Check Deployment**
   - Make sure latest code is deployed
   - Check build logs for errors

---

## 📋 Quick Checklist

When debugging 405 error:

- [ ] **Vercel Logs**: Do you see `[train] request method=`?
  - YES → Handler is running, check error logs
  - NO → Module load failure, check env vars

- [ ] **Browser Network**: What's the Request Method?
  - POST → Good, check Response
  - GET → Wrong method, check frontend

- [ ] **Browser Console**: Any error messages?
  - Copy the exact error message

- [ ] **Vercel Logs**: What's the last `[train]` log?
  - Shows where it failed

---

## 🔗 Direct Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Logs Docs**: https://vercel.com/docs/observability/logs
- **Next.js Logging**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers#logging

---

## 💡 Pro Tips

1. **Keep Logs Open**: Open Vercel logs in one tab, app in another
2. **Filter by Time**: Use "Last hour" to see recent logs only
3. **Copy Logs**: Right-click log entry → Copy for sharing
4. **Check Multiple Sources**: Compare Vercel logs + Browser console + Network tab
5. **Test Immediately**: Trigger training right after checking logs for fresh entries
