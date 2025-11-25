-- deed.guru Petal Chart Scoring Migration
-- Adds 8-petal scoring system columns to properties table

-- Add petal scoring columns
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS petal_scores JSONB,
ADD COLUMN IF NOT EXISTS bloom_score INTEGER,
ADD COLUMN IF NOT EXISTS bloom_status TEXT,
ADD COLUMN IF NOT EXISTS petal_confidence REAL DEFAULT 0.85,
ADD COLUMN IF NOT EXISTS petal_completeness REAL DEFAULT 0.8;

-- Create index for bloom score queries
CREATE INDEX IF NOT EXISTS idx_properties_bloom_score ON properties(bloom_score);
CREATE INDEX IF NOT EXISTS idx_properties_bloom_status ON properties(bloom_status);

-- Function to convert 10-axis scores to 8-petal scores
CREATE OR REPLACE FUNCTION convert_to_petal_scores(axis_scores JSONB)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    scores_array REAL[];
    cashflow_score REAL;
    appreciation_score REAL;
    financing_score REAL;
    location_score REAL;
    condition_score REAL;
    tenancy_score REAL;
    liquidity_score REAL;
    compliance_score REAL;
BEGIN
    -- Extract scores from JSONB array to REAL array
    SELECT ARRAY(SELECT (jsonb_array_elements_text(axis_scores))::REAL)
    INTO scores_array;

    -- Mapping:
    -- 0: Market -> location
    -- 1: Rent Growth -> appreciation
    -- 2: CoC -> cashflow
    -- 3: IRR -> cashflow
    -- 4: Value-Add -> condition
    -- 5: Scale -> tenancy
    -- 6: DSCR -> financing
    -- 7: Submarket -> location
    -- 8: Exit Cap -> appreciation
    -- 9: Resilience -> compliance

    -- Calculate petal scores (convert 0-10 to 0-8 scale)
    cashflow_score := ROUND(((COALESCE(scores_array[3], 0) + COALESCE(scores_array[4], 0)) / 2 / 10 * 8)::numeric, 1);
    appreciation_score := ROUND(((COALESCE(scores_array[2], 0) + COALESCE(scores_array[9], 0)) / 2 / 10 * 8)::numeric, 1);
    financing_score := ROUND((COALESCE(scores_array[7], 0) / 10 * 8)::numeric, 1);
    location_score := ROUND(((COALESCE(scores_array[1], 0) + COALESCE(scores_array[8], 0)) / 2 / 10 * 8)::numeric, 1);
    condition_score := ROUND((COALESCE(scores_array[5], 0) / 10 * 8)::numeric, 1);
    tenancy_score := ROUND((COALESCE(scores_array[6], 0) / 10 * 8)::numeric, 1);
    liquidity_score := 5.0; -- Default mid-score (not in original 10-axis)
    compliance_score := ROUND((COALESCE(scores_array[10], 0) / 10 * 8)::numeric, 1);

    -- Build result JSONB
    result := jsonb_build_object(
        'cashflow', cashflow_score,
        'appreciation', appreciation_score,
        'financing', financing_score,
        'location', location_score,
        'condition', condition_score,
        'tenancy', tenancy_score,
        'liquidity', liquidity_score,
        'compliance', compliance_score
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate bloom score from petal scores
CREATE OR REPLACE FUNCTION calculate_bloom_score(petal_scores JSONB)
RETURNS INTEGER AS $$
BEGIN
    RETURN ROUND((
        COALESCE((petal_scores->>'cashflow')::REAL, 0) +
        COALESCE((petal_scores->>'appreciation')::REAL, 0) +
        COALESCE((petal_scores->>'financing')::REAL, 0) +
        COALESCE((petal_scores->>'location')::REAL, 0) +
        COALESCE((petal_scores->>'condition')::REAL, 0) +
        COALESCE((petal_scores->>'tenancy')::REAL, 0) +
        COALESCE((petal_scores->>'liquidity')::REAL, 0) +
        COALESCE((petal_scores->>'compliance')::REAL, 0)
    )::numeric);
END;
$$ LANGUAGE plpgsql;

-- Function to get bloom status from bloom score
CREATE OR REPLACE FUNCTION get_bloom_status(bloom_score INTEGER)
RETURNS TEXT AS $$
BEGIN
    IF bloom_score >= 64 THEN
        RETURN 'fully-bloomed';
    ELSIF bloom_score >= 60 THEN
        RETURN 'near-bloom';
    ELSIF bloom_score >= 50 THEN
        RETURN 'blooming';
    ELSIF bloom_score >= 40 THEN
        RETURN 'late-bloom';
    ELSE
        RETURN 'budding';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Convert existing properties to petal scoring
UPDATE properties
SET
    petal_scores = convert_to_petal_scores(scores),
    bloom_score = calculate_bloom_score(convert_to_petal_scores(scores)),
    bloom_status = get_bloom_status(calculate_bloom_score(convert_to_petal_scores(scores)))
WHERE petal_scores IS NULL AND scores IS NOT NULL;

-- Update seed data with petal scores
UPDATE properties SET
    petal_scores = '{"cashflow": 7.2, "appreciation": 6.8, "financing": 6.4, "location": 7.2, "condition": 5.6, "tenancy": 6.4, "liquidity": 5.5, "compliance": 6.4}'::jsonb,
    bloom_score = 51,
    bloom_status = 'blooming'
WHERE id = 'prop-austin-tech-towers';

UPDATE properties SET
    petal_scores = '{"cashflow": 6.0, "appreciation": 5.6, "financing": 5.6, "location": 5.6, "condition": 4.8, "tenancy": 5.6, "liquidity": 5.0, "compliance": 5.6}'::jsonb,
    bloom_score = 44,
    bloom_status = 'late-bloom'
WHERE id = 'prop-phoenix-garden';

UPDATE properties SET
    petal_scores = '{"cashflow": 6.0, "appreciation": 6.0, "financing": 6.4, "location": 6.0, "condition": 5.6, "tenancy": 6.4, "liquidity": 5.5, "compliance": 5.6}'::jsonb,
    bloom_score = 48,
    bloom_status = 'blooming'
WHERE id = 'prop-orlando-lakeside';

UPDATE properties SET
    petal_scores = '{"cashflow": 6.8, "appreciation": 6.8, "financing": 6.4, "location": 6.8, "condition": 5.6, "tenancy": 6.4, "liquidity": 5.5, "compliance": 6.4}'::jsonb,
    bloom_score = 51,
    bloom_status = 'blooming'
WHERE id = 'prop-nashville-heights';

UPDATE properties SET
    petal_scores = '{"cashflow": 5.2, "appreciation": 5.2, "financing": 5.6, "location": 5.6, "condition": 5.6, "tenancy": 6.4, "liquidity": 5.0, "compliance": 5.6}'::jsonb,
    bloom_score = 44,
    bloom_status = 'late-bloom'
WHERE id = 'prop-denver-mountain-view';

UPDATE properties SET
    petal_scores = '{"cashflow": 6.0, "appreciation": 5.2, "financing": 5.6, "location": 6.0, "condition": 5.6, "tenancy": 5.6, "liquidity": 5.0, "compliance": 5.6}'::jsonb,
    bloom_score = 45,
    bloom_status = 'late-bloom'
WHERE id = 'prop-dallas-skyline';

UPDATE properties SET
    petal_scores = '{"cashflow": 6.0, "appreciation": 6.0, "financing": 7.2, "location": 6.4, "condition": 5.6, "tenancy": 5.6, "liquidity": 5.5, "compliance": 6.4}'::jsonb,
    bloom_score = 49,
    bloom_status = 'blooming'
WHERE id = 'prop-tampa-bay';

UPDATE properties SET
    petal_scores = '{"cashflow": 5.2, "appreciation": 5.2, "financing": 5.6, "location": 5.6, "condition": 5.6, "tenancy": 6.4, "liquidity": 5.0, "compliance": 5.6}'::jsonb,
    bloom_score = 44,
    bloom_status = 'late-bloom'
WHERE id = 'prop-atlanta-midtown';

-- Add comment explaining the petal system
COMMENT ON COLUMN properties.petal_scores IS 'JSON object with 8 petal categories (0-8 scale each): cashflow, appreciation, financing, location, condition, tenancy, liquidity, compliance';
COMMENT ON COLUMN properties.bloom_score IS 'Sum of all 8 petal scores (0-64 scale)';
COMMENT ON COLUMN properties.bloom_status IS 'Bloom status: fully-bloomed (64), near-bloom (60-63), blooming (50-59), late-bloom (40-49), budding (0-39)';
