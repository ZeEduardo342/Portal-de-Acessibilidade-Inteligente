CREATE TABLE `demand_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`demandId` int NOT NULL,
	`previousStatus` varchar(50),
	`newStatus` varchar(50) NOT NULL,
	`changedBy` int NOT NULL,
	`changedAt` timestamp NOT NULL DEFAULT (now()),
	`notes` text,
	CONSTRAINT `demand_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `demands` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`type` enum('física','digital','comunicação','ergonomia','outro') NOT NULL,
	`category` enum('arquitetônica','tecnológica','atitudinal','comunicacional','outro') NOT NULL,
	`status` enum('aberta','triada','encaminhada','em_progresso','resolvida','fechada') NOT NULL DEFAULT 'aberta',
	`priority` enum('baixa','média','alta','crítica') NOT NULL DEFAULT 'média',
	`assignedArea` varchar(100),
	`assignedTo` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`resolvedAt` timestamp,
	`notes` text,
	CONSTRAINT `demands_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`demandId` int,
	`userId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileKey` varchar(255) NOT NULL,
	`fileUrl` varchar(500) NOT NULL,
	`documentType` enum('laudo_médico','relatório_ergonômico','foto_posto','outro') NOT NULL,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	`accessibleTo` enum('colaborador','gestor','admin') NOT NULL DEFAULT 'gestor',
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ergonomic_assessments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`demandId` int,
	`responses` json,
	`recommendations` json,
	`aiGeneratedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ergonomic_assessments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `knowledge_base` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`category` enum('norma_abnt','lei_brasileira_inclusao','boa_prática','guia') NOT NULL,
	`tags` varchar(500),
	`source` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `knowledge_base_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`demandId` int,
	`type` enum('status_changed','new_demand','assigned','comment','system') NOT NULL,
	`message` text NOT NULL,
	`read` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('colaborador','gestor','admin') NOT NULL DEFAULT 'colaborador';--> statement-breakpoint
ALTER TABLE `users` ADD `department` varchar(100);