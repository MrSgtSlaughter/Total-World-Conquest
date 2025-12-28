# ⚔️ TOTAL WORLD CONQUEST ⚔️

A multiplayer strategy game for 7th grade social studies using Supabase + React + Phaser with retro pixel art styling.

## 🚀 QUICK START

### 1. Setup Supabase (10 minutes)

1. Go to your Supabase project: https://gebbynwmysweeofozlse.supabase.co
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire contents of `supabase-migrations.sql`
5. Click **Run** (the play button)
6. Wait for the tables to be created

### 2. Clone & Install (5 minutes)

```bash
# Clone the repo (when pushed to GitHub)
git clone https://github.com/MrSgtSlaughter/total-world-conquest.git
cd total-world-conquest

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### 3. How to Use

**STUDENT MODE:**
- Click your period button (1, 2, 5, or 6)
- Select your 3 countries for the day
- View class inventory and territory status
- Take daily poll (Do you feel represented? Do you like your leader?)
- Come up to teacher's desk to receive physical stamps

**TEACHER MODE:**
- Click "CONTROL PANEL"
- Select class period
- Award stamps (+1 or +5) to students
- Monitor inventory and battle outcomes
- View daily poll results
- Execute battles with d20 rolls

## 📊 GAME MECHANICS

### Stamp Economy

| Unit | Unlock at (stamps) | Effect |
|------|---|---|
| Infantry | 8 | +1 to roll (stackable) |
| Tank | 12 | +2 to roll (stackable) |
| Drone | 16 | Roll again if lose |
| Civil Unrest | 20 | -3 to enemy roll |
| ICBM | 28 | +5 cross-continent |
| Battleship | 32 | Cross-continent attack |
| Nuke | 40 | Destroy any territory |

### Combat Rules
- Each class gets **ONE action per class period**
- Actions: Claim unoccupied territory, attack neighboring, or long-range attack
- **+10 modifier cap per turn** (Infantry stacks, Tank stacks, ICBM doesn't, etc.)
- d20 vs teacher's d20
- Ties go to defense

### Participation Stamps
- Students earn **1-5 stamps** based on participation
- **1 stamp** = normal participation
- **5 stamps** = exceptional participation/leadership
- Average: ~20 stamps per student per month

### Daily Poll
- "Do you feel represented by your leader?"
- "Do you like your leader?"
- Helps track leadership satisfaction

## 🏗️ PROJECT STRUCTURE

```
total-world-conquest/
├── src/
│   ├── components/
│   │   ├── StudentDashboard.jsx
│   │   └── TeacherPanel.jsx
│   ├── lib/
│   │   ├── supabase.js       (Supabase client & helpers)
│   │   └── store.js          (Zustand state management)
│   ├── data/
│   │   └── countries.js      (Countries, colors, units)
│   ├── styles/
│   │   └── retro.css         (Retro pixel art styling)
│   ├── App.jsx               (Main app logic)
│   └── main.jsx              (React entry point)
├── index.html
├── vite.config.js
├── package.json
└── supabase-migrations.sql   (Database schema)
```

## 🎨 RETRO STYLING

The entire UI is styled with retro pixel art aesthetics:
- Neon green text on dark background (classic CRT monitor feel)
- Chunky borders and bold typography
- Color-coded classes (Red/Green/Yellow/Blue)
- Pixelated buttons with shadow effects
- Grid-based layout

## 🔧 TECHNICAL STACK

- **Frontend**: React 18 + Zustand (state) + Vite (bundler)
- **Backend**: Supabase (PostgreSQL + real-time)
- **Game Engine**: Phaser.js (ready for animations)
- **Styling**: Pure CSS (no external UI libraries for retro feel)
- **Hosting**: GitHub Pages

## 📱 RESPONSIVE DESIGN

- Desktop-first (optimized for classroom display)
- Tablet-friendly
- Mobile fallback (though game plays best on larger screens)

## 🐛 KNOWN LIMITATIONS (MVP)

- **No animated battle sequences yet** (ready for Phaser integration)
- **No world map visualization** (SVG map ready to implement)
- **No cross-hour alliance system** (can be added)
- **No sound effects** (can be added with Web Audio API)
- **No persistent login** (using period/role selection for MVP)

## 🚀 NEXT STEPS AFTER JAN 6

### Priority 1: Animation & Visual Polish
- Phaser-powered battle animations (d20 rolls, explosions)
- SVG world map with hover effects
- Territory conquest animations

### Priority 2: Advanced Features
- Cross-hour alliance/trade system
- Leadership voting modal
- Real-time battle queue
- Historical battle log

### Priority 3: Content
- Sound effects
- Unit portraits
- Country profile cards
- Achievement badges

## 📞 SUPPORT

**Setup Help:**
1. Check that Supabase tables exist (go to Tables in Supabase dashboard)
2. Verify Supabase credentials in `src/lib/supabase.js`
3. Check browser console for errors (F12 → Console tab)

**Game Questions:**
- Refer to `Total_World_Conquest_4th_Quarter.pdf` for rules
- Check `UNIT_INFO` in `src/data/countries.js` for unit mechanics

## 📄 LICENSE

Created by Jason Slaughter for Portage County Community Schools
