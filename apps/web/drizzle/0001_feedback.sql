CREATE TABLE "feedback" (
	"id" text PRIMARY KEY NOT NULL,
	"rating" integer NOT NULL,
	"message" text,
	"email" text,
	"user_id" text,
	"anon_id" text,
	"context" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "feedback_created_idx" ON "feedback" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "feedback_anon_idx" ON "feedback" USING btree ("anon_id","created_at");