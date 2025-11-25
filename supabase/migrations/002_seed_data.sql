-- deed.guru Seed Data
-- Run this in Supabase SQL Editor after creating tables

-- Seed Users (create matching users in Supabase Auth first)
INSERT INTO users (id, email, subscription_tier, subscription_status) VALUES
    ('test-user-1', 'test@deedguru.com', 'pro', 'active'),
    ('user-sarah-chen', 'sarah.chen@deedguru.com', 'pro', 'active'),
    ('user-mike-johnson', 'mike.johnson@deedguru.com', 'pro', 'active'),
    ('user-emily-davis', 'emily.davis@deedguru.com', 'free', 'active'),
    ('user-david-kim', 'david.kim@deedguru.com', 'syndicate', 'active')
ON CONFLICT (id) DO NOTHING;

-- Seed Markets (15 Sunbelt Markets)
INSERT INTO markets (id, name, slug, state, median_rent, rent_growth, occupancy, pop_growth, job_growth, total_inventory, market_score, trend) VALUES
    ('market-austin', 'Austin', 'austin', 'TX', 1850, 4.2, 94.8, 3.2, 4.8, 142000, 92, 'up'),
    ('market-phoenix', 'Phoenix', 'phoenix', 'AZ', 1650, 3.8, 95.2, 2.8, 4.1, 198000, 88, 'up'),
    ('market-orlando', 'Orlando', 'orlando', 'FL', 1720, 5.1, 96.1, 2.4, 3.9, 156000, 85, 'up'),
    ('market-nashville', 'Nashville', 'nashville', 'TN', 1780, 4.5, 95.8, 2.1, 3.6, 98000, 87, 'up'),
    ('market-dallas', 'Dallas', 'dallas', 'TX', 1620, 3.2, 93.4, 2.5, 3.8, 285000, 84, 'stable'),
    ('market-denver', 'Denver', 'denver', 'CO', 1920, 2.8, 94.2, 1.8, 2.9, 175000, 82, 'stable'),
    ('market-tampa', 'Tampa', 'tampa', 'FL', 1680, 4.8, 95.5, 2.6, 3.7, 132000, 86, 'up'),
    ('market-atlanta', 'Atlanta', 'atlanta', 'GA', 1580, 3.5, 94.0, 1.9, 3.2, 245000, 83, 'stable'),
    ('market-houston', 'Houston', 'houston', 'TX', 1520, 2.9, 93.8, 2.1, 3.4, 320000, 81, 'stable'),
    ('market-san-antonio', 'San Antonio', 'san-antonio', 'TX', 1380, 3.5, 94.5, 2.3, 3.2, 145000, 79, 'up'),
    ('market-miami', 'Miami', 'miami', 'FL', 2250, 3.9, 95.0, 1.8, 2.8, 215000, 83, 'stable'),
    ('market-jacksonville', 'Jacksonville', 'jacksonville', 'FL', 1550, 4.2, 95.2, 2.4, 3.5, 95000, 80, 'up'),
    ('market-charlotte', 'Charlotte', 'charlotte', 'NC', 1680, 4.1, 95.5, 2.6, 4.0, 125000, 85, 'up'),
    ('market-raleigh', 'Raleigh', 'raleigh', 'NC', 1720, 4.3, 96.0, 2.8, 4.2, 89000, 86, 'up'),
    ('market-tucson', 'Tucson', 'tucson', 'AZ', 1280, 3.2, 94.8, 1.5, 2.5, 58000, 76, 'up')
ON CONFLICT (id) DO NOTHING;

-- Seed Submarkets
INSERT INTO submarkets (id, market_id, name, median_rent, occupancy, inventory, trend) VALUES
    ('sub-austin-domain', 'market-austin', 'Domain', 2150, 96.2, 4200, 'up'),
    ('sub-austin-downtown', 'market-austin', 'Downtown', 2450, 94.8, 3800, 'up'),
    ('sub-austin-east', 'market-austin', 'East Austin', 1780, 95.4, 5200, 'up'),
    ('sub-austin-round-rock', 'market-austin', 'Round Rock', 1650, 96.8, 8400, 'up'),
    ('sub-austin-cedar-park', 'market-austin', 'Cedar Park', 1720, 97.1, 6100, 'stable'),
    ('sub-phoenix-scottsdale', 'market-phoenix', 'Scottsdale', 2100, 95.5, 12000, 'up'),
    ('sub-phoenix-tempe', 'market-phoenix', 'Tempe', 1750, 96.2, 15000, 'up'),
    ('sub-phoenix-chandler', 'market-phoenix', 'Chandler', 1680, 95.8, 11000, 'stable'),
    ('sub-orlando-downtown', 'market-orlando', 'Downtown', 2200, 94.5, 8500, 'up'),
    ('sub-orlando-lake-nona', 'market-orlando', 'Lake Nona', 1950, 97.2, 4200, 'up')
ON CONFLICT (id) DO NOTHING;

-- Seed Properties
INSERT INTO properties (id, user_id, name, address, units, scores, total_score, grade, year1_coc, projected_irr, rent_growth_cagr, dscr, submarket_score, document_type) VALUES
    ('prop-austin-tech-towers', 'test-user-1', 'Austin Tech Towers', '123 Tech Blvd, Austin, TX 78701', 342, '[9, 8, 9, 9, 7, 10, 8, 9, 8, 8]', 93, 'A+', '8.2', '18.5', '4.2', '1.35', 9, 'om'),
    ('prop-phoenix-garden', 'test-user-1', 'Phoenix Garden Apartments', '456 Desert Rd, Phoenix, AZ 85001', 218, '[8, 7, 8, 8, 7, 8, 8, 8, 7, 8]', 87, 'A', '7.8', '16.2', '3.8', '1.28', 8, 'om'),
    ('prop-orlando-lakeside', 'test-user-1', 'Orlando Lakeside Villas', '789 Lake View Dr, Orlando, FL 32801', 156, '[8, 8, 7, 8, 8, 7, 8, 9, 8, 7]', 82, 'A-', '7.2', '15.8', '5.1', '1.22', 8, 'om'),
    ('prop-nashville-heights', 'test-user-1', 'Nashville Heights', '321 Music Row, Nashville, TN 37201', 284, '[8, 8, 8, 9, 8, 9, 8, 8, 8, 8]', 89, 'A', '7.9', '17.1', '4.5', '1.31', 8, 'manual'),
    ('prop-denver-mountain-view', 'test-user-1', 'Denver Mountain View', '555 Peak Ct, Denver, CO 80202', 198, '[7, 7, 7, 8, 8, 8, 8, 8, 7, 7]', 78, 'B+', '6.5', '14.2', '2.8', '1.18', 7, 'om'),
    ('prop-dallas-skyline', 'test-user-1', 'Dallas Skyline Plaza', '777 Commerce St, Dallas, TX 75201', 412, '[7, 7, 8, 8, 7, 10, 7, 8, 7, 7]', 81, 'A-', '7.1', '15.5', '3.2', '1.25', 8, 'om'),
    ('prop-tampa-bay', 'test-user-1', 'Tampa Bay Residences', '888 Bayshore Blvd, Tampa, FL 33606', 245, '[8, 8, 7, 8, 9, 8, 7, 9, 8, 8]', 84, 'A-', '7.4', '16.0', '4.8', '1.24', 9, 'rent_roll'),
    ('prop-atlanta-midtown', 'test-user-1', 'Atlanta Midtown Lofts', '999 Peachtree St, Atlanta, GA 30309', 178, '[7, 7, 7, 7, 8, 7, 8, 8, 7, 7]', 75, 'B+', '6.2', '13.8', '3.5', '1.15', 7, 'om')
ON CONFLICT (id) DO NOTHING;

-- Seed Deals
INSERT INTO deals (id, property_id, user_id, stage, asking_price, price_per_unit, cap_rate, notes, days_in_stage) VALUES
    ('deal-1', 'prop-austin-tech-towers', 'test-user-1', 'underwriting', 48500000, 141812, 5.8, 'Strong value-add opportunity. Need to verify renovation budget.', 4),
    ('deal-2', 'prop-phoenix-garden', 'test-user-1', 'loi', 32000000, 146789, 6.2, 'LOI submitted at $31M. Waiting for seller response.', 8),
    ('deal-3', 'prop-orlando-lakeside', 'test-user-1', 'analyzing', 22500000, 144231, 5.5, 'Running initial market comps and rent analysis.', 5),
    ('deal-4', 'prop-nashville-heights', 'test-user-1', 'due_diligence', 41000000, 144366, 6.0, 'In DD phase. Inspections scheduled for next week.', 14),
    ('deal-5', 'prop-denver-mountain-view', 'test-user-1', 'sourced', 35000000, 176768, 5.2, 'New listing. Need to schedule tour.', 1)
ON CONFLICT (id) DO NOTHING;

-- Seed Saved Searches
INSERT INTO saved_searches (id, user_id, name, query, filters, alerts_enabled, alert_frequency, match_count, new_matches) VALUES
    ('search-1', 'test-user-1', 'Austin Value-Add 200+ Units', '200+ unit value-add deals in Austin with 6%+ cap rate', '{"market": "austin", "minUnits": 200, "minCapRate": 6, "propertyType": "value-add"}', true, 'daily', 23, 3),
    ('search-2', 'test-user-1', 'Sunbelt A-Class 150+ Units', 'Class A properties 150+ units in sunbelt markets', '{"propertyClass": "A", "minUnits": 150, "markets": ["austin", "phoenix", "orlando", "tampa"]}', true, 'weekly', 45, 7),
    ('search-3', 'test-user-1', 'High Yield Phoenix', 'Phoenix properties with 7%+ cap rate', '{"market": "phoenix", "minCapRate": 7}', false, 'daily', 12, 0)
ON CONFLICT (id) DO NOTHING;

-- Seed Watchlist
INSERT INTO watchlist (id, user_id, property_id, price_alerts, status_alerts, notes, initial_price, current_price, price_change) VALUES
    ('watch-1', 'test-user-1', 'prop-dallas-skyline', true, true, 'Watching for price reduction', 58000000, 55000000, -5.2),
    ('watch-2', 'test-user-1', 'prop-tampa-bay', true, true, 'Strong submarket, waiting for better timing', 36500000, 36500000, 0),
    ('watch-3', 'test-user-1', 'prop-atlanta-midtown', false, true, 'Monitoring for market conditions', 28000000, 27500000, -1.8)
ON CONFLICT (id) DO NOTHING;

-- Seed Teams
INSERT INTO teams (id, name, owner_id, max_members) VALUES
    ('team-alpha', 'Alpha Acquisitions', 'test-user-1', 10)
ON CONFLICT (id) DO NOTHING;

-- Seed Team Members
INSERT INTO team_members (id, team_id, user_id, role, display_name, deals_analyzed, investments_sourced) VALUES
    ('member-1', 'team-alpha', 'test-user-1', 'owner', 'Arnold Alagar', 45, 12),
    ('member-2', 'team-alpha', 'user-sarah-chen', 'admin', 'Sarah Chen', 67, 18),
    ('member-3', 'team-alpha', 'user-mike-johnson', 'member', 'Mike Johnson', 34, 8),
    ('member-4', 'team-alpha', 'user-emily-davis', 'member', 'Emily Davis', 28, 5)
ON CONFLICT (id) DO NOTHING;

-- Seed Team Activities
INSERT INTO team_activities (id, team_id, user_id, activity_type, entity_type, entity_id, description) VALUES
    ('activity-1', 'team-alpha', 'user-sarah-chen', 'deal_added', 'deal', 'deal-1', 'Added Austin Tech Towers to pipeline'),
    ('activity-2', 'team-alpha', 'test-user-1', 'stage_change', 'deal', 'deal-2', 'Moved Phoenix Garden to LOI stage'),
    ('activity-3', 'team-alpha', 'user-mike-johnson', 'comment', 'deal', 'deal-4', 'Added inspection notes for Nashville Heights'),
    ('activity-4', 'team-alpha', 'user-emily-davis', 'deal_updated', 'deal', 'deal-3', 'Updated financial projections for Orlando Lakeside')
ON CONFLICT (id) DO NOTHING;

-- Seed Archived Deals
INSERT INTO archived_deals (id, property_id, user_id, reason, notes, asking_price, score, grade) VALUES
    ('archived-1', 'prop-atlanta-midtown', 'test-user-1', 'pricing', 'Seller not willing to negotiate below $30M', 32000000, 75, 'B+')
ON CONFLICT (id) DO NOTHING;

-- Seed Syndications
INSERT INTO syndications (id, property_id, creator_user_id, hedera_token_id, token_name, token_symbol, total_tokens, decimals, total_raise_usd, min_investment_usd, max_investment_usd, status, amount_raised_usd, investor_count, regulation_type, accredited_only, explorer_url) VALUES
    ('synd-1', 'prop-austin-tech-towers', 'test-user-1', '0.0.123456', 'Austin Tech Towers LP', 'ATT', 10000000, 6, 15000000, 50000, 1000000, 'active', 8500000, 42, 'reg_d', true, 'https://hashscan.io/mainnet/token/0.0.123456'),
    ('synd-2', 'prop-nashville-heights', 'test-user-1', '0.0.234567', 'Nashville Heights Fund', 'NHF', 8000000, 6, 12000000, 25000, NULL, 'draft', 0, 0, 'reg_d', true, NULL)
ON CONFLICT (id) DO NOTHING;

-- Seed Investments
INSERT INTO investments (id, syndication_id, user_id, amount_usd, token_amount, ownership_percentage, investor_hedera_account, status, payment_method, accreditation_verified, kyc_completed) VALUES
    ('invest-1', 'synd-1', 'user-sarah-chen', 100000, 66667, 0.667, '0.0.789012', 'completed', 'wire', true, true),
    ('invest-2', 'synd-1', 'user-david-kim', 250000, 166667, 1.667, '0.0.890123', 'completed', 'crypto', true, true)
ON CONFLICT (id) DO NOTHING;
