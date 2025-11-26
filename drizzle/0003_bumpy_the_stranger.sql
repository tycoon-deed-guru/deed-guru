CREATE TABLE "alpha_whitelist" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"invited_by" text,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "alpha_whitelist_email_unique" UNIQUE("email")
);
