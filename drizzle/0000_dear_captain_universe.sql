CREATE SCHEMA "guild_schema";
--> statement-breakpoint
CREATE SCHEMA "member_schema";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "guild_schema"."guilds" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" text NOT NULL,
	"name" text NOT NULL,
	"total_members" integer DEFAULT 0,
	"level" integer DEFAULT 1,
	"motto" text DEFAULT '',
	"icon" text DEFAULT '',
	CONSTRAINT "guilds_guild_id_unique" UNIQUE("guild_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "guild_schema"."guild_to_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" text NOT NULL,
	"member_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "member_schema"."members" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text DEFAULT '',
	"username" text NOT NULL,
	"level" integer DEFAULT 1,
	"about" text DEFAULT '',
	"icon" text DEFAULT '',
	"guild_id" text,
	CONSTRAINT "members_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "guild_schema"."guild_to_members" ADD CONSTRAINT "guild_to_members_guild_id_guilds_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "guild_schema"."guilds"("guild_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "guild_schema"."guild_to_members" ADD CONSTRAINT "guild_to_members_member_id_members_user_id_fk" FOREIGN KEY ("member_id") REFERENCES "member_schema"."members"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "member_schema"."members" ADD CONSTRAINT "members_guild_id_guilds_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "guild_schema"."guilds"("guild_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
