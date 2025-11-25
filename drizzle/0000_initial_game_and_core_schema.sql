CREATE TABLE "archived_deals" (
	"id" text PRIMARY KEY NOT NULL,
	"property_id" text NOT NULL,
	"user_id" text NOT NULL,
	"reason" text,
	"notes" text,
	"asking_price" numeric(15, 2),
	"score" integer,
	"grade" text,
	"archived_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "badges" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"rarity" text NOT NULL,
	"requirement_type" text,
	"requirement_value" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "city_gateways" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"country" text NOT NULL,
	"region" text NOT NULL,
	"center_lng" real NOT NULL,
	"center_lat" real NOT NULL,
	"tier" text NOT NULL,
	"unlock_level" integer DEFAULT 1,
	"total_challenges" integer DEFAULT 10,
	"total_deed_reward" integer NOT NULL,
	"total_xp_reward" integer NOT NULL,
	"avg_price" text,
	"growth_rate" text,
	"property_count" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "crisis_scenarios" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"type" text NOT NULL,
	"severity" integer NOT NULL,
	"affected_markets" jsonb DEFAULT '[]'::jsonb,
	"affected_cities" jsonb DEFAULT '[]'::jsonb,
	"duration" integer NOT NULL,
	"objectives" jsonb NOT NULL,
	"deed_reward" integer NOT NULL,
	"xp_reward" integer NOT NULL,
	"status" text DEFAULT 'inactive',
	"start_at" timestamp,
	"end_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "deals" (
	"id" text PRIMARY KEY NOT NULL,
	"property_id" text NOT NULL,
	"user_id" text NOT NULL,
	"stage" text DEFAULT 'sourced',
	"asking_price" numeric(15, 2),
	"price_per_unit" numeric(12, 2),
	"cap_rate" real,
	"notes" text,
	"days_in_stage" integer DEFAULT 0,
	"added_at" timestamp DEFAULT now(),
	"stage_changed_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "game_challenges" (
	"id" text PRIMARY KEY NOT NULL,
	"city_id" text,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"difficulty" text NOT NULL,
	"property_id" text,
	"market_id" text,
	"min_level" integer DEFAULT 1,
	"time_limit" integer,
	"deed_reward" integer NOT NULL,
	"xp_reward" integer NOT NULL,
	"badge_id" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "game_notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"player_id" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"reference_type" text,
	"reference_id" text,
	"read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "game_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"player_id" text NOT NULL,
	"mode" text NOT NULL,
	"current_challenge_id" text,
	"score" integer DEFAULT 0,
	"streak" integer DEFAULT 0,
	"time_remaining" integer,
	"status" text DEFAULT 'active',
	"started_at" timestamp DEFAULT now(),
	"ended_at" timestamp,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "investments" (
	"id" text PRIMARY KEY NOT NULL,
	"syndication_id" text NOT NULL,
	"user_id" text NOT NULL,
	"amount_usd" numeric(15, 2) NOT NULL,
	"token_amount" integer NOT NULL,
	"ownership_percentage" numeric(5, 3),
	"hedera_transaction_id" text,
	"investor_hedera_account" text NOT NULL,
	"status" text DEFAULT 'pending',
	"payment_method" text,
	"accreditation_verified" boolean DEFAULT false,
	"kyc_completed" boolean DEFAULT false,
	"invested_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leaderboard_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"player_id" text NOT NULL,
	"period" text NOT NULL,
	"category" text NOT NULL,
	"rank" integer NOT NULL,
	"score" integer NOT NULL,
	"previous_rank" integer,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"calculated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "markets" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"state" text NOT NULL,
	"median_rent" integer,
	"rent_growth" real,
	"occupancy" real,
	"pop_growth" real,
	"job_growth" real,
	"total_inventory" integer,
	"market_score" integer,
	"trend" text,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "markets_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "player_badges" (
	"id" text PRIMARY KEY NOT NULL,
	"player_id" text NOT NULL,
	"badge_id" text NOT NULL,
	"earned_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "player_challenges" (
	"id" text PRIMARY KEY NOT NULL,
	"player_id" text NOT NULL,
	"challenge_id" text NOT NULL,
	"status" text DEFAULT 'not-started',
	"score" integer,
	"time_spent" integer,
	"attempts" integer DEFAULT 0,
	"started_at" timestamp,
	"completed_at" timestamp,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "player_city_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"player_id" text NOT NULL,
	"city_id" text NOT NULL,
	"completed_challenges" integer DEFAULT 0,
	"status" text DEFAULT 'locked',
	"unlocked_at" timestamp,
	"completed_at" timestamp,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "player_crisis_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"player_id" text NOT NULL,
	"crisis_id" text NOT NULL,
	"objectives_completed" jsonb DEFAULT '[]'::jsonb,
	"score" integer DEFAULT 0,
	"status" text DEFAULT 'in-progress',
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"username" text NOT NULL,
	"tier" text DEFAULT 'novice',
	"level" integer DEFAULT 1,
	"xp" integer DEFAULT 0,
	"xp_to_next_level" integer DEFAULT 1000,
	"deed_tokens" integer DEFAULT 0,
	"dguru_tokens" integer DEFAULT 0,
	"properties_analyzed" integer DEFAULT 0,
	"deals_completed" integer DEFAULT 0,
	"accuracy_score" integer DEFAULT 0,
	"streak" integer DEFAULT 0,
	"families_housed" integer DEFAULT 0,
	"affordable_units_created" integer DEFAULT 0,
	"community_score" integer DEFAULT 0,
	"current_title" text,
	"unlocked_titles" jsonb DEFAULT '[]'::jsonb,
	"joined_at" timestamp DEFAULT now(),
	"last_active_at" timestamp DEFAULT now(),
	CONSTRAINT "players_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "players_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"address" text,
	"units" integer,
	"raw_data" jsonb,
	"scores" jsonb NOT NULL,
	"total_score" integer NOT NULL,
	"grade" text NOT NULL,
	"petal_scores" jsonb,
	"bloom_score" integer,
	"bloom_status" text,
	"petal_confidence" real DEFAULT 0.85,
	"petal_completeness" real DEFAULT 0.8,
	"year1_coc" text,
	"projected_irr" text,
	"rent_growth_cagr" text,
	"pop_job_growth" text,
	"value_add_potential" text,
	"dscr" text,
	"submarket_score" integer,
	"exit_cap_compression_bps" integer,
	"economic_resilience" integer,
	"document_type" text,
	"archived" boolean DEFAULT false,
	"uploaded_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "saved_searches" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"query" text,
	"filters" jsonb,
	"alerts_enabled" boolean DEFAULT false,
	"alert_frequency" text DEFAULT 'daily',
	"last_alert_sent" timestamp,
	"match_count" integer DEFAULT 0,
	"new_matches" integer DEFAULT 0,
	"last_run" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "submarkets" (
	"id" text PRIMARY KEY NOT NULL,
	"market_id" text NOT NULL,
	"name" text NOT NULL,
	"median_rent" integer,
	"occupancy" real,
	"inventory" integer,
	"trend" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "syndications" (
	"id" text PRIMARY KEY NOT NULL,
	"property_id" text NOT NULL,
	"creator_user_id" text NOT NULL,
	"hedera_token_id" text NOT NULL,
	"token_name" text NOT NULL,
	"token_symbol" text NOT NULL,
	"total_tokens" integer NOT NULL,
	"decimals" integer DEFAULT 6,
	"total_raise_usd" numeric(15, 2) NOT NULL,
	"min_investment_usd" numeric(15, 2) NOT NULL,
	"max_investment_usd" numeric(15, 2),
	"target_close_date" timestamp,
	"status" text DEFAULT 'draft',
	"amount_raised_usd" numeric(15, 2) DEFAULT '0',
	"investor_count" integer DEFAULT 0,
	"regulation_type" text,
	"accredited_only" boolean DEFAULT true,
	"document_url" text,
	"explorer_url" text,
	"supply_key_encrypted" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "syndications_hedera_token_id_unique" UNIQUE("hedera_token_id")
);
--> statement-breakpoint
CREATE TABLE "team_activities" (
	"id" text PRIMARY KEY NOT NULL,
	"team_id" text NOT NULL,
	"user_id" text NOT NULL,
	"activity_type" text NOT NULL,
	"entity_type" text,
	"entity_id" text,
	"description" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" text PRIMARY KEY NOT NULL,
	"team_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'member',
	"display_name" text,
	"deals_analyzed" integer DEFAULT 0,
	"investments_sourced" integer DEFAULT 0,
	"joined_at" timestamp DEFAULT now(),
	"last_active_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"owner_id" text NOT NULL,
	"max_members" integer DEFAULT 5,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tournament_participants" (
	"id" text PRIMARY KEY NOT NULL,
	"tournament_id" text NOT NULL,
	"player_id" text NOT NULL,
	"score" integer DEFAULT 0,
	"rank" integer,
	"prizes_won" integer DEFAULT 0,
	"joined_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tournaments" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"mode" text NOT NULL,
	"start_at" timestamp NOT NULL,
	"end_at" timestamp NOT NULL,
	"entry_fee" integer DEFAULT 0,
	"prize_pool" integer NOT NULL,
	"max_participants" integer,
	"status" text DEFAULT 'upcoming',
	"participant_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"stripe_customer_id" text,
	"subscription_tier" text DEFAULT 'free',
	"subscription_status" text DEFAULT 'inactive',
	"hedera_account_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "watchlist" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"property_id" text NOT NULL,
	"price_alerts" boolean DEFAULT true,
	"status_alerts" boolean DEFAULT true,
	"notes" text,
	"initial_price" numeric(15, 2),
	"current_price" numeric(15, 2),
	"price_change" real,
	"added_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "archived_deals" ADD CONSTRAINT "archived_deals_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "archived_deals" ADD CONSTRAINT "archived_deals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deals" ADD CONSTRAINT "deals_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deals" ADD CONSTRAINT "deals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_challenges" ADD CONSTRAINT "game_challenges_city_id_city_gateways_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."city_gateways"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_challenges" ADD CONSTRAINT "game_challenges_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_challenges" ADD CONSTRAINT "game_challenges_market_id_markets_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."markets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_challenges" ADD CONSTRAINT "game_challenges_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_notifications" ADD CONSTRAINT "game_notifications_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_current_challenge_id_game_challenges_id_fk" FOREIGN KEY ("current_challenge_id") REFERENCES "public"."game_challenges"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investments" ADD CONSTRAINT "investments_syndication_id_syndications_id_fk" FOREIGN KEY ("syndication_id") REFERENCES "public"."syndications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investments" ADD CONSTRAINT "investments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_badges" ADD CONSTRAINT "player_badges_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_badges" ADD CONSTRAINT "player_badges_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_challenges" ADD CONSTRAINT "player_challenges_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_challenges" ADD CONSTRAINT "player_challenges_challenge_id_game_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."game_challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_city_progress" ADD CONSTRAINT "player_city_progress_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_city_progress" ADD CONSTRAINT "player_city_progress_city_id_city_gateways_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."city_gateways"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_crisis_progress" ADD CONSTRAINT "player_crisis_progress_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_crisis_progress" ADD CONSTRAINT "player_crisis_progress_crisis_id_crisis_scenarios_id_fk" FOREIGN KEY ("crisis_id") REFERENCES "public"."crisis_scenarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_searches" ADD CONSTRAINT "saved_searches_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submarkets" ADD CONSTRAINT "submarkets_market_id_markets_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."markets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "syndications" ADD CONSTRAINT "syndications_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "syndications" ADD CONSTRAINT "syndications_creator_user_id_users_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_activities" ADD CONSTRAINT "team_activities_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_activities" ADD CONSTRAINT "team_activities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_participants" ADD CONSTRAINT "tournament_participants_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_participants" ADD CONSTRAINT "tournament_participants_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;