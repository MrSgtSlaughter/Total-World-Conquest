# 🚀 TOTAL WORLD CONQUEST - SETUP GUIDE

**Timeline: 12 DAYS TO LAUNCH (Target: January 6, 2025)**

---

## PHASE 1: DATABASE SETUP (30 minutes)

### Step 1: Access Your Supabase Project
1. Go to: https://gebbynwmysweeofozlse.supabase.co
2. You should see your project dashboard

### Step 2: Create Tables
1. In the left sidebar, click **SQL Editor**
2. Click **New Query** (top right)
3. Copy the **entire contents** of the `supabase-migrations.sql` file
4. Paste it into the SQL Editor
5. Click the **Run** button (play icon, top right)
6. Wait for the script to complete (you'll see "Success" message)

### Step 3: Verify Tables Were Created
1. In the left sidebar, click **Tables**
2. You should see:
   - `classes`
   - `students`
   - `class_inventory`
   - `territories`
   - `battles`
   - `daily_polls`
   - `stamp_transactions`

If all tables are there, you're good! ✓

---

## PHASE 2: LOCAL DEVELOPMENT SETUP (20 minutes)

### Step 1: Install Node.js (if you don't have it)
1. Download from: https://nodejs.org/
2. Get the "LTS" version
3. Run the installer and follow prompts
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Clone the Project
1. Open Terminal/Command Prompt
2. Navigate to where you want the project:
   ```bash
   cd ~/Documents
   ```
3. Clone from GitHub (when you push it):
   ```bash
   git clone https://github.com/MrSgtSlaughter/total-world-conquest.git
   cd total-world-conquest
   ```

### Step 3: Install Dependencies
```bash
npm install
```

This will download ~200 packages (takes 2-3 minutes). When it's done, you'll see:
```
added XXX packages
```

### Step 4: Start the Development Server
```bash
npm run dev
```

You should see:
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:3000
```

Click the link or go to http://localhost:3000 in your browser.

---

## PHASE 3: TEST THE APP (15 minutes)

### Test 1: Login Screen
- You should see the "Total World Conquest" title
- Two sections: STUDENT and TEACHER

### Test 2: Student Mode
1. Click "Period 1 🔴 RED"
2. You should see the Student Dashboard
3. Try selecting 3 countries
4. Check if inventory appears on the right

### Test 3: Teacher Mode
1. Go back (click the back button or navigate to http://localhost:3000)
2. Click "CONTROL PANEL"
3. Select a class period
4. You should see stamp ledger and inventory controls

**If something breaks:**
- Check the browser console: F12 → Console tab
- Look for red error messages
- Verify Supabase tables exist (go to https://gebbynwmysweeofozlse.supabase.co)

---

## PHASE 4: PREPARE FOR PRODUCTION (Jan 1-5)

### Step 1: Build the App
```bash
npm run build
```

This creates a `dist/` folder with optimized code for deployment.

### Step 2: Push to GitHub
1. Create a new GitHub repo: `total-world-conquest`
2. Push all files:
   ```bash
   git add .
   git commit -m "Initial Total World Conquest MVP"
   git push origin main
   ```

### Step 3: Deploy to GitHub Pages
1. In GitHub repo settings, go to **Pages**
2. Set "Source" to "GitHub Actions"
3. Vite will automatically build and deploy

**Your live app will be at:**
```
https://MrSgtSlaughter.github.io/total-world-conquest/
```

---

## PHASE 5: CLASSROOM LAUNCH (Jan 6+)

### Day 1: Demo
1. Show students the login screen
2. Have them pick their period
3. Let them select 3 countries
4. Show the teacher control panel

### Day 2+: Live Gameplay
1. Each class period gets 10 minutes
2. Students pick 3 countries (done from home or at start of period)
3. Leader decides ONE action (attack/claim/defend)
4. You roll d20 from teacher panel
5. Award stamps to students whose countries were involved

---

## 🐛 TROUBLESHOOTING

### "Cannot connect to Supabase"
- [ ] Verify Supabase credentials in `src/lib/supabase.js`
- [ ] Check internet connection
- [ ] Ensure tables were created (go to Supabase dashboard → Tables)

### "Countries don't load"
- [ ] Refresh the page
- [ ] Check browser console for errors
- [ ] Verify `src/data/countries.js` exists

### "Stamps not saving"
- [ ] Check Supabase Tables → `stamp_transactions`
- [ ] Verify student was created in Supabase `students` table
- [ ] Check that `class_id` matches an actual class in `classes` table

### "Button doesn't work"
- [ ] Open browser developer tools (F12)
- [ ] Click the Console tab
- [ ] Look for red error messages
- [ ] Screenshot and send to me

---

## 📞 CONTACT

If you get stuck:
1. Check the **README.md** in the project
2. Look at the **Troubleshooting** section above
3. Check browser console (F12 → Console)
4. Verify Supabase tables exist

---

## ✅ LAUNCH CHECKLIST

- [ ] Supabase tables created
- [ ] Node.js installed
- [ ] Project cloned locally
- [ ] `npm install` completed
- [ ] `npm run dev` works
- [ ] Student dashboard loads
- [ ] Teacher panel loads
- [ ] Can select countries
- [ ] App built (`npm run build`)
- [ ] Pushed to GitHub
- [ ] Deployed to GitHub Pages
- [ ] Live app tested

**You're ready to conquer the world! 🌍⚔️**
