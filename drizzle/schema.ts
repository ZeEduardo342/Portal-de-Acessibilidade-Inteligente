import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, boolean, decimal } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extended with department field for area assignment.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["colaborador", "gestor", "admin"]).default("colaborador").notNull(),
  department: varchar("department", { length: 100 }), // RH, Saúde, TI, Ergonomia, Facilities
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Demandas de acessibilidade - registro centralizado
 */
export const demands = mysqlTable("demands", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["física", "digital", "comunicação", "ergonomia", "outro"]).notNull(),
  category: mysqlEnum("category", ["arquitetônica", "tecnológica", "atitudinal", "comunicacional", "outro"]).notNull(),
  status: mysqlEnum("status", ["aberta", "triada", "encaminhada", "em_progresso", "resolvida", "fechada"]).default("aberta").notNull(),
  priority: mysqlEnum("priority", ["baixa", "média", "alta", "crítica"]).default("média").notNull(),
  assignedArea: varchar("assignedArea", { length: 100 }), // RH, Saúde, TI, Ergonomia, Facilities
  assignedTo: int("assignedTo"), // ID do gestor responsável
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
  notes: text("notes"),
});

export type Demand = typeof demands.$inferSelect;
export type InsertDemand = typeof demands.$inferInsert;

/**
 * Histórico de mudanças de status - auditoria e notificações
 */
export const demandHistory = mysqlTable("demand_history", {
  id: int("id").autoincrement().primaryKey(),
  demandId: int("demandId").notNull(),
  previousStatus: varchar("previousStatus", { length: 50 }),
  newStatus: varchar("newStatus", { length: 50 }).notNull(),
  changedBy: int("changedBy").notNull(),
  changedAt: timestamp("changedAt").defaultNow().notNull(),
  notes: text("notes"),
});

export type DemandHistory = typeof demandHistory.$inferSelect;
export type InsertDemandHistory = typeof demandHistory.$inferInsert;

/**
 * Documentos - laudos, relatórios, fotos
 */
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  demandId: int("demandId"),
  userId: int("userId").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 255 }).notNull(), // S3 key
  fileUrl: varchar("fileUrl", { length: 500 }).notNull(), // S3 URL
  documentType: mysqlEnum("documentType", ["laudo_médico", "relatório_ergonômico", "foto_posto", "outro"]).notNull(),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  accessibleTo: mysqlEnum("accessibleTo", ["colaborador", "gestor", "admin"]).default("gestor").notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

/**
 * Base de conhecimento - artigos, normas, boas práticas
 */
export const knowledgeBase = mysqlTable("knowledge_base", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: mysqlEnum("category", ["norma_abnt", "lei_brasileira_inclusao", "boa_prática", "guia"]).notNull(),
  tags: varchar("tags", { length: 500 }), // JSON string or comma-separated
  source: varchar("source", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type KnowledgeBase = typeof knowledgeBase.$inferSelect;
export type InsertKnowledgeBase = typeof knowledgeBase.$inferInsert;

/**
 * Avaliações ergonômicas estruturadas
 */
export const ergonomicAssessments = mysqlTable("ergonomic_assessments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  demandId: int("demandId"),
  responses: json("responses"), // JSON com respostas do formulário
  recommendations: json("recommendations"), // JSON com recomendações geradas por IA
  aiGeneratedAt: timestamp("aiGeneratedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ErgonomicAssessment = typeof ergonomicAssessments.$inferSelect;
export type InsertErgonomicAssessment = typeof ergonomicAssessments.$inferInsert;

/**
 * Notificações por mudança de status
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  demandId: int("demandId"),
  type: mysqlEnum("type", ["status_changed", "new_demand", "assigned", "comment", "system"]).notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;