import { 
  DonorBadge, 
  DonorProfile, 
  LeaderboardDonor, 
  DonationPointsBreakdown, 
  BloodGroup, 
  BloodComponent 
} from '../types';

export const DONOR_TIER_CONFIGS = [
  {
    tier: 'Bronze Lifesaver' as const,
    minPoints: 0,
    maxPoints: 499,
    level: 1,
    color: 'from-amber-700 to-amber-900',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    badgeColor: 'bg-amber-100 text-amber-800',
    perks: ['Digital Donor Passport', 'Live Impact Notifications', 'Base Referral Multiplier (1x)']
  },
  {
    tier: 'Silver Guardian' as const,
    minPoints: 500,
    maxPoints: 1499,
    level: 2,
    color: 'from-slate-400 to-slate-600',
    textColor: 'text-slate-700',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-300',
    badgeColor: 'bg-slate-100 text-slate-800',
    perks: ['+5% Point Multiplier', 'Priority STAT Emergency Alerts', 'Biomarker & Hemoglobin Trend Insights']
  },
  {
    tier: 'Gold Sentinel' as const,
    minPoints: 1500,
    maxPoints: 2999,
    level: 3,
    color: 'from-amber-400 to-yellow-600',
    textColor: 'text-amber-600',
    bgColor: 'bg-amber-50/80',
    borderColor: 'border-amber-300',
    badgeColor: 'bg-amber-100 text-amber-900',
    perks: ['+10% Point Multiplier', 'Fast-Track Check-In at All Network Hubs', 'Exclusive Gold Hero Digital Card']
  },
  {
    tier: 'Platinum Vanguard' as const,
    minPoints: 3000,
    maxPoints: 5999,
    level: 4,
    color: 'from-cyan-400 to-blue-600',
    textColor: 'text-cyan-600',
    bgColor: 'bg-cyan-50/80',
    borderColor: 'border-cyan-300',
    badgeColor: 'bg-cyan-100 text-cyan-900',
    perks: ['+20% Point Multiplier', 'Direct Line to Regional Surge Coordinators', 'Annual Civic Hero Certificate & Lapel Pin']
  },
  {
    tier: 'Diamond Mythic' as const,
    minPoints: 6000,
    maxPoints: 999999,
    level: 5,
    color: 'from-fuchsia-500 via-rose-500 to-indigo-600',
    textColor: 'text-fuchsia-600',
    bgColor: 'bg-fuchsia-50/80',
    borderColor: 'border-fuchsia-300',
    badgeColor: 'bg-gradient-to-r from-fuchsia-100 to-rose-100 text-fuchsia-900',
    perks: ['+30% Point Multiplier', 'VIP Private Phlebotomy Suite Access', 'BloodRUSH Hall of Fame Permanent Honor']
  }
];

export const ALL_DONOR_BADGES: DonorBadge[] = [
  // Consistency
  {
    id: 'badge_first_drop',
    title: 'Genesis Drop',
    category: 'milestones',
    tier: 'bronze',
    iconName: 'Droplet',
    description: 'Completed your very first verified blood donation.',
    requirement: '1 Completed Donation',
    pointsAwarded: 50,
    unlocked: true,
    unlockedAt: '2025-06-12T10:30:00Z',
    progress: { current: 1, target: 1, unit: 'donation' }
  },
  {
    id: 'badge_streak_3',
    title: 'Clockwork Heart',
    category: 'consistency',
    tier: 'bronze',
    iconName: 'Flame',
    description: 'Maintained a 3-interval consistent donation streak without missing an eligibility window.',
    requirement: '3 Consecutive Eligibility Windows',
    pointsAwarded: 150,
    unlocked: true,
    unlockedAt: '2025-10-18T14:15:00Z',
    progress: { current: 5, target: 3, unit: 'intervals' }
  },
  {
    id: 'badge_streak_6',
    title: 'Iron Pulse',
    category: 'consistency',
    tier: 'silver',
    iconName: 'Zap',
    description: 'Maintained a 6-interval active donation streak.',
    requirement: '6 Consecutive Eligibility Windows',
    pointsAwarded: 350,
    unlocked: false,
    progress: { current: 5, target: 6, unit: 'intervals' }
  },
  {
    id: 'badge_streak_12',
    title: 'Century Sentinel',
    category: 'consistency',
    tier: 'gold',
    iconName: 'Crown',
    description: '12-interval unbroken annual dedication to regional blood supply stability.',
    requirement: '12 Consecutive Eligibility Windows',
    pointsAwarded: 800,
    unlocked: false,
    progress: { current: 5, target: 12, unit: 'intervals' }
  },

  // Rare Blood Type
  {
    id: 'badge_universal_shield',
    title: 'Universal Shield',
    category: 'rare_blood',
    tier: 'platinum',
    iconName: 'Shield',
    description: 'O- Negative universal red blood cell donor. Your units are used immediately in emergency trauma resuscitations.',
    requirement: 'Verified O- Negative Blood Group',
    pointsAwarded: 600,
    unlocked: true,
    unlockedAt: '2025-06-12T10:30:00Z',
    progress: { current: 1, target: 1, unit: 'verified' }
  },
  {
    id: 'badge_plasma_sovereign',
    title: 'Plasma Sovereign',
    category: 'rare_blood',
    tier: 'gold',
    iconName: 'Sparkles',
    description: 'AB Universal Plasma Donor or 3+ Fresh Frozen Plasma donations.',
    requirement: '3 Plasma Units Donated or AB Group',
    pointsAwarded: 450,
    unlocked: false,
    progress: { current: 1, target: 3, unit: 'units' }
  },
  {
    id: 'badge_apheresis_ace',
    title: 'Apheresis Ace',
    category: 'rare_blood',
    tier: 'silver',
    iconName: 'Layers',
    description: 'Completed 2+ Platelet Apheresis concentrate donations for oncology & transplant patients.',
    requirement: '2 Platelet Donations',
    pointsAwarded: 300,
    unlocked: true,
    unlockedAt: '2026-01-20T11:00:00Z',
    progress: { current: 2, target: 2, unit: 'donations' }
  },
  {
    id: 'badge_rare_phenotype',
    title: 'Golden Antigen',
    category: 'rare_blood',
    tier: 'diamond',
    iconName: 'Star',
    description: 'Identified with rare extended antigen phenotype (e.g., Duffy negative, Kell negative, or rare Rh sub-types).',
    requirement: 'Specialized Antigen Typing Clearance',
    pointsAwarded: 1000,
    unlocked: false,
    progress: { current: 0, target: 1, unit: 'antigen check' }
  },

  // Referrals & Ambassador
  {
    id: 'badge_first_referral',
    title: 'Beacon of Hope',
    category: 'referrals',
    tier: 'bronze',
    iconName: 'UserPlus',
    description: 'Invited your first friend who completed their initial blood donation on BloodRUSH.',
    requirement: '1 Verified Friend Referral',
    pointsAwarded: 200,
    unlocked: true,
    unlockedAt: '2025-11-04T16:20:00Z',
    progress: { current: 3, target: 1, unit: 'referral' }
  },
  {
    id: 'badge_squad_leader',
    title: 'Lifesaver Squad',
    category: 'referrals',
    tier: 'silver',
    iconName: 'Users',
    description: 'Successfully mobilized 5 active donors into the regional network.',
    requirement: '5 Verified Friend Referrals',
    pointsAwarded: 500,
    unlocked: false,
    progress: { current: 3, target: 5, unit: 'referrals' }
  },
  {
    id: 'badge_movement_maker',
    title: 'Movement Maker',
    category: 'referrals',
    tier: 'platinum',
    iconName: 'Megaphone',
    description: 'Inspired a donor network of 10+ active regular donors.',
    requirement: '10 Verified Friend Referrals',
    pointsAwarded: 1200,
    unlocked: false,
    progress: { current: 3, target: 10, unit: 'referrals' }
  },

  // Emergency STAT Responders
  {
    id: 'badge_stat_responder',
    title: 'Midnight Siren Hero',
    category: 'emergency',
    tier: 'gold',
    iconName: 'Radio',
    description: 'Answered a critical STAT shortage broadcast and donated within 2 hours.',
    requirement: '1 Emergency STAT Response Donation',
    pointsAwarded: 500,
    unlocked: true,
    unlockedAt: '2026-02-14T21:45:00Z',
    progress: { current: 1, target: 1, unit: 'STAT call' }
  },
  {
    id: 'badge_corridor_shield',
    title: 'Trauma Corridor Shield',
    category: 'emergency',
    tier: 'silver',
    iconName: 'MapPin',
    description: 'Donated directly to pre-stock inventory ahead of high-risk holiday/highway surge forecast.',
    requirement: '1 Pre-Stock Surge Donation',
    pointsAwarded: 300,
    unlocked: true,
    unlockedAt: '2026-02-28T09:15:00Z',
    progress: { current: 1, target: 1, unit: 'surge buffer' }
  },

  // Milestones & Volume
  {
    id: 'badge_gallon_1',
    title: 'One Gallon Pioneer',
    category: 'milestones',
    tier: 'silver',
    iconName: 'Award',
    description: 'Reached 8 cumulative units (3,600 ml) of life-giving blood.',
    requirement: '8 Whole Units (3,600 ml)',
    pointsAwarded: 400,
    unlocked: true,
    unlockedAt: '2026-01-05T13:00:00Z',
    progress: { current: 11, target: 8, unit: 'units' }
  },
  {
    id: 'badge_gallon_3',
    title: 'Three Gallon Sentinel',
    category: 'milestones',
    tier: 'gold',
    iconName: 'ShieldCheck',
    description: 'Contributed 24 cumulative units (10,800 ml) across your lifetime.',
    requirement: '24 Whole Units (10,800 ml)',
    pointsAwarded: 900,
    unlocked: false,
    progress: { current: 11, target: 24, unit: 'units' }
  },
  {
    id: 'badge_100_lives',
    title: 'Century of Lives',
    category: 'milestones',
    tier: 'diamond',
    iconName: 'HeartHandshake',
    description: 'Directly impacted an estimated 100 patient lives through whole blood, RBC, and platelet therapies.',
    requirement: '100 Estimated Lives Saved',
    pointsAwarded: 2500,
    unlocked: false,
    progress: { current: 33, target: 100, unit: 'lives' }
  }
];

export const INITIAL_DONATION_HISTORY = [
  {
    id: 'don-2026-08',
    date: '2026-02-28T09:15:00Z',
    facilityName: 'Metro General Hospital - Level 1 Trauma',
    component: 'PRBC' as BloodComponent,
    volumeMl: 450,
    bloodGroup: 'O-' as BloodGroup,
    pointsEarned: 585,
    breakdown: {
      basePoints: 300,
      rareTypeBonus: 150,
      streakBonus: 45,
      emergencySurgeBonus: 90,
      referralBonus: 0,
      totalPoints: 585
    },
    verifiedByStaff: 'RN Sarah Jenkins (Badge #TR-882)',
    impactSummary: 'Dispatched to Pediatric Trauma Resuscitation Unit Bay 2 within 14 hours of intake.',
    vitalMetrics: {
      hemoglobinGdl: 14.8,
      bloodPressure: '118/76 mmHg',
      pulseBpm: 68
    }
  },
  {
    id: 'don-2026-07',
    date: '2026-02-14T21:45:00Z',
    facilityName: 'City Central Blood Center',
    component: 'Platelets' as BloodComponent,
    volumeMl: 300,
    bloodGroup: 'O-' as BloodGroup,
    pointsEarned: 690,
    breakdown: {
      basePoints: 400,
      rareTypeBonus: 150,
      streakBonus: 40,
      emergencySurgeBonus: 100,
      referralBonus: 0,
      totalPoints: 690
    },
    verifiedByStaff: 'Dr. Marcus Vance (Staff Phlebotomist)',
    impactSummary: 'Urgent apheresis unit allocated to acute leukemia chemotherapy patient.',
    vitalMetrics: {
      hemoglobinGdl: 15.1,
      bloodPressure: '120/78 mmHg',
      pulseBpm: 72
    }
  },
  {
    id: 'don-2026-05',
    date: '2026-01-05T13:00:00Z',
    facilityName: 'St. Jude Regional Medical Center',
    component: 'WholeBlood' as BloodComponent,
    volumeMl: 500,
    bloodGroup: 'O-' as BloodGroup,
    pointsEarned: 435,
    breakdown: {
      basePoints: 250,
      rareTypeBonus: 150,
      streakBonus: 35,
      emergencySurgeBonus: 0,
      referralBonus: 0,
      totalPoints: 435
    },
    verifiedByStaff: 'Nurse Elena Rostova',
    impactSummary: 'Fractionated into PRBC and FFP, supporting cardiac bypass surgery.',
    vitalMetrics: {
      hemoglobinGdl: 14.6,
      bloodPressure: '122/80 mmHg',
      pulseBpm: 66
    }
  },
  {
    id: 'don-2025-11',
    date: '2025-11-04T16:20:00Z',
    facilityName: 'Metro General Hospital - Level 1 Trauma',
    component: 'PRBC' as BloodComponent,
    volumeMl: 450,
    bloodGroup: 'O-' as BloodGroup,
    pointsEarned: 640,
    breakdown: {
      basePoints: 300,
      rareTypeBonus: 150,
      streakBonus: 30,
      emergencySurgeBonus: 0,
      referralBonus: 160,
      totalPoints: 640
    },
    verifiedByStaff: 'RN Sarah Jenkins',
    impactSummary: 'Friend referral first donation completed (Lucas Chang). Bonus +160 pts unlocked.',
    vitalMetrics: {
      hemoglobinGdl: 14.9,
      bloodPressure: '116/74 mmHg',
      pulseBpm: 64
    }
  }
];

export const INITIAL_DONOR_PROFILE: DonorProfile = {
  id: 'donor-user-01',
  name: 'Alex Mercer',
  handle: 'alex_lifesaver_o_neg',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  email: 'alex.mercer.donor@gmail.com',
  bloodGroup: 'O-',
  isRareType: true,
  phenotypeDescription: 'Universal Red Cell Donor • RhD Negative (cde/cde) • CMV Negative',
  totalPoints: 2850,
  tier: 'Gold Sentinel',
  level: 3,
  nextTierPoints: 3000,
  currentTierMinPoints: 1500,
  totalDonationsCount: 11,
  totalVolumeMl: 4950,
  livesSavedEstimated: 33, // 3 lives per unit
  currentStreakMonths: 5,
  longestStreakMonths: 7,
  lastDonationDate: '2026-02-28T09:15:00Z',
  nextEligibleDate: '2026-04-25T00:00:00Z', // ~56 days after Feb 28
  referralCode: 'RUSH-ALEX-992',
  referralsCount: 3,
  earnedBadges: ALL_DONOR_BADGES,
  donationHistory: INITIAL_DONATION_HISTORY,
  city: 'San Francisco, CA',
  homeFacilityName: 'Metro General Hospital - Level 1 Trauma',
  isAnonymousOnLeaderboard: false
};

export const INITIAL_LEADERBOARD: LeaderboardDonor[] = [
  {
    id: 'lead-01',
    rank: 1,
    previousRank: 1,
    name: 'Dr. Evelyn Martinez',
    handle: 'evelyn_platelet_queen',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    bloodGroup: 'AB-',
    isRareType: true,
    tier: 'Diamond Mythic',
    totalPoints: 7420,
    donationsCount: 28,
    streakMonths: 14,
    referralsCount: 12,
    city: 'San Francisco',
    highlightBadge: 'Century Sentinel & Mythic Hero'
  },
  {
    id: 'lead-02',
    rank: 2,
    previousRank: 3,
    name: 'Marcus Chen',
    handle: 'marcus_onega_pulse',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    bloodGroup: 'O-',
    isRareType: true,
    tier: 'Platinum Vanguard',
    totalPoints: 5120,
    donationsCount: 19,
    streakMonths: 11,
    referralsCount: 8,
    city: 'Oakland',
    highlightBadge: 'Universal Shield & Trauma Hero'
  },
  {
    id: 'lead-03',
    rank: 3,
    previousRank: 2,
    name: 'Sophia Patel',
    handle: 'sophia_saves_lives',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    bloodGroup: 'B-',
    isRareType: true,
    tier: 'Platinum Vanguard',
    totalPoints: 4890,
    donationsCount: 17,
    streakMonths: 9,
    referralsCount: 9,
    city: 'San Jose',
    highlightBadge: 'Golden Antigen Specialist'
  },
  {
    id: 'donor-user-01',
    rank: 4,
    previousRank: 5,
    name: 'Alex Mercer (You)',
    handle: 'alex_lifesaver_o_neg',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    bloodGroup: 'O-',
    isRareType: true,
    tier: 'Gold Sentinel',
    totalPoints: 2850,
    donationsCount: 11,
    streakMonths: 5,
    referralsCount: 3,
    city: 'San Francisco',
    highlightBadge: 'Universal Shield & Midnight Hero',
    isCurrentDonor: true
  },
  {
    id: 'lead-05',
    rank: 5,
    previousRank: 4,
    name: 'David K. Lawson',
    handle: 'dlawson_apheresis',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    bloodGroup: 'A-',
    isRareType: false,
    tier: 'Gold Sentinel',
    totalPoints: 2640,
    donationsCount: 10,
    streakMonths: 8,
    referralsCount: 4,
    city: 'Palo Alto',
    highlightBadge: 'Apheresis Ace'
  },
  {
    id: 'lead-06',
    rank: 6,
    previousRank: 6,
    name: 'Hannah Nguyen',
    handle: 'hannah_giving_hope',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    bloodGroup: 'O+',
    isRareType: false,
    tier: 'Gold Sentinel',
    totalPoints: 2310,
    donationsCount: 9,
    streakMonths: 6,
    referralsCount: 5,
    city: 'Berkeley',
    highlightBadge: 'Squad Leader Ambassador'
  },
  {
    id: 'lead-07',
    rank: 7,
    previousRank: 8,
    name: 'Carlos Rivera',
    handle: 'carlos_b_positive',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
    bloodGroup: 'B+',
    isRareType: false,
    tier: 'Silver Guardian',
    totalPoints: 1420,
    donationsCount: 6,
    streakMonths: 4,
    referralsCount: 2,
    city: 'San Francisco',
    highlightBadge: 'Clockwork Heart'
  },
  {
    id: 'lead-08',
    rank: 8,
    previousRank: 7,
    name: 'Zoe Washington',
    handle: 'zoe_ab_plasma',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    bloodGroup: 'AB+',
    isRareType: false,
    tier: 'Silver Guardian',
    totalPoints: 1280,
    donationsCount: 5,
    streakMonths: 3,
    referralsCount: 3,
    city: 'Oakland',
    highlightBadge: 'Plasma Sovereign'
  },
  {
    id: 'lead-09',
    rank: 9,
    previousRank: 10,
    name: 'Tariq Al-Mansoor',
    handle: 'tariq_stat_ready',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    bloodGroup: 'O-',
    isRareType: true,
    tier: 'Silver Guardian',
    totalPoints: 1150,
    donationsCount: 4,
    streakMonths: 4,
    referralsCount: 1,
    city: 'San Jose',
    highlightBadge: 'Midnight Siren Hero'
  },
  {
    id: 'lead-10',
    rank: 10,
    previousRank: 9,
    name: 'Emily Thornton',
    handle: 'emily_first_drop',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    bloodGroup: 'A+',
    isRareType: false,
    tier: 'Bronze Lifesaver',
    totalPoints: 480,
    donationsCount: 2,
    streakMonths: 2,
    referralsCount: 1,
    city: 'Fremont',
    highlightBadge: 'Genesis Drop'
  }
];

export function calculateDonationPoints(
  bloodGroup: BloodGroup,
  component: BloodComponent,
  isEmergencyStat: boolean = false,
  currentStreakMonths: number = 0,
  isSurgeCorridor: boolean = false
): DonationPointsBreakdown {
  // Base points by component
  let basePoints = 250;
  if (component === 'Platelets') basePoints = 400;
  if (component === 'PRBC') basePoints = 300;
  if (component === 'FFP' || component === 'Cryoprecipitate') basePoints = 200;
  if (component === 'WholeBlood') basePoints = 250;

  // Rare blood bonus (O-, AB-, B-, A-)
  let rareTypeBonus = 0;
  if (bloodGroup === 'O-') rareTypeBonus = 150; // Universal Red Cell
  else if (bloodGroup === 'AB-') rareTypeBonus = 150; // Universal Plasma
  else if (bloodGroup === 'B-' || bloodGroup === 'A-') rareTypeBonus = 100;
  else if (bloodGroup === 'AB+') rareTypeBonus = 75;

  // Streak multiplier: +10% per month of active streak (capped at +50%)
  const streakMultiplier = Math.min(0.50, currentStreakMonths * 0.10);
  const streakBonus = Math.round(basePoints * streakMultiplier);

  // Emergency surge bonus
  let emergencySurgeBonus = 0;
  if (isEmergencyStat) emergencySurgeBonus += 250;
  if (isSurgeCorridor) emergencySurgeBonus += 100;

  const totalPoints = basePoints + rareTypeBonus + streakBonus + emergencySurgeBonus;

  return {
    basePoints,
    rareTypeBonus,
    streakBonus,
    emergencySurgeBonus,
    referralBonus: 0,
    totalPoints
  };
}

export function determineTier(points: number): 'Bronze Lifesaver' | 'Silver Guardian' | 'Gold Sentinel' | 'Platinum Vanguard' | 'Diamond Mythic' {
  if (points >= 6000) return 'Diamond Mythic';
  if (points >= 3000) return 'Platinum Vanguard';
  if (points >= 1500) return 'Gold Sentinel';
  if (points >= 500) return 'Silver Guardian';
  return 'Bronze Lifesaver';
}

export function getTierInfo(points: number) {
  const tier = determineTier(points);
  const tierConfig = DONOR_TIER_CONFIGS.find(t => t.tier === tier) || DONOR_TIER_CONFIGS[0];
  const nextTierConfig = DONOR_TIER_CONFIGS[tierConfig.level] || tierConfig;
  return {
    tier,
    level: tierConfig.level,
    minPoints: tierConfig.minPoints,
    maxPoints: tierConfig.maxPoints,
    nextTierPoints: nextTierConfig.minPoints
  };
}
