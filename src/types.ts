export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type BloodComponent = 'PRBC' | 'Platelets' | 'FFP' | 'Cryoprecipitate' | 'WholeBlood';

export type StockStatus = 'usable' | 'reserved' | 'quarantined' | 'in_transit' | 'expired' | 'discarded';

export interface BloodUnit {
  id: string;
  batchNumber: string;
  donorCode: string;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  volumeMl: number;
  collectionDate: string;
  expiryDate: string;
  daysToExpiry: number;
  status: StockStatus;
  facilityId: string;
  storageUnit: string; // e.g. "Cold Room 2 - Shelf B4"
  temperatureC: number; // e.g. 3.8 for RBC (2-6°C), 22.0 for Platelets, -20.5 for Plasma
  testedViralMarkers: boolean;
  leukoreduced: boolean;
  irradiated: boolean;
  reservedForPatientId?: string;
}

export type FacilityType = 'hospital' | 'blood_bank' | 'trauma_center' | 'health_network';

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  traumaLevel?: 'Level 1' | 'Level 2' | 'Level 3';
  address: string;
  city: string;
  coordinates: { x: number; y: number; lat: number; lng: number };
  verified: boolean;
  bedCount?: number;
  phone: string;
  contactPerson: string;
  availableStockSummary: Record<BloodGroup, number>;
  distanceFromActiveFacility?: number; // km
  etaMinutes?: number;
}

export type EmergencyUrgency = 'CRITICAL_STAT' | 'HIGH' | 'ROUTINE';

export type EmergencyStatus = 'broadcasting' | 'matched' | 'dispatched' | 'in_transit' | 'delivered' | 'cancelled';

export interface FacilityMatchResponse {
  facilityId: string;
  facilityName: string;
  distanceKm: number;
  etaMins: number;
  availableUnits: number;
  status: 'pending' | 'accepted_full' | 'accepted_partial' | 'rejected';
  unitsOffered?: number;
  rejectReason?: string;
  respondedAt?: string;
}

export interface DispatchWaypoint {
  timestamp: string;
  stage: string;
  description: string;
  temperatureC: number;
  courierLocation: string;
  completed: boolean;
}

export interface EmergencyRequest {
  id: string;
  requesterFacilityId: string;
  requesterFacilityName: string;
  targetBloodGroup: BloodGroup;
  targetComponent: BloodComponent;
  unitsRequested: number;
  unitsAllocated: number;
  urgency: EmergencyUrgency;
  patientDiagnosis: string;
  patientRoom?: string;
  matchedFacilities: FacilityMatchResponse[];
  status: EmergencyStatus;
  dispatchLog: DispatchWaypoint[];
  handoverCode: string;
  temperatureTarget: { min: number; max: number };
  currentTransitTemp: number;
  createdAt: string;
  estimatedArrivalMins: number;
  courierVehicle: string;
}

export type OrderingMode = 'manual' | 'ai_draft' | 'controlled_auto';

export interface OrderItem {
  id: string;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  units: number;
  unitPrice: number;
  totalCost: number;
  urgency: 'CRITICAL' | 'HIGH' | 'NORMAL';
  rationale?: string;
}

export interface BloodOrder {
  id: string;
  orderNumber: string;
  facilityId: string;
  facilityName: string;
  supplierFacilityId: string;
  supplierFacilityName: string;
  orderingMode: OrderingMode;
  items: OrderItem[];
  totalUnits: number;
  totalCost: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'in_transit' | 'delivered' | 'rejected';
  autoApproved: boolean;
  aiRationale: string;
  humanApprover?: string;
  complianceFlags: string[];
  createdAt: string;
  deliveredAt?: string;
}

export interface AutoOrderRules {
  enabled: boolean;
  maxBudgetMonthly: number;
  currentMonthlySpent: number;
  maxUnitsPerOrder: number;
  requiresApprovalIfUnitsExceed: number;
  approvedSupplierIds: string[];
  autoTriggerSafetyStockPercent: number; // e.g. trigger if stock falls below 30% of safety target
}

export interface ForecastItem {
  bloodGroup: BloodGroup;
  component: BloodComponent;
  currentUsableStock: number;
  predictedDemand7Days: number;
  shortageEtaDays: number | null;
  recommendedOrderUnits: number;
  safetyStockTarget: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'OPTIMAL' | 'SURPLUS';
  reasoning: string;
}

export interface ScheduledSurgery {
  id: string;
  patientId: string;
  procedure: string;
  department: string;
  scheduledDate: string;
  requiredBloodGroup: BloodGroup;
  requiredComponent: BloodComponent;
  unitsReserved: number;
  surgeon: string;
  riskLevel: 'High Blood Loss' | 'Moderate' | 'Routine';
}

export interface AccidentHotspot {
  id: string;
  name: string;
  corridor: string;
  coordinates: { x: number; y: number; lat: number; lng: number };
  riskLevel: 'CRITICAL_HIGH' | 'ELEVATED' | 'MODERATE';
  peakDays: string[];
  peakHours: string;
  historicalTraumaMonthly: number;
  primaryInjuries: string;
  recommendedPreStock: Record<string, number>;
  primaryReceivingHospitalId: string;
  primaryReceivingHospitalName: string;
}

export type UserRole = 
  | 'admin' 
  | 'inventory_manager' 
  | 'emergency_staff' 
  | 'blood_bank_staff' 
  | 'health_authority';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  facilityId: string;
  facilityName: string;
  badgeNumber: string;
}

export type SubscriptionTier = 'essential' | 'professional' | 'autonomous' | 'enterprise';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  facilityId?: string;
  details: string;
  complianceSeal?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  facility: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

// Gamified Donor Recognition Program Types
export type BadgeCategory = 'consistency' | 'rare_blood' | 'referrals' | 'emergency' | 'milestones';
export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface DonorBadge {
  id: string;
  title: string;
  category: BadgeCategory;
  tier: BadgeTier;
  iconName: string; // Lucide icon identifier
  description: string;
  requirement: string;
  pointsAwarded: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: {
    current: number;
    target: number;
    unit: string;
  };
}

export interface DonationPointsBreakdown {
  basePoints: number;
  rareTypeBonus: number;
  streakBonus: number;
  emergencySurgeBonus: number;
  referralBonus: number;
  totalPoints: number;
}

export interface DonationHistoryRecord {
  id: string;
  date: string;
  facilityName: string;
  component: BloodComponent;
  volumeMl: number;
  bloodGroup: BloodGroup;
  pointsEarned: number;
  breakdown: DonationPointsBreakdown;
  verifiedByStaff: string;
  impactSummary: string;
  vitalMetrics?: {
    hemoglobinGdl: number;
    bloodPressure: string;
    pulseBpm: number;
  };
}

export interface DonorProfile {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  email: string;
  bloodGroup: BloodGroup;
  isRareType: boolean;
  phenotypeDescription: string;
  totalPoints: number;
  tier: 'Bronze Lifesaver' | 'Silver Guardian' | 'Gold Sentinel' | 'Platinum Vanguard' | 'Diamond Mythic';
  level: number;
  nextTierPoints: number;
  currentTierMinPoints: number;
  totalDonationsCount: number;
  totalVolumeMl: number;
  livesSavedEstimated: number;
  currentStreakMonths: number;
  longestStreakMonths: number;
  lastDonationDate: string;
  nextEligibleDate: string;
  referralCode: string;
  referralsCount: number;
  earnedBadges: DonorBadge[];
  donationHistory: DonationHistoryRecord[];
  city: string;
  homeFacilityName: string;
  isAnonymousOnLeaderboard: boolean;
}

export interface LeaderboardDonor {
  id: string;
  rank: number;
  previousRank?: number;
  name: string;
  handle: string;
  avatarUrl: string;
  bloodGroup: BloodGroup;
  isRareType: boolean;
  tier: 'Bronze Lifesaver' | 'Silver Guardian' | 'Gold Sentinel' | 'Platinum Vanguard' | 'Diamond Mythic';
  totalPoints: number;
  donationsCount: number;
  streakMonths: number;
  referralsCount: number;
  city: string;
  highlightBadge: string;
  isCurrentDonor?: boolean;
}

