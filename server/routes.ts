import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { initializeFraudRules } from "./db";
import { setupAuth, isAuthenticated } from "./replitAuth";
import multer from "multer";
import { calculateFraudScore } from "./db";
import path from "path";
import crypto from "crypto";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { 
  insertTransactionSchema, 
  insertCheckInSchema, 
  insertLocationLogSchema,
  insertAuditSchema,
  insertDisputeSchema,
  insertContactSubmissionSchema,
  insertCspApplicationSchema
} from "@shared/schema";

const createMulterMiddleware = () => {
  const storage = multer.memoryStorage();
  return multer({ 
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    }
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize database with default fraud rules
  await initializeFraudRules();
  
  // Auth middleware
  await setupAuth(app);

  // Upload middleware
  const upload = createMulterMiddleware();

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User profile routes
  app.get('/api/users/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // If the user is an agent, get their agent profile as well
      if (user?.role === 'agent') {
        const agentProfile = await storage.getAgentProfile(userId);
        return res.json({ user, agentProfile });
      }
      
      return res.json({ user });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  app.patch('/api/users/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userData = req.body;
      
      // Update user data
      const updatedUser = await storage.updateUser(userId, userData);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  // Agent dashboard routes
  app.get('/api/agent/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'agent') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const [agentProfile, transactions, checkIns, locationLogs] = await Promise.all([
        storage.getAgentProfile(userId),
        storage.getUserTransactions(userId, 10),
        storage.getUserLatestCheckIn(userId),
        storage.getUserLocationLogs(userId, 5)
      ]);
      
      res.json({
        agentProfile,
        transactions,
        latestCheckIn: checkIns,
        locationLogs
      });
    } catch (error) {
      console.error("Error fetching agent stats:", error);
      res.status(500).json({ message: "Failed to fetch agent statistics" });
    }
  });

  // Transaction routes
  app.post('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'agent') {
        return res.status(403).json({ message: "Only agents can create transactions" });
      }
      
      // Validate transaction data
      const validatedData = insertTransactionSchema.safeParse(req.body);
      if (!validatedData.success) {
        const error = fromZodError(validatedData.error);
        return res.status(400).json({ message: error.message });
      }
      
      // Add agent ID to transaction data
      const transactionData = {
        ...req.body,
        agentId: userId,
        ipAddress: req.ip,
      };
      
      const transaction = await storage.createTransaction(transactionData);
      
      // Log location for transaction
      if (req.body.latitude && req.body.longitude) {
        await storage.createLocationLog({
          userId,
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          deviceId: req.body.deviceId,
          activity: 'transaction',
        });
      }
      
      res.status(201).json(transaction);
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  app.get('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // For agents, return only their transactions
      if (user?.role === 'agent') {
        const transactions = await storage.getUserTransactions(userId, 50);
        return res.json(transactions);
      }
      
      // For admin, bank officers, and auditors, return all transactions
      const transactions = await storage.getTransactions();
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Check-in routes
  app.post('/api/check-ins', isAuthenticated, upload.fields([
    { name: 'selfie', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'agent') {
        return res.status(403).json({ message: "Only agents can perform check-ins" });
      }

      // In a real app, we would process and store the uploaded files to a CDN
      // For now, we'll simulate it with hash-based file names
      let selfieUrl = null;
      let videoUrl = null;
      
      if (req.files && req.files.selfie && req.files.selfie[0]) {
        const fileHash = crypto.createHash('md5').update(req.files.selfie[0].buffer).digest('hex');
        selfieUrl = `/uploads/selfies/${fileHash}.jpg`;
      }
      
      if (req.files && req.files.video && req.files.video[0]) {
        const fileHash = crypto.createHash('md5').update(req.files.video[0].buffer).digest('hex');
        videoUrl = `/uploads/videos/${fileHash}.mp4`;
      }
      
      // Validate check-in data
      const checkInData = {
        userId,
        selfieUrl,
        videoUrl,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        address: req.body.address,
        deviceId: req.body.deviceId,
        ipAddress: req.ip,
        status: 'verified', // In a real app, we would verify the selfie against stored profile
        matchScore: 98, // Simulated match score
      };
      
      const checkIn = await storage.createCheckIn(checkInData);
      
      // Log location for check-in
      if (req.body.latitude && req.body.longitude) {
        await storage.createLocationLog({
          userId,
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          deviceId: req.body.deviceId,
          activity: 'check-in',
        });
      }
      
      res.status(201).json(checkIn);
    } catch (error) {
      console.error("Error performing check-in:", error);
      res.status(500).json({ message: "Failed to complete check-in" });
    }
  });

  app.get('/api/check-ins', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // For agents, return only their check-ins
      if (user?.role === 'agent') {
        const checkIns = await storage.getCheckIns(userId);
        return res.json(checkIns);
      }
      
      // For admin, bank officers, and auditors, return all check-ins
      const checkIns = await storage.getCheckIns();
      res.json(checkIns);
    } catch (error) {
      console.error("Error fetching check-ins:", error);
      res.status(500).json({ message: "Failed to fetch check-ins" });
    }
  });

  // Location log routes
  app.post('/api/location-logs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate location log data
      const validatedData = insertLocationLogSchema.safeParse(req.body);
      if (!validatedData.success) {
        const error = fromZodError(validatedData.error);
        return res.status(400).json({ message: error.message });
      }
      
      // Add user ID to log data
      const logData = {
        ...req.body,
        userId,
      };
      
      const log = await storage.createLocationLog(logData);
      res.status(201).json(log);
    } catch (error) {
      console.error("Error logging location:", error);
      res.status(500).json({ message: "Failed to log location" });
    }
  });

  app.get('/api/location-logs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // For agents, return only their location logs
      if (user?.role === 'agent') {
        const logs = await storage.getLocationLogs(userId);
        return res.json(logs);
      }
      
      // For admin, bank officers, and auditors, return all logs or filter by query params
      const targetUserId = req.query.userId;
      
      if (targetUserId) {
        const logs = await storage.getLocationLogs(targetUserId);
        return res.json(logs);
      }
      
      const logs = await storage.getLocationLogs();
      res.json(logs);
    } catch (error) {
      console.error("Error fetching location logs:", error);
      res.status(500).json({ message: "Failed to fetch location logs" });
    }
  });

  // Admin dashboard routes
  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Get stats for admin dashboard
      const [users, highRiskAgents, pendingAudits, fraudRules] = await Promise.all([
        storage.getUsers(),
        storage.getHighRiskCSPs(10),
        storage.getAudits(undefined, 'pending'),
        storage.getFraudRules()
      ]);
      
      // Count agents by role
      const agentCount = users.filter(u => u.role === 'agent').length;
      const auditorCount = users.filter(u => u.role === 'auditor').length;
      const bankOfficerCount = users.filter(u => u.role === 'bank').length;
      
      res.json({
        userCounts: {
          total: users.length,
          agents: agentCount,
          auditors: auditorCount,
          bankOfficers: bankOfficerCount,
        },
        highRiskAgents,
        pendingAudits: pendingAudits.length,
        fraudRules
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin statistics" });
    }
  });

  // Auditor routes
  app.get('/api/auditor/assignments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'auditor') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const assignments = await storage.getAuditorAssignmentsWithDetails(userId);
      res.json(assignments);
    } catch (error) {
      console.error("Error fetching auditor assignments:", error);
      res.status(500).json({ message: "Failed to fetch auditor assignments" });
    }
  });

  app.post('/api/audits', isAuthenticated, upload.array('evidence', 5), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'auditor') {
        return res.status(403).json({ message: "Only auditors can submit audits" });
      }
      
      // In a real app, we would process and store the uploaded files to a CDN
      // For now, we'll simulate it with hash-based file names
      const evidenceUrls = [];
      
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const fileHash = crypto.createHash('md5').update(file.buffer).digest('hex');
          const fileExt = path.extname(file.originalname) || '.jpg';
          evidenceUrls.push(`/uploads/evidence/${fileHash}${fileExt}`);
        }
      }
      
      // Create audit record
      const auditData = {
        auditedUserId: req.body.agentId,
        auditorId: userId,
        findings: req.body.findings,
        evidenceUrls: evidenceUrls,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        status: req.body.status || 'completed',
        deviceId: req.body.deviceId,
        ipAddress: req.ip,
        priority: req.body.priority || 'normal',
        auditDate: new Date(),
        completedDate: req.body.status === 'completed' ? new Date() : undefined,
      };
      
      const audit = await storage.createAudit(auditData);
      
      // Update assignment status if provided
      if (req.body.assignmentId) {
        await storage.updateAuditorAssignment(parseInt(req.body.assignmentId), {
          status: 'completed'
        });
      }
      
      // Create notification for admin
      await storage.createNotification({
        userId: (await storage.getUsers('admin'))[0]?.id,
        title: 'Audit Completed',
        message: `An audit has been completed by ${user.firstName} ${user.lastName}`,
        type: 'info',
        read: false,
        actionUrl: '/admin/audit-logs',
      });
      
      // Calculate new fraud score for the audited agent
      await calculateFraudScore(req.body.agentId);
      
      res.status(201).json(audit);
    } catch (error) {
      console.error("Error submitting audit:", error);
      res.status(500).json({ message: "Failed to submit audit" });
    }
  });

  // Bank officer routes
  app.get('/api/bank/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'bank') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Get stats for bank officer dashboard
      const [agents, disputes, audits] = await Promise.all([
        storage.getAgentProfiles(),
        storage.getDisputes('open'),
        storage.getAudits(undefined, 'completed')
      ]);
      
      // Count agents by risk level
      const lowRiskCount = agents.filter(a => a.riskLevel === 'low').length;
      const mediumRiskCount = agents.filter(a => a.riskLevel === 'medium').length;
      const highRiskCount = agents.filter(a => a.riskLevel === 'high').length;
      
      res.json({
        agentCounts: {
          total: agents.length,
          lowRisk: lowRiskCount,
          mediumRisk: mediumRiskCount,
          highRisk: highRiskCount,
        },
        openDisputes: disputes.length,
        completedAudits: audits.length,
      });
    } catch (error) {
      console.error("Error fetching bank officer stats:", error);
      res.status(500).json({ message: "Failed to fetch bank officer statistics" });
    }
  });

  // Dispute routes
  app.post('/api/disputes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate dispute data
      const validatedData = insertDisputeSchema.safeParse(req.body);
      if (!validatedData.success) {
        const error = fromZodError(validatedData.error);
        return res.status(400).json({ message: error.message });
      }
      
      // Add user ID to dispute data
      const disputeData = {
        ...req.body,
        raisedByUserId: userId,
      };
      
      const dispute = await storage.createDispute(disputeData);
      res.status(201).json(dispute);
    } catch (error) {
      console.error("Error creating dispute:", error);
      res.status(500).json({ message: "Failed to create dispute" });
    }
  });

  app.get('/api/disputes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // For agents, return only their disputes
      if (user?.role === 'agent') {
        const disputes = await storage.getUserDisputes(userId);
        return res.json(disputes);
      }
      
      // For admin, bank officers, and auditors, return all disputes or filter by status
      const status = req.query.status as string;
      
      if (status) {
        const disputes = await storage.getDisputes(status);
        return res.json(disputes);
      }
      
      const disputes = await storage.getDisputes();
      res.json(disputes);
    } catch (error) {
      console.error("Error fetching disputes:", error);
      res.status(500).json({ message: "Failed to fetch disputes" });
    }
  });

  app.patch('/api/disputes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Only bank officers and admins can update disputes
      if (user?.role !== 'bank' && user?.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const disputeId = parseInt(req.params.id);
      const disputeData = req.body;
      
      const updatedDispute = await storage.updateDispute(disputeId, disputeData);
      res.json(updatedDispute);
    } catch (error) {
      console.error("Error updating dispute:", error);
      res.status(500).json({ message: "Failed to update dispute" });
    }
  });

  // Notification routes
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.patch('/api/notifications/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const updatedNotification = await storage.markNotificationAsRead(notificationId);
      res.json(updatedNotification);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  app.get('/api/notifications/unread-count', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const count = await storage.getUnreadNotificationCount(userId);
      res.json({ count });
    } catch (error) {
      console.error("Error fetching unread notifications count:", error);
      res.status(500).json({ message: "Failed to fetch unread notifications count" });
    }
  });

  // Public routes (no authentication required)
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = zodValidator(insertContactSubmissionSchema.parse(req.body));
      const submission = await storage.createContactSubmission(req.body);
      res.status(201).json({ success: true, id: submission.id });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  app.post('/api/apply', async (req, res) => {
    try {
      const validatedData = zodValidator(insertCspApplicationSchema.parse(req.body));
      const application = await storage.createCSPApplication(req.body);
      res.status(201).json({ success: true, id: application.id });
    } catch (error) {
      console.error("Error submitting CSP application:", error);
      res.status(500).json({ message: "Failed to submit CSP application" });
    }
  });

  // Create server
  const httpServer = createServer(app);
  return httpServer;
}
