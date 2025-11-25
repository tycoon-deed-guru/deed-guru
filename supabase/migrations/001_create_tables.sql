-- deed.guru Database Schema Migration
-- Run this in Supabase SQL Editor to create all tables

-- Users table (integrates with Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    stripe_customer_id TEXT,
    subscription_tier TEXT DEFAULT 'free',
    subscription_status TEXT DEFAULT 'inactive',
    hedera_account_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties/Deals table
CREATE TABLE IF NOT EXISTS properties (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    units INTEGER,
    raw_data JSONB,
    scores JSONB NOT NULL,
    total_score INTEGER NOT NULL,
    grade TEXT NOT NULL,
    year1_coc TEXT,
    projected_irr TEXT,
    rent_growth_cagr TEXT,
    pop_job_growth TEXT,
    value_add_potential TEXT,
    dscr TEXT,
    submarket_score INTEGER,
    exit_cap_compression_bps INTEGER,
    economic_resilience INTEGER,
    document_type TEXT,
    archived BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Syndications table
CREATE TABLE IF NOT EXISTS syndications (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    creator_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hedera_token_id TEXT UNIQUE NOT NULL,
    token_name TEXT NOT NULL,
    token_symbol TEXT NOT NULL,
    total_tokens INTEGER NOT NULL,
    decimals INTEGER DEFAULT 6,
    total_raise_usd NUMERIC(15, 2) NOT NULL,
    min_investment_usd NUMERIC(15, 2) NOT NULL,
    max_investment_usd NUMERIC(15, 2),
    target_close_date TIMESTAMPTZ,
    status TEXT DEFAULT 'draft',
    amount_raised_usd NUMERIC(15, 2) DEFAULT 0,
    investor_count INTEGER DEFAULT 0,
    regulation_type TEXT,
    accredited_only BOOLEAN DEFAULT TRUE,
    document_url TEXT,
    explorer_url TEXT,
    supply_key_encrypted TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investments table
CREATE TABLE IF NOT EXISTS investments (
    id TEXT PRIMARY KEY,
    syndication_id TEXT NOT NULL REFERENCES syndications(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount_usd NUMERIC(15, 2) NOT NULL,
    token_amount INTEGER NOT NULL,
    ownership_percentage NUMERIC(5, 3),
    hedera_transaction_id TEXT,
    investor_hedera_account TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_method TEXT,
    accreditation_verified BOOLEAN DEFAULT FALSE,
    kyc_completed BOOLEAN DEFAULT FALSE,
    invested_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deals table (pipeline management)
CREATE TABLE IF NOT EXISTS deals (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stage TEXT DEFAULT 'sourced',
    asking_price NUMERIC(15, 2),
    price_per_unit NUMERIC(12, 2),
    cap_rate REAL,
    notes TEXT,
    days_in_stage INTEGER DEFAULT 0,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    stage_changed_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Markets table
CREATE TABLE IF NOT EXISTS markets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    state TEXT NOT NULL,
    median_rent INTEGER,
    rent_growth REAL,
    occupancy REAL,
    pop_growth REAL,
    job_growth REAL,
    total_inventory INTEGER,
    market_score INTEGER,
    trend TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Submarkets table
CREATE TABLE IF NOT EXISTS submarkets (
    id TEXT PRIMARY KEY,
    market_id TEXT NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    median_rent INTEGER,
    occupancy REAL,
    inventory INTEGER,
    trend TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved Searches table
CREATE TABLE IF NOT EXISTS saved_searches (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    query TEXT,
    filters JSONB,
    alerts_enabled BOOLEAN DEFAULT FALSE,
    alert_frequency TEXT DEFAULT 'daily',
    last_alert_sent TIMESTAMPTZ,
    match_count INTEGER DEFAULT 0,
    new_matches INTEGER DEFAULT 0,
    last_run TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    price_alerts BOOLEAN DEFAULT TRUE,
    status_alerts BOOLEAN DEFAULT TRUE,
    notes TEXT,
    initial_price NUMERIC(15, 2),
    current_price NUMERIC(15, 2),
    price_change REAL,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    max_members INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team Members table
CREATE TABLE IF NOT EXISTS team_members (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    display_name TEXT,
    deals_analyzed INTEGER DEFAULT 0,
    investments_sourced INTEGER DEFAULT 0,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team Activities table
CREATE TABLE IF NOT EXISTS team_activities (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Archived Deals table
CREATE TABLE IF NOT EXISTS archived_deals (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT,
    notes TEXT,
    asking_price NUMERIC(15, 2),
    score INTEGER,
    grade TEXT,
    archived_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_deals_user_id ON deals(user_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
CREATE INDEX IF NOT EXISTS idx_syndications_property_id ON syndications(property_id);
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_syndication_id ON investments(syndication_id);
CREATE INDEX IF NOT EXISTS idx_submarkets_market_id ON submarkets(market_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_activities_team_id ON team_activities(team_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE syndications ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE archived_deals ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own data)
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Users can view own properties" ON properties FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own properties" ON properties FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own properties" ON properties FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own properties" ON properties FOR DELETE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own deals" ON deals FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can manage own deals" ON deals FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own searches" ON saved_searches FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can manage own searches" ON saved_searches FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own watchlist" ON watchlist FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can manage own watchlist" ON watchlist FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own investments" ON investments FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can manage own investments" ON investments FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own archived deals" ON archived_deals FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can manage own archived deals" ON archived_deals FOR ALL USING (auth.uid()::text = user_id);

-- Public access for markets (read only)
CREATE POLICY "Markets are publicly readable" ON markets FOR SELECT TO public USING (true);
CREATE POLICY "Submarkets are publicly readable" ON submarkets FOR SELECT TO public USING (true);

-- Team policies (members can view team data)
CREATE POLICY "Team members can view team" ON teams FOR SELECT
    USING (EXISTS (SELECT 1 FROM team_members WHERE team_members.team_id = teams.id AND team_members.user_id = auth.uid()::text));
CREATE POLICY "Team owners can manage team" ON teams FOR ALL
    USING (auth.uid()::text = owner_id);

CREATE POLICY "Team members can view team members" ON team_members FOR SELECT
    USING (EXISTS (SELECT 1 FROM team_members tm WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid()::text));

CREATE POLICY "Team members can view team activities" ON team_activities FOR SELECT
    USING (EXISTS (SELECT 1 FROM team_members WHERE team_members.team_id = team_activities.team_id AND team_members.user_id = auth.uid()::text));

-- Syndications are viewable by all authenticated users (for marketplace)
CREATE POLICY "Authenticated users can view active syndications" ON syndications FOR SELECT
    TO authenticated USING (status = 'active' OR creator_user_id = auth.uid()::text);
CREATE POLICY "Creators can manage syndications" ON syndications FOR ALL
    USING (auth.uid()::text = creator_user_id);
