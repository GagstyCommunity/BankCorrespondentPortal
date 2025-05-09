import { 
  users, 
  agentProfiles, 
  transactions, 
  checkIns, 
  locationLogs, 
  audits, 
  auditorAssignments, 
  disputes, 
  notifications, 
  reports, 
  fraudRules, 
  contactSubmissions, 
  cspApplications,
  type User,
  type UpsertUser,
  type AgentProfile,
  type InsertAgentProfile,
  type Transaction,
  type InsertTransaction,
  type CheckIn,
  type InsertCheckIn,
  type LocationLog,
  type InsertLocationLog,
  type Audit,
  type InsertAudit,
  type AuditorAssignment,
  type InsertAuditorAssignment,
  type Dispute,
  type InsertDispute,
  type Notification,
  type InsertNotification,
  type Report,
  type InsertReport,
  type FraudRule,
  type InsertFraudRule,
  type ContactSubmission,
  type InsertContactSubmission,
  type CspApplication,
  type InsertCspApplication,
} from "@shared/schema";
import { db, calculateFraudScore } from "./db";
import { eq, and, like, desc, asc, isNull, or, sql } from "drizzle-orm";
import crypto from "crypto";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  upsertUser(userData: UpsertUser): Promise<User>;
  getUsers(role?: string): Promise<User[]>;
  updateUser(id: string, userData: Partial<User>): Promise<User>;
  
  // Agent Profile operations
  getAgentProfile(userId: string): Promise<AgentProfile | undefined>;
  createAgentProfile(profileData: InsertAgentProfile): Promise<AgentProfile>;
  updateAgentProfile(id: number, profileData: Partial<AgentProfile>): Promise<AgentProfile>;
  getAgentProfiles(riskLevel?: string): Promise<(AgentProfile & { user: User })[]>;
  getAgentProfileByCspId(cspId: string): Promise<(AgentProfile & { user: User }) | undefined>;
  
  // Transaction operations
  getTransactions(agentId?: string): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(txData: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: string, limit?: number): Promise<Transaction[]>;
  
  // Check-in operations
  getCheckIns(userId?: string): Promise<CheckIn[]>;
  getCheckIn(id: number): Promise<CheckIn | undefined>;
  createCheckIn(checkInData: InsertCheckIn): Promise<CheckIn>;
  getUserLatestCheckIn(userId: string): Promise<CheckIn | undefined>;
  
  // Location Log operations
  getLocationLogs(userId?: string): Promise<LocationLog[]>;
  createLocationLog(logData: InsertLocationLog): Promise<LocationLog>;
  getUserLocationLogs(userId: string, limit?: number): Promise<LocationLog[]>;
  
  // Audit operations
  getAudits(auditorId?: string, status?: string): Promise<Audit[]>;
  getAudit(id: number): Promise<Audit | undefined>;
  createAudit(auditData: InsertAudit): Promise<Audit>;
  updateAudit(id: number, auditData: Partial<Audit>): Promise<Audit>;
  getUserAudits(userId: string): Promise<Audit[]>;
  
  // Auditor Assignment operations
  getAuditorAssignments(auditorId?: string, status?: string): Promise<AuditorAssignment[]>;
  createAuditorAssignment(assignmentData: InsertAuditorAssignment): Promise<AuditorAssignment>;
  updateAuditorAssignment(id: number, assignmentData: Partial<AuditorAssignment>): Promise<AuditorAssignment>;
  getAuditorAssignmentsWithDetails(auditorId: string): Promise<any[]>;
  
  // Dispute operations
  getDisputes(status?: string): Promise<Dispute[]>;
  getDispute(id: number): Promise<Dispute | undefined>;
  createDispute(disputeData: InsertDispute): Promise<Dispute>;
  updateDispute(id: number, disputeData: Partial<Dispute>): Promise<Dispute>;
  getUserDisputes(userId: string): Promise<Dispute[]>;
  
  // Notification operations
  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(notificationData: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification>;
  getUnreadNotificationCount(userId: string): Promise<number>;
  
  // Report operations
  getReports(): Promise<Report[]>;
  createReport(reportData: InsertReport): Promise<Report>;
  
  // Fraud Rule operations
  getFraudRules(): Promise<FraudRule[]>;
  updateFraudRule(id: number, ruleData: Partial<FraudRule>): Promise<FraudRule>;
  
  // Contact Submission operations
  getContactSubmissions(): Promise<ContactSubmission[]>;
  createContactSubmission(submissionData: InsertContactSubmission): Promise<ContactSubmission>;
  
  // CSP Application operations
  getCSPApplications(status?: string): Promise<CspApplication[]>;
  createCSPApplication(applicationData: InsertCspApplication): Promise<CspApplication>;
  updateCSPApplication(id: number, applicationData: Partial<CspApplication>): Promise<CspApplication>;
  
  // Fraud Score operations
  calculateUserFraudScore(userId: string): Promise<number>;
  getHighRiskCSPs(limit?: number): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUsers(role?: string): Promise<User[]> {
    if (role) {
      return await db.select().from(users).where(eq(users.role, role));
    }
    return await db.select().from(users);
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Agent Profile operations
  async getAgentProfile(userId: string): Promise<AgentProfile | undefined> {
    const [profile] = await db
      .select()
      .from(agentProfiles)
      .where(eq(agentProfiles.userId, userId));
    return profile;
  }

  async createAgentProfile(profileData: InsertAgentProfile): Promise<AgentProfile> {
    const [profile] = await db
      .insert(agentProfiles)
      .values(profileData)
      .returning();
    return profile;
  }

  async updateAgentProfile(id: number, profileData: Partial<AgentProfile>): Promise<AgentProfile> {
    const [profile] = await db
      .update(agentProfiles)
      .set({ ...profileData, updatedAt: new Date() })
      .where(eq(agentProfiles.id, id))
      .returning();
    return profile;
  }

  async getAgentProfiles(riskLevel?: string): Promise<(AgentProfile & { user: User })[]> {
    if (riskLevel) {
      return await db.query.agentProfiles.findMany({
        where: eq(agentProfiles.riskLevel, riskLevel),
        with: {
          user: true,
        },
      });
    }
    return await db.query.agentProfiles.findMany({
      with: {
        user: true,
      },
    });
  }

  async getAgentProfileByCspId(cspId: string): Promise<(AgentProfile & { user: User }) | undefined> {
    const result = await db.query.agentProfiles.findFirst({
      where: eq(agentProfiles.cspId, cspId),
      with: {
        user: true,
      },
    });
    return result;
  }

  // Transaction operations
  async getTransactions(agentId?: string): Promise<Transaction[]> {
    if (agentId) {
      return await db
        .select()
        .from(transactions)
        .where(eq(transactions.agentId, agentId))
        .orderBy(desc(transactions.transactionDate));
    }
    return await db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.transactionDate));
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));
    return transaction;
  }

  async createTransaction(txData: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(txData)
      .returning();
    
    // Calculate fraud score after transaction
    await calculateFraudScore(txData.agentId);
    
    return transaction;
  }

  async getUserTransactions(userId: string, limit: number = 10): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.agentId, userId))
      .orderBy(desc(transactions.transactionDate))
      .limit(limit);
  }

  // Check-in operations
  async getCheckIns(userId?: string): Promise<CheckIn[]> {
    if (userId) {
      return await db
        .select()
        .from(checkIns)
        .where(eq(checkIns.userId, userId))
        .orderBy(desc(checkIns.checkInDate));
    }
    return await db
      .select()
      .from(checkIns)
      .orderBy(desc(checkIns.checkInDate));
  }

  async getCheckIn(id: number): Promise<CheckIn | undefined> {
    const [checkIn] = await db
      .select()
      .from(checkIns)
      .where(eq(checkIns.id, id));
    return checkIn;
  }

  async createCheckIn(checkInData: InsertCheckIn): Promise<CheckIn> {
    const [checkIn] = await db
      .insert(checkIns)
      .values(checkInData)
      .returning();
    
    // Calculate fraud score after check-in
    await calculateFraudScore(checkInData.userId);
    
    return checkIn;
  }

  async getUserLatestCheckIn(userId: string): Promise<CheckIn | undefined> {
    const [checkIn] = await db
      .select()
      .from(checkIns)
      .where(eq(checkIns.userId, userId))
      .orderBy(desc(checkIns.checkInDate))
      .limit(1);
    return checkIn;
  }

  // Location Log operations
  async getLocationLogs(userId?: string): Promise<LocationLog[]> {
    if (userId) {
      return await db
        .select()
        .from(locationLogs)
        .where(eq(locationLogs.userId, userId))
        .orderBy(desc(locationLogs.logDate));
    }
    return await db
      .select()
      .from(locationLogs)
      .orderBy(desc(locationLogs.logDate));
  }

  async createLocationLog(logData: InsertLocationLog): Promise<LocationLog> {
    const [log] = await db
      .insert(locationLogs)
      .values(logData)
      .returning();
    return log;
  }

  async getUserLocationLogs(userId: string, limit: number = 10): Promise<LocationLog[]> {
    return await db
      .select()
      .from(locationLogs)
      .where(eq(locationLogs.userId, userId))
      .orderBy(desc(locationLogs.logDate))
      .limit(limit);
  }

  // Audit operations
  async getAudits(auditorId?: string, status?: string): Promise<Audit[]> {
    if (auditorId && status) {
      return await db
        .select()
        .from(audits)
        .where(and(eq(audits.auditorId, auditorId), eq(audits.status, status)))
        .orderBy(desc(audits.createdAt));
    } else if (auditorId) {
      return await db
        .select()
        .from(audits)
        .where(eq(audits.auditorId, auditorId))
        .orderBy(desc(audits.createdAt));
    } else if (status) {
      return await db
        .select()
        .from(audits)
        .where(eq(audits.status, status))
        .orderBy(desc(audits.createdAt));
    }
    return await db
      .select()
      .from(audits)
      .orderBy(desc(audits.createdAt));
  }

  async getAudit(id: number): Promise<Audit | undefined> {
    const [audit] = await db
      .select()
      .from(audits)
      .where(eq(audits.id, id));
    return audit;
  }

  async createAudit(auditData: InsertAudit): Promise<Audit> {
    // Generate hash for tamper-proofing
    const dataToHash = JSON.stringify({
      auditedUserId: auditData.auditedUserId,
      auditorId: auditData.auditorId,
      findings: auditData.findings,
      evidenceUrls: auditData.evidenceUrls,
      latitude: auditData.latitude,
      longitude: auditData.longitude,
      timestamp: new Date().toISOString(),
    });
    
    const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
    
    const [audit] = await db
      .insert(audits)
      .values({
        ...auditData,
        hash,
      })
      .returning();
    return audit;
  }

  async updateAudit(id: number, auditData: Partial<Audit>): Promise<Audit> {
    // If status is being changed to completed, set completedDate
    let updatedData = { ...auditData };
    if (auditData.status === 'completed' && !auditData.completedDate) {
      updatedData.completedDate = new Date();
    }
    
    const [audit] = await db
      .update(audits)
      .set({ ...updatedData, updatedAt: new Date() })
      .where(eq(audits.id, id))
      .returning();
    return audit;
  }

  async getUserAudits(userId: string): Promise<Audit[]> {
    return await db
      .select()
      .from(audits)
      .where(eq(audits.auditedUserId, userId))
      .orderBy(desc(audits.createdAt));
  }

  // Auditor Assignment operations
  async getAuditorAssignments(auditorId?: string, status?: string): Promise<AuditorAssignment[]> {
    if (auditorId && status) {
      return await db
        .select()
        .from(auditorAssignments)
        .where(and(eq(auditorAssignments.auditorId, auditorId), eq(auditorAssignments.status, status)))
        .orderBy(desc(auditorAssignments.createdAt));
    } else if (auditorId) {
      return await db
        .select()
        .from(auditorAssignments)
        .where(eq(auditorAssignments.auditorId, auditorId))
        .orderBy(desc(auditorAssignments.createdAt));
    } else if (status) {
      return await db
        .select()
        .from(auditorAssignments)
        .where(eq(auditorAssignments.status, status))
        .orderBy(desc(auditorAssignments.createdAt));
    }
    return await db
      .select()
      .from(auditorAssignments)
      .orderBy(desc(auditorAssignments.createdAt));
  }

  async createAuditorAssignment(assignmentData: InsertAuditorAssignment): Promise<AuditorAssignment> {
    const [assignment] = await db
      .insert(auditorAssignments)
      .values(assignmentData)
      .returning();
    
    // Create notification for auditor
    await this.createNotification({
      userId: assignmentData.auditorId,
      title: 'New Audit Assignment',
      message: `You've been assigned a new audit with ${assignmentData.priority} priority.`,
      type: 'alert',
      read: false,
      actionUrl: '/auditor/assignments',
    });
    
    return assignment;
  }

  async updateAuditorAssignment(id: number, assignmentData: Partial<AuditorAssignment>): Promise<AuditorAssignment> {
    const [assignment] = await db
      .update(auditorAssignments)
      .set({ ...assignmentData, updatedAt: new Date() })
      .where(eq(auditorAssignments.id, id))
      .returning();
    return assignment;
  }

  async getAuditorAssignmentsWithDetails(auditorId: string): Promise<any[]> {
    // Join with users to get agent details
    const assignmentsWithAgents = await db.query.auditorAssignments.findMany({
      where: eq(auditorAssignments.auditorId, auditorId),
      with: {
        agent: true,
      },
      orderBy: [
        desc(auditorAssignments.priority),
        asc(auditorAssignments.dueDate),
      ],
    });
    
    // Get agent profiles for each assignment
    const result = await Promise.all(
      assignmentsWithAgents.map(async (assignment) => {
        const agentProfile = await this.getAgentProfile(assignment.agent.id);
        return {
          ...assignment,
          agentProfile,
        };
      })
    );
    
    return result;
  }

  // Dispute operations
  async getDisputes(status?: string): Promise<Dispute[]> {
    if (status) {
      return await db
        .select()
        .from(disputes)
        .where(eq(disputes.status, status))
        .orderBy(desc(disputes.createdAt));
    }
    return await db
      .select()
      .from(disputes)
      .orderBy(desc(disputes.createdAt));
  }

  async getDispute(id: number): Promise<Dispute | undefined> {
    const [dispute] = await db
      .select()
      .from(disputes)
      .where(eq(disputes.id, id));
    return dispute;
  }

  async createDispute(disputeData: InsertDispute): Promise<Dispute> {
    const [dispute] = await db
      .insert(disputes)
      .values(disputeData)
      .returning();
    
    // Create notification for assigned user if any
    if (disputeData.assignedToUserId) {
      await this.createNotification({
        userId: disputeData.assignedToUserId,
        title: 'New Dispute Assigned',
        message: `A new dispute has been assigned to you with ${disputeData.priority} priority.`,
        type: 'alert',
        read: false,
        actionUrl: '/bank/disputes',
      });
    }
    
    return dispute;
  }

  async updateDispute(id: number, disputeData: Partial<Dispute>): Promise<Dispute> {
    // If status is being changed to resolved, set resolvedAt
    let updatedData = { ...disputeData };
    if (disputeData.status === 'resolved' && !disputeData.resolvedAt) {
      updatedData.resolvedAt = new Date();
    }
    
    const [dispute] = await db
      .update(disputes)
      .set({ ...updatedData, updatedAt: new Date() })
      .where(eq(disputes.id, id))
      .returning();
    
    // Create notification for dispute initiator
    if (disputeData.status === 'resolved') {
      const fullDispute = await this.getDispute(id);
      if (fullDispute) {
        await this.createNotification({
          userId: fullDispute.raisedByUserId,
          title: 'Dispute Resolved',
          message: 'Your dispute has been resolved. Check the resolution details.',
          type: 'success',
          read: false,
          actionUrl: '/disputes',
        });
      }
    }
    
    return dispute;
  }

  async getUserDisputes(userId: string): Promise<Dispute[]> {
    return await db
      .select()
      .from(disputes)
      .where(or(
        eq(disputes.raisedByUserId, userId),
        eq(disputes.assignedToUserId, userId)
      ))
      .orderBy(desc(disputes.createdAt));
  }

  // Notification operations
  async getNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(notificationData)
      .returning();
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    const [notification] = await db
      .update(notifications)
      .set({ read: true, readAt: new Date() })
      .where(eq(notifications.id, id))
      .returning();
    return notification;
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.read, false)
      ));
    return result[0].count;
  }

  // Report operations
  async getReports(): Promise<Report[]> {
    return await db
      .select()
      .from(reports)
      .orderBy(desc(reports.createdAt));
  }

  async createReport(reportData: InsertReport): Promise<Report> {
    const [report] = await db
      .insert(reports)
      .values(reportData)
      .returning();
    return report;
  }

  // Fraud Rule operations
  async getFraudRules(): Promise<FraudRule[]> {
    return await db
      .select()
      .from(fraudRules)
      .orderBy(asc(fraudRules.name));
  }

  async updateFraudRule(id: number, ruleData: Partial<FraudRule>): Promise<FraudRule> {
    const [rule] = await db
      .update(fraudRules)
      .set({ ...ruleData, updatedAt: new Date() })
      .where(eq(fraudRules.id, id))
      .returning();
    return rule;
  }

  // Contact Submission operations
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db
      .select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt));
  }

  async createContactSubmission(submissionData: InsertContactSubmission): Promise<ContactSubmission> {
    const [submission] = await db
      .insert(contactSubmissions)
      .values(submissionData)
      .returning();
    return submission;
  }

  // CSP Application operations
  async getCSPApplications(status?: string): Promise<CspApplication[]> {
    if (status) {
      return await db
        .select()
        .from(cspApplications)
        .where(eq(cspApplications.status, status))
        .orderBy(desc(cspApplications.createdAt));
    }
    return await db
      .select()
      .from(cspApplications)
      .orderBy(desc(cspApplications.createdAt));
  }

  async createCSPApplication(applicationData: InsertCspApplication): Promise<CspApplication> {
    const [application] = await db
      .insert(cspApplications)
      .values(applicationData)
      .returning();
    return application;
  }

  async updateCSPApplication(id: number, applicationData: Partial<CspApplication>): Promise<CspApplication> {
    const [application] = await db
      .update(cspApplications)
      .set({ ...applicationData, updatedAt: new Date() })
      .where(eq(cspApplications.id, id))
      .returning();
    return application;
  }

  // Fraud Score operations
  async calculateUserFraudScore(userId: string): Promise<number> {
    return await calculateFraudScore(userId);
  }

  async getHighRiskCSPs(limit: number = 10): Promise<any[]> {
    const highRiskProfiles = await db.query.agentProfiles.findMany({
      where: eq(agentProfiles.riskLevel, 'high'),
      with: {
        user: true,
      },
      orderBy: [desc(agentProfiles.fraudScore)],
      limit,
    });
    
    return highRiskProfiles;
  }
}

export const storage = new DatabaseStorage();
