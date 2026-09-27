CREATE TABLE `daily_activity` (
	`trip_id` text NOT NULL,
	`date` text NOT NULL,
	`steps` integer NOT NULL,
	`source` text NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`trip_id`, `date`),
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `timeline_entries` ADD `external_id` text;--> statement-breakpoint
CREATE UNIQUE INDEX `timeline_entries_trip_external_idx` ON `timeline_entries` (`trip_id`,`external_id`);