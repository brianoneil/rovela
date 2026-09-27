CREATE TABLE `people` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`context` text,
	`photo_ref` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `places` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`altitude` real,
	`accuracy` real,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `timeline_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`trip_id` text NOT NULL,
	`timestamp` integer NOT NULL,
	`duration_ms` integer,
	`type` text NOT NULL,
	`source` text NOT NULL,
	`lat` real,
	`lng` real,
	`altitude` real,
	`accuracy` real,
	`payload` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `timeline_entries_trip_time_idx` ON `timeline_entries` (`trip_id`,`timestamp`);--> statement-breakpoint
CREATE INDEX `timeline_entries_trip_type_idx` ON `timeline_entries` (`trip_id`,`type`);--> statement-breakpoint
CREATE TABLE `timeline_entry_people` (
	`entry_id` text NOT NULL,
	`person_id` text NOT NULL,
	PRIMARY KEY(`entry_id`, `person_id`),
	FOREIGN KEY (`entry_id`) REFERENCES `timeline_entries`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`person_id`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `timeline_entry_places` (
	`entry_id` text NOT NULL,
	`place_id` text NOT NULL,
	PRIMARY KEY(`entry_id`, `place_id`),
	FOREIGN KEY (`entry_id`) REFERENCES `timeline_entries`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`place_id`) REFERENCES `places`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `trips` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`start_at` integer NOT NULL,
	`end_at` integer,
	`home_geofence` text,
	`destinations` text NOT NULL,
	`cover_image_ref` text,
	`tags` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
