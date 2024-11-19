CREATE TYPE "public"."request_status" AS ENUM('pending', 'finished');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('lost', 'found');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"foundItemId" uuid NOT NULL,
	"filename" varchar NOT NULL,
	"fileKey" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar NOT NULL,
	"locationDescription" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" "status" DEFAULT 'lost' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lost_item_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" varchar NOT NULL,
	"name" varchar NOT NULL,
	"lostLocationDescription" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"cpf" varchar NOT NULL,
	"requestStatus" "request_status" DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item_images" ADD CONSTRAINT "item_images_foundItemId_items_id_fk" FOREIGN KEY ("foundItemId") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
