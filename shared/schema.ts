import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  varchar,
  real,
  json,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("agent"), // agent, admin, auditor, bank
  username: varchar("username").unique(),
  phoneNumber: varchar("phone_number"),
  address: varchar("address"),
  district: varchar("district"),
  state: varchar("state"),
  status: varchar("status").default("active"),
  lastLogin: timestamp("last_login"),
  deviceId: varchar("device_id"),
  lastIp: varchar("last_ip"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  agentProfiles: many(agentProfiles),
  audits: many(audits),
  transactions: many(transactions),
  checkIns: many(checkIns),
  locationLogs: many(locationLogs),
  auditorAssignments: many(auditorAssignments),
  notifications: many(notifications),
}));

// Agent Profiles table
export const agentProfiles = pgTable("agent_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  cspId: varchar("csp_id").unique().notNull(),
  aadhaarNumber: varchar("aadhaar_number").unique(),
  panNumber: varchar("pan_number").unique(),
  bankAccount: varchar("bank_account"),
  ifscCode: varchar("ifsc_code"),
  fraudScore: integer("fraud_score").default(0),
  riskLevel: varchar("risk_level").default("low"), // low, medium, high
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const agentProfilesRelations = relations(agentProfiles, ({ one }) => ({
  user: one(users, {
    fields: [agentProfiles.userId],
    references: [users.id],
  }),
}));

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  agentId: varchar("agent_id").notNull().references(() => users.id),
  transactionType: varchar("transaction_type").notNull(), // withdrawal, deposit, remittance, etc.
  amount: real("amount").notNull(),
  customerName: varchar("customer_name").notNull(),
  customerAadhaar: varchar("customer_aadhaar"),
  accountNumber: varchar("account_number"),
  status: varchar("status").notNull().default("completed"), // completed, pending, failed
  latitude: real("latitude"),
  longitude: real("longitude"),
  deviceId: varchar("device_id"),
  ipAddress: varchar("ip_address"),
  fraudFlags: json("fraud_flags"),
  transactionDate: timestamp("transaction_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  agent: one(users, {
    fields: [transactions.agentId],
    references: [users.id],
  }),
}));

// Check-ins table
export const checkIns = pgTable("check_ins", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  selfieUrl: varchar("selfie_url"),
  videoUrl: varchar("video_url"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  address: varchar("address"),
  deviceId: varchar("device_id"),
  ipAddress: varchar("ip_address"),
  matchScore: integer("match_score"),
  status: varchar("status").default("verified"), // verified, failed, pending
  checkInDate: timestamp("check_in_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const checkInsRelations = relations(checkIns, ({ one }) => ({
  user: one(users, {
    fields: [checkIns.userId],
    references: [users.id],
  }),
}));

// Location Logs table
export const locationLogs = pgTable("location_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  address: varchar("address"),
  deviceId: varchar("device_id"),
  activity: varchar("activity"), // login, transaction, check-in, etc.
  logDate: timestamp("log_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const locationLogsRelations = relations(locationLogs, ({ one }) => ({
  user: one(users, {
    fields: [locationLogs.userId],
    references: [users.id],
  }),
}));

// Audits table
export const audits = pgTable("audits", {
  id: serial("id").primaryKey(),
  auditedUserId: varchar("audited_user_id").notNull().references(() => users.id),
  auditorId: varchar("auditor_id").notNull().references(() => users.id),
  status: varchar("status").notNull().default("pending"), // pending, completed, failed
  findings: text("findings"),
  evidenceUrls: jsonb("evidence_urls"), // Array of photo/video URLs
  latitude: real("latitude"),
  longitude: real("longitude"),
  deviceId: varchar("device_id"),
  ipAddress: varchar("ip_address"),
  priority: varchar("priority").default("normal"), // low, normal, high, critical
  hash: varchar("hash"), // For tamper-proofing
  auditDate: timestamp("audit_date"),
  dueDate: timestamp("due_date"),
  completedDate: timestamp("completed_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const auditsRelations = relations(audits, ({ one }) => ({
  auditedUser: one(users, {
    fields: [audits.auditedUserId],
    references: [users.id],
  }),
  auditor: one(users, {
    fields: [audits.auditorId],
    references: [users.id],
  }),
}));

// Auditor Assignments table
export const auditorAssignments = pgTable("auditor_assignments", {
  id: serial("id").primaryKey(),
  auditorId: varchar("auditor_id").notNull().references(() => users.id),
  agentId: varchar("agent_id").notNull().references(() => users.id),
  status: varchar("status").notNull().default("assigned"), // assigned, in-progress, completed
  priority: varchar("priority").default("normal"), // low, normal, high, critical
  reason: varchar("reason"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const auditorAssignmentsRelations = relations(auditorAssignments, ({ one }) => ({
  auditor: one(users, {
    fields: [auditorAssignments.auditorId],
    references: [users.id],
  }),
  agent: one(users, {
    fields: [auditorAssignments.agentId],
    references: [users.id],
  }),
}));

// Disputes table
export const disputes = pgTable("disputes", {
  id: serial("id").primaryKey(),
  raisedByUserId: varchar("raised_by_user_id").notNull().references(() => users.id),
  assignedToUserId: varchar("assigned_to_user_id").references(() => users.id),
  transactionId: integer("transaction_id").references(() => transactions.id),
  auditId: integer("audit_id").references(() => audits.id),
  status: varchar("status").notNull().default("open"), // open, in-progress, resolved, closed
  priority: varchar("priority").default("medium"), // low, medium, high
  description: text("description").notNull(),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const disputesRelations = relations(disputes, ({ one }) => ({
  raisedByUser: one(users, {
    fields: [disputes.raisedByUserId],
    references: [users.id],
  }),
  assignedToUser: one(users, {
    fields: [disputes.assignedToUserId],
    references: [users.id],
  }),
  transaction: one(transactions, {
    fields: [disputes.transactionId],
    references: [transactions.id],
  }),
  audit: one(audits, {
    fields: [disputes.auditId],
    references: [audits.id],
  }),
}));

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type").notNull(), // alert, warning, info, success
  read: boolean("read").default(false),
  actionUrl: varchar("action_url"),
  createdAt: timestamp("created_at").defaultNow(),
  readAt: timestamp("read_at"),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// Reports table
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // performance, fraud, transaction, audit
  generatedByUserId: varchar("generated_by_user_id").notNull().references(() => users.id),
  format: varchar("format").notNull(), // PDF, Excel, CSV
  fileUrl: varchar("file_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reportsRelations = relations(reports, ({ one }) => ({
  generatedByUser: one(users, {
    fields: [reports.generatedByUserId],
    references: [users.id],
  }),
}));

// Fraud Rules table
export const fraudRules = pgTable("fraud_rules", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull().unique(),
  description: text("description"),
  scoreImpact: integer("score_impact").notNull(),
  status: varchar("status").notNull().default("active"), // active, inactive
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact Submissions table
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  phoneNumber: varchar("phone_number"),
  subject: varchar("subject").notNull(),
  message: text("message").notNull(),
  status: varchar("status").default("new"), // new, reviewed, responded
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CSP Applications table
export const cspApplications = pgTable("csp_applications", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  phoneNumber: varchar("phone_number").notNull(),
  aadhaarNumber: varchar("aadhaar_number").notNull(),
  panNumber: varchar("pan_number").notNull(),
  address: text("address").notNull(),
  district: varchar("district").notNull(),
  state: varchar("state").notNull(),
  qualification: varchar("qualification"),
  experience: text("experience"),
  status: varchar("status").default("new"), // new, under-review, approved, rejected
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define Zod schemas for inserting data
export const upsertUserSchema = createInsertSchema(users);
export const insertAgentProfileSchema = createInsertSchema(agentProfiles);
export const insertTransactionSchema = createInsertSchema(transactions);
export const insertCheckInSchema = createInsertSchema(checkIns);
export const insertLocationLogSchema = createInsertSchema(locationLogs);
export const insertAuditSchema = createInsertSchema(audits);
export const insertAuditorAssignmentSchema = createInsertSchema(auditorAssignments);
export const insertDisputeSchema = createInsertSchema(disputes);
export const insertNotificationSchema = createInsertSchema(notifications);
export const insertReportSchema = createInsertSchema(reports);
export const insertFraudRuleSchema = createInsertSchema(fraudRules);
export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions);
export const insertCspApplicationSchema = createInsertSchema(cspApplications);

// Define types for all schemas
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type AgentProfile = typeof agentProfiles.$inferSelect;
export type InsertAgentProfile = z.infer<typeof insertAgentProfileSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type CheckIn = typeof checkIns.$inferSelect;
export type InsertCheckIn = z.infer<typeof insertCheckInSchema>;
export type LocationLog = typeof locationLogs.$inferSelect;
export type InsertLocationLog = z.infer<typeof insertLocationLogSchema>;
export type Audit = typeof audits.$inferSelect;
export type InsertAudit = z.infer<typeof insertAuditSchema>;
export type AuditorAssignment = typeof auditorAssignments.$inferSelect;
export type InsertAuditorAssignment = z.infer<typeof insertAuditorAssignmentSchema>;
export type Dispute = typeof disputes.$inferSelect;
export type InsertDispute = z.infer<typeof insertDisputeSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type FraudRule = typeof fraudRules.$inferSelect;
export type InsertFraudRule = z.infer<typeof insertFraudRuleSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type CspApplication = typeof cspApplications.$inferSelect;
export type InsertCspApplication = z.infer<typeof insertCspApplicationSchema>;
