import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Utility function to calculate fraud score based on different factors
export const calculateFraudScore = async (userId: string): Promise<number> => {
  // Get all transactions, check-ins, and location logs for this user
  const [transactions, checkIns, locationLogs] = await Promise.all([
    db.query.transactions.findMany({
      where: (transactions, { eq }) => eq(transactions.agentId, userId),
      orderBy: (transactions, { desc }) => [desc(transactions.transactionDate)],
    }),
    db.query.checkIns.findMany({
      where: (checkIns, { eq }) => eq(checkIns.userId, userId),
      orderBy: (checkIns, { desc }) => [desc(checkIns.checkInDate)],
    }),
    db.query.locationLogs.findMany({
      where: (locationLogs, { eq }) => eq(locationLogs.userId, userId),
      orderBy: (locationLogs, { desc }) => [desc(locationLogs.logDate)],
    }),
  ]);

  // Get fraud rules
  const fraudRules = await db.select().from(schema.fraudRules).where({ status: 'active' });

  // Initialize score
  let fraudScore = 0;

  // Check for odd-hour transactions (between 11 PM and 5 AM)
  const oddHourTransactions = transactions.filter(tx => {
    const hour = new Date(tx.transactionDate).getHours();
    return hour >= 23 || hour < 5;
  });
  
  if (oddHourTransactions.length > 0) {
    const rule = fraudRules.find(r => r.name === 'odd-hour-transactions');
    if (rule) fraudScore += rule.scoreImpact * oddHourTransactions.length;
  }

  // Check for device/IP changes
  const uniqueDevices = new Set(transactions.map(tx => tx.deviceId));
  const uniqueIPs = new Set(transactions.map(tx => tx.ipAddress));
  
  if (uniqueDevices.size > 2) {
    const rule = fraudRules.find(r => r.name === 'multiple-devices');
    if (rule) fraudScore += rule.scoreImpact;
  }
  
  if (uniqueIPs.size > 2) {
    const rule = fraudRules.find(r => r.name === 'multiple-ips');
    if (rule) fraudScore += rule.scoreImpact;
  }

  // Check for selfie mismatches
  const failedSelfies = checkIns.filter(ci => ci.status === 'failed');
  if (failedSelfies.length > 0) {
    const rule = fraudRules.find(r => r.name === 'selfie-mismatch');
    if (rule) fraudScore += rule.scoreImpact * failedSelfies.length;
  }

  // Check for missing geolocations
  const missingGeoTransactions = transactions.filter(tx => !tx.latitude || !tx.longitude);
  if (missingGeoTransactions.length > 0) {
    const rule = fraudRules.find(r => r.name === 'missing-geolocation');
    if (rule) fraudScore += rule.scoreImpact * missingGeoTransactions.length;
  }

  // Determine risk level based on score
  let riskLevel = 'low';
  if (fraudScore > 50) {
    riskLevel = 'high';
  } else if (fraudScore > 25) {
    riskLevel = 'medium';
  }

  // Update the agent profile with the new score and risk level
  await db.update(schema.agentProfiles)
    .set({ 
      fraudScore,
      riskLevel,
      updatedAt: new Date() 
    })
    .where((agentProfiles, { eq }) => eq(agentProfiles.userId, userId));

  return fraudScore;
};

// Initialize default fraud rules if they don't exist yet
export const initializeFraudRules = async () => {
  const defaultRules = [
    { name: 'odd-hour-transactions', description: 'Transactions between 11 PM and 5 AM', scoreImpact: 15 },
    { name: 'aadhaar-reuse', description: 'Same Aadhaar used across multiple transactions', scoreImpact: 25 },
    { name: 'multiple-devices', description: 'Multiple device changes detected', scoreImpact: 10 },
    { name: 'multiple-ips', description: 'Multiple IP address changes detected', scoreImpact: 10 },
    { name: 'selfie-mismatch', description: 'Selfie verification failed', scoreImpact: 20 },
    { name: 'missing-geolocation', description: 'Location data missing from transaction', scoreImpact: 15 },
    { name: 'failed-biometrics', description: 'Failed biometric authentication', scoreImpact: 30 },
  ];

  // Check if rules already exist
  const existingRules = await db.select().from(schema.fraudRules);
  
  // Only insert rules that don't already exist
  for (const rule of defaultRules) {
    if (!existingRules.some(r => r.name === rule.name)) {
      await db.insert(schema.fraudRules).values({
        name: rule.name,
        description: rule.description,
        scoreImpact: rule.scoreImpact,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }
};
