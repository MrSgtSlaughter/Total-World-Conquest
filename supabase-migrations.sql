-- Total World Conquest - Supabase Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  period INTEGER NOT NULL UNIQUE CHECK (period IN (1, 2, 5, 6)),
  color TEXT NOT NULL UNIQUE CHECK (color IN ('red', 'green', 'yellow', 'blue', 'pink', 'purple')),
  leader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  general_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  diplomat_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  government_type TEXT CHECK (government_type IN ('monarchy', 'theocracy', 'oligarchy', 'tyranny', 'democracy', 'republic', 'empire', 'city-state', 'confederation', 'nomadic-rule')),
  territories_owned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  period INTEGER NOT NULL CHECK (period IN (1, 2, 5, 6)),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  earned_stamps INTEGER DEFAULT 0,
  spent_stamps INTEGER DEFAULT 0,
  selected_countries JSONB DEFAULT '[]'::jsonb,
  is_leader BOOLEAN DEFAULT FALSE,
  is_general BOOLEAN DEFAULT FALSE,
  is_diplomat BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, period)
);

-- Class inventory table
CREATE TABLE IF NOT EXISTS class_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  unit_type TEXT NOT NULL CHECK (unit_type IN ('infantry', 'tank', 'drone', 'civil_unrest', 'icbm', 'battleship', 'nuke')),
  quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(class_id, unit_type)
);

-- Territories table
CREATE TABLE IF NOT EXISTS territories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_name TEXT NOT NULL UNIQUE,
  owner_class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  garrison_units JSONB DEFAULT '{"infantry": 0, "tank": 0}'::jsonb,
  claimed_date TIMESTAMP WITH TIME ZONE,
  last_defended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Battles table
CREATE TABLE IF NOT EXISTS battles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attacker_class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  defender_class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  territory_id UUID NOT NULL REFERENCES territories(id) ON DELETE CASCADE,
  attacker_roll INTEGER NOT NULL CHECK (attacker_roll >= 1 AND attacker_roll <= 20),
  attacker_modifiers INTEGER DEFAULT 0,
  attacker_total INTEGER GENERATED ALWAYS AS (attacker_roll + attacker_modifiers) STORED,
  defender_roll INTEGER NOT NULL CHECK (defender_roll >= 1 AND defender_roll <= 20),
  defender_modifiers INTEGER DEFAULT 0,
  defender_total INTEGER GENERATED ALWAYS AS (defender_roll + defender_modifiers) STORED,
  outcome TEXT NOT NULL CHECK (outcome IN ('attacker_wins', 'defender_wins')),
  units_used JSONB DEFAULT '{"infantry": 0, "tank": 0, "drone": 0, "civil_unrest": 0, "icbm": 0, "battleship": 0, "nuke": 0}'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily polls table
CREATE TABLE IF NOT EXISTS daily_polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  feels_represented BOOLEAN,
  likes_leader BOOLEAN,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(class_id, student_id, date)
);

-- Stamp transactions table
CREATE TABLE IF NOT EXISTS stamp_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK (amount IN (1, 5)),
  reason TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_students_period ON students(period);
CREATE INDEX idx_class_inventory_class_id ON class_inventory(class_id);
CREATE INDEX idx_territories_owner ON territories(owner_class_id);
CREATE INDEX idx_battles_attacker ON battles(attacker_class_id);
CREATE INDEX idx_battles_defender ON battles(defender_class_id);
CREATE INDEX idx_battles_territory ON battles(territory_id);
CREATE INDEX idx_daily_polls_class_date ON daily_polls(class_id, date);
CREATE INDEX idx_stamp_transactions_student ON stamp_transactions(student_id);
CREATE INDEX idx_stamp_transactions_class ON stamp_transactions(class_id);

-- Initialize classes
INSERT INTO classes (period, color) VALUES 
  (1, 'red'),
  (2, 'green'),
  (5, 'yellow'),
  (6, 'blue')
ON CONFLICT DO NOTHING;

-- Initialize class inventories for each class
INSERT INTO class_inventory (class_id, unit_type, quantity)
SELECT c.id, unit_type, 0
FROM classes c
CROSS JOIN (
  SELECT 'infantry' AS unit_type UNION ALL
  SELECT 'tank' UNION ALL
  SELECT 'drone' UNION ALL
  SELECT 'civil_unrest' UNION ALL
  SELECT 'icbm' UNION ALL
  SELECT 'battleship' UNION ALL
  SELECT 'nuke'
) units
ON CONFLICT DO NOTHING;
