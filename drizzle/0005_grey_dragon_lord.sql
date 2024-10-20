CREATE TABLE IF NOT EXISTS "member_schema"."children" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"username" text NOT NULL,
	"level" integer DEFAULT 1,
	"about" text DEFAULT ''
);
--> statement-breakpoint
ALTER TABLE "member_schema"."members" ADD COLUMN "relationship_status" text DEFAULT 'single';--> statement-breakpoint
ALTER TABLE "member_schema"."members" ADD COLUMN "partner_id" text;--> statement-breakpoint
ALTER TABLE "member_schema"."members" ADD COLUMN "children" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "member_schema"."members" ADD COLUMN "job" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "member_schema"."members" ADD COLUMN "salary" integer DEFAULT 0;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "member_schema"."members" ADD CONSTRAINT "members_partner_id_members_user_id_fk" FOREIGN KEY ("partner_id") REFERENCES "member_schema"."members"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
