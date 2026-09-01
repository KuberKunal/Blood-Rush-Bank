import { BloodGroup, BloodComponent, BloodUnit, Facility, ScheduledSurgery, AccidentHotspot, BloodOrder, EmergencyRequest, AuditLog, ForecastItem, AutoOrderRules, AuditLogEntry } from '../types';

export const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
export const BLOOD_COMPONENTS: BloodComponent[] = ['PRBC', 'Platelets', 'FFP', 'Cryoprecipitate', 'WholeBlood'];

// Component metadata
export const COMPONENT_DETAILS: Record<BloodComponent, {
  fullName: string;
  defaultShelfLifeDays: number;
  tempRange: string;
  storageTargetC: number;
  clinicalUse: string;
}> = {
  PRBC: {
    fullName: 'Packed Red Blood Cells',
    defaultShelfLifeDays: 42,
    tempRange: '2°C to 6°C',
    storageTargetC: 4.0,
    clinicalUse: 'Trauma, surgical blood loss, severe acute anaemia'
  },
  Platelets: {
    fullName: 'Platelet Concentrate (SDP/RDP)',
    defaultShelfLifeDays: 5,
    tempRange: '20°C to 24°C (Constant Agitation)',
    storageTargetC: 22.0,
    clinicalUse: 'Thrombocytopenia, active hemorrhage, chemotherapy support'
  },
  FFP: {
    fullName: 'Fresh Frozen Plasma',
    defaultShelfLifeDays: 365,
    tempRange: '-18°C or colder',
    storageTargetC: -22.0,
    clinicalUse: 'Coagulopathy, massive transfusion, warfarin reversal'
  },
  Cryoprecipitate: {
    fullName: 'Cryoprecipitate AHF',
    defaultShelfLifeDays: 365,
    tempRange: '-18°C or colder',
    storageTargetC: -20.0,
    clinicalUse: 'Hypofibrinogenemia, hemophilia A, Factor XIII deficiency'
  },
  WholeBlood: {
    fullName: 'Whole Blood (Unseparated)',
    defaultShelfLifeDays: 35,
    tempRange: '2°C to 6°C',
    storageTargetC: 4.0,
    clinicalUse: 'Massive trauma resuscitation in field/battlefield protocol'
  }
};

// Medical Compatibility Rules
export const COMPATIBILITY_RULES: Record<BloodComponent, Record<BloodGroup, BloodGroup[]>> = {
  PRBC: {
    'O-': ['O-'],
    'O+': ['O-', 'O+'],
    'A-': ['O-', 'A-'],
    'A+': ['O-', 'O+', 'A-', 'A+'],
    'B-': ['O-', 'B-'],
    'B+': ['O-', 'O+', 'B-', 'B+'],
    'AB-': ['O-', 'A-', 'B-', 'AB-'],
    'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] // Universal Recipient for RBC
  },
  WholeBlood: {
    'O-': ['O-'],
    'O+': ['O+'],
    'A-': ['A-'],
    'A+': ['A+'],
    'B-': ['B-'],
    'B+': ['B+'],
    'AB-': ['AB-'],
    'AB+': ['AB+']
  },
  FFP: {
    'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal Recipient for Plasma
    'O+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A-', 'A+', 'AB-', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B-', 'B+', 'AB-', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB-', 'AB+'] // AB is Universal Donor for Plasma
  },
  Cryoprecipitate: {
    'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    'O+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A-', 'A+', 'AB-', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B-', 'B+', 'AB-', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB-', 'AB+']
  },
  Platelets: {
    'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    'O+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A-', 'A+', 'AB-', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B-', 'B+', 'AB-', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB-', 'AB+']
  }
};

export const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'fac-metro',
    name: 'Metro General Hospital',
    type: 'hospital',
    traumaLevel: 'Level 1',
    address: '742 Healthcare Boulevard, Sector 4',
    city: 'Metro City',
    coordinates: { x: 38, y: 44, lat: 37.7749, lng: -122.4194 },
    verified: true,
    bedCount: 850,
    phone: '+1 (555) 911-4000',
    contactPerson: 'Dr. Evelyn Hayes (Blood Bank Chief)',
    availableStockSummary: {
      'O-': 4,
      'O+': 18,
      'A-': 6,
      'A+': 32,
      'B-': 5,
      'B+': 24,
      'AB-': 3,
      'AB+': 15
    },
    distanceFromActiveFacility: 0,
    etaMinutes: 0
  },
  {
    id: 'fac-central-bank',
    name: 'City Central Blood Center',
    type: 'blood_bank',
    address: '100 Red Cross Way, West Park',
    city: 'Metro City',
    coordinates: { x: 62, y: 32, lat: 37.7850, lng: -122.4050 },
    verified: true,
    phone: '+1 (555) 833-2566',
    contactPerson: 'Marcus Vance (Regional Dispatch Director)',
    availableStockSummary: {
      'O-': 28,
      'O+': 95,
      'A-': 34,
      'A+': 140,
      'B-': 22,
      'B+': 88,
      'AB-': 16,
      'AB+': 45
    },
    distanceFromActiveFacility: 6.4,
    etaMinutes: 14
  },
  {
    id: 'fac-stjude',
    name: 'St. Jude Memorial Hospital',
    type: 'hospital',
    traumaLevel: 'Level 2',
    address: '1200 North Avenue, Uptown',
    city: 'Metro City',
    coordinates: { x: 22, y: 24, lat: 37.7950, lng: -122.4350 },
    verified: true,
    bedCount: 420,
    phone: '+1 (555) 344-8800',
    contactPerson: 'Nurse Director Sarah Lin',
    availableStockSummary: {
      'O-': 2,
      'O+': 12,
      'A-': 3,
      'A+': 20,
      'B-': 4,
      'B+': 16,
      'AB-': 2,
      'AB+': 8
    },
    distanceFromActiveFacility: 8.8,
    etaMinutes: 19
  },
  {
    id: 'fac-apex',
    name: 'Apex Trauma & Orthopaedic Care',
    type: 'trauma_center',
    traumaLevel: 'Level 1',
    address: '400 Expressway Corridor South',
    city: 'Metro City',
    coordinates: { x: 74, y: 72, lat: 37.7550, lng: -122.3900 },
    verified: true,
    bedCount: 310,
    phone: '+1 (555) 777-1299',
    contactPerson: 'Dr. Ronald Sterling (Chief of Trauma Resuscitation)',
    availableStockSummary: {
      'O-': 6,
      'O+': 22,
      'A-': 4,
      'A+': 18,
      'B-': 3,
      'B+': 14,
      'AB-': 1,
      'AB+': 6
    },
    distanceFromActiveFacility: 11.2,
    etaMinutes: 22
  },
  {
    id: 'fac-regional-authority',
    name: 'State Health Command & Regional Reserve',
    type: 'health_network',
    address: '1 Government Center Plaza',
    city: 'State Capital Hub',
    coordinates: { x: 50, y: 88, lat: 37.7450, lng: -122.4200 },
    verified: true,
    phone: '+1 (555) 444-0100',
    contactPerson: 'Commissioner David Thorne',
    availableStockSummary: {
      'O-': 50,
      'O+': 180,
      'A-': 60,
      'A+': 250,
      'B-': 40,
      'B+': 160,
      'AB-': 25,
      'AB+': 80
    },
    distanceFromActiveFacility: 18.5,
    etaMinutes: 35
  }
];

// Generate 60 realistic inventory units for Metro General & other facilities
export const INITIAL_INVENTORY: BloodUnit[] = [
  // O- units (Critical)
  {
    id: 'unit-101',
    batchNumber: 'BT-2026-0814-01',
    donorCode: 'DN-99412',
    bloodGroup: 'O-',
    component: 'PRBC',
    volumeMl: 350,
    collectionDate: '2026-08-05',
    expiryDate: '2026-09-16',
    daysToExpiry: 15,
    status: 'usable',
    facilityId: 'fac-metro',
    storageUnit: 'Cold Vault 1 - Tray A1',
    temperatureC: 4.1,
    testedViralMarkers: true,
    leukoreduced: true,
    irradiated: false
  },
  {
    id: 'unit-102',
    batchNumber: 'BT-2026-0814-02',
    donorCode: 'DN-99419',
    bloodGroup: 'O-',
    component: 'PRBC',
    volumeMl: 350,
    collectionDate: '2026-08-08',
    expiryDate: '2026-09-19',
    daysToExpiry: 18,
    status: 'usable',
    facilityId: 'fac-metro',
    storageUnit: 'Cold Vault 1 - Tray A2',
    temperatureC: 3.9,
    testedViralMarkers: true,
    leukoreduced: true,
    irradiated: true
  },
  {
    id: 'unit-103',
    batchNumber: 'BT-2026-0810-09',
    donorCode: 'DN-88310',
    bloodGroup: 'O-',
    component: 'PRBC',
    volumeMl: 350,
    collectionDate: '2026-07-28',
    expiryDate: '2026-09-08',
    daysToExpiry: 7,
    status: 'reserved',
    facilityId: 'fac-metro',
    storageUnit: 'Cold Vault 1 - Tray A3 (Reserved)',
    temperatureC: 4.0,
    testedViralMarkers: true,
    leukoreduced: true,
    irradiated: false,
    reservedForPatientId: 'PT-TRAUMA-991'
  },
  {
    id: 'unit-104',
    batchNumber: 'BT-2026-0801-14',
    donorCode: 'DN-77401',
    bloodGroup: 'O-',
    component: 'Platelets',
    volumeMl: 250,
    collectionDate: '2026-08-28',
    expiryDate: '2026-09-02',
    daysToExpiry: 1, // Expiring very soon!
    status: 'usable',
    facilityId: 'fac-metro',
    storageUnit: 'Agitator Chamber Alpha',
    temperatureC: 22.2,
    testedViralMarkers: true,
    leukoreduced: true,
    irradiated: true
  },
  // O+ units
  {
    id: 'unit-105',
    batchNumber: 'BT-2026-0820-22',
    donorCode: 'DN-10293',
    bloodGroup: 'O+',
    component: 'PRBC',
    volumeMl: 350,
    collectionDate: '2026-08-15',
    expiryDate: '2026-09-26',
    daysToExpiry: 25,
    status: 'usable',
    facilityId: 'fac-metro',
    storageUnit: 'Cold Vault 2 - Tray B1',
    temperatureC: 3.8,
    testedViralMarkers: true,
    leukoreduced: true,
    irradiated: false
  },
  {
    id: 'unit-106',
    batchNumber: 'BT-2026-0820-23',
    donorCode: 'DN-10294',
    bloodGroup: 'O+',
    component: 'PRBC',
    volumeMl: 350,
    collectionDate: '2026-08-15',
    expiryDate: '2026-09-26',
    daysToExpiry: 25,
    status: 'usable',
    facilityId: 'fac-metro',
    storageUnit: 'Cold Vault 2 - Tray B2',
    temperatureC: 3.9,
    testedViralMarkers: true,
    leukoreduced: true,
    irradiated: false
  },
  {
    id: 'unit-107',
    batchNumber: 'BT-2026-0818-19',
    donorCode: 'DN-66190',
    bloodGroup: 'O+',
    component: 'FFP',
    volumeMl: 200,
    collectionDate: '2026-05-12',
    expiryDate: '2027-05-12',
    daysToExpiry: 253,
    status: 'usable',
    facilityId: 'fac-metro',
    storageUnit: 'Deep Freeze -20C (Locker 4)',
    temperatureC: -21.4,
    testedViralMarkers: true,
    leukoreduced: true,
    irradiated: false
  },
  // Platelets with short shelf-life
  {
    id: 'unit-108',
    batchNumber: 'BT-2026-0830-01',
    donorCode: 'DN-55102',
    bloodGroup: 'AB-',
    component: 'Platelets',
    volumeMl: 280,
    collectionDate: '2026-08-30',
    expiryDate: '2026-09-04',
    daysToExpiry: 3,
    status: 'usable',
    facilityId: 'fac-metro',
    storageUnit: 'Agitator Chamber Alpha',
    temperatureC: 22.0,
    testedViralMarkers: true,
    leukoreduced: true,
    irradiated: true
  },
  {
    id: 'unit-109',
    batchNumber: 'BT-2026-0829-05',
    donorCode: 'DN-44910',
    bloodGroup: 'A+',
    component: 'Platelets',
    volumeMl: 270,
    collectionDate: '2026-08-29',
    expiryDate: '2026-09-03',
    daysToExpiry: 2,
    status: 'usable',
    facilityId: 'fac-metro',
    storageUnit: 'Agitator Chamber Beta',
    temperatureC: 21.8,
    testedViralMarkers: true,
    leukoreduced: true,
    irradiated: false
  },
  // Quarantined testing batch
  {
    id: 'unit-110',
    batchNumber: 'BT-2026-0831-99',
    donorCode: 'DN-33821',
    bloodGroup: 'B+',
    component: 'PRBC',
    volumeMl: 350,
    collectionDate: '2026-08-31',
    expiryDate: '2026-10-12',
    daysToExpiry: 41,
    status: 'quarantined',
    facilityId: 'fac-metro',
    storageUnit: 'Quarantine Holding Bay Q2',
    temperatureC: 4.2,
    testedViralMarkers: false, // In NAT/ELISA viral testing
    leukoreduced: true,
    irradiated: false
  },
  // FFP & Cryo units
  {
    id: 'unit-111',
    batchNumber: 'BT-2026-0601-44',
    donorCode: 'DN-88120',
    bloodGroup: 'A+',
    component: 'FFP',
    volumeMl: 200,
    collectionDate: '2026-06-01',
    expiryDate: '2027-06-01',
    daysToExpiry: 273,
    status: 'usable',
    facilityId: 'fac-metro',
    storageUnit: 'Deep Freeze -20C (Locker 1)',
    temperatureC: -22.1,
    testedViralMarkers: true,
    leukoreduced: true,
    irradiated: false
  },
  {
    id: 'unit-112',
    batchNumber: 'BT-2026-0610-88',
    donorCode: 'DN-88199',
    bloodGroup: 'A+',
    component: 'Cryoprecipitate',
    volumeMl: 50,
    collectionDate: '2026-06-10',
    expiryDate: '2027-06-10',
    daysToExpiry: 282,
    status: 'usable',
    facilityId: 'fac-metro',
    storageUnit: 'Deep Freeze -20C (Locker 2)',
    temperatureC: -20.8,
    testedViralMarkers: true,
    leukoreduced: true,
    irradiated: false
  }
];

export const SCHEDULED_SURGERIES: ScheduledSurgery[] = [
  {
    id: 'surg-01',
    patientId: 'PT-CARD-8841',
    procedure: 'Emergency Coronary Artery Bypass Graft (CABG)',
    department: 'Cardiothoracic Surgery',
    scheduledDate: '2026-09-02 (Tomorrow 08:30)',
    requiredBloodGroup: 'O+',
    requiredComponent: 'PRBC',
    unitsReserved: 4,
    surgeon: 'Dr. Aris Thorne',
    riskLevel: 'High Blood Loss'
  },
  {
    id: 'surg-02',
    patientId: 'PT-TRAUMA-991',
    procedure: 'Pelvic Fixation & Hepatic Laceration Repair',
    department: 'Orthopaedic & Trauma Surgery',
    scheduledDate: '2026-09-02 (Tomorrow 11:00)',
    requiredBloodGroup: 'O-',
    requiredComponent: 'PRBC',
    unitsReserved: 3,
    surgeon: 'Dr. Rebecca Shaw',
    riskLevel: 'High Blood Loss'
  },
  {
    id: 'surg-03',
    patientId: 'PT-ONC-3312',
    procedure: 'Autologous Stem Cell Infusion & Platelet Support',
    department: 'Hematology & Oncology',
    scheduledDate: '2026-09-03',
    requiredBloodGroup: 'AB-',
    requiredComponent: 'Platelets',
    unitsReserved: 2,
    surgeon: 'Dr. Lisa Chang',
    riskLevel: 'Moderate'
  },
  {
    id: 'surg-04',
    patientId: 'PT-VASC-2290',
    procedure: 'Abdominal Aortic Aneurysm (AAA) Endovascular Repair',
    department: 'Vascular Surgery',
    scheduledDate: '2026-09-04',
    requiredBloodGroup: 'A+',
    requiredComponent: 'PRBC',
    unitsReserved: 4,
    surgeon: 'Dr. Marcus Webb',
    riskLevel: 'High Blood Loss'
  }
];

export const ACCIDENT_HOTSPOTS: AccidentHotspot[] = [
  {
    id: 'spot-101',
    name: 'Highway 101 / Mile 42 Interchange',
    corridor: 'North Interstate Expressway Junction',
    coordinates: { x: 72, y: 28, lat: 37.7910, lng: -122.4010 },
    riskLevel: 'CRITICAL_HIGH',
    peakDays: ['Friday', 'Saturday', 'Holiday Eves'],
    peakHours: '21:00 — 04:00 (Night Rush)',
    historicalTraumaMonthly: 28,
    primaryInjuries: 'High-velocity blunt trauma, polytrauma, massive internal bleeding',
    recommendedPreStock: {
      'O- PRBC': 8,
      'O+ PRBC': 12,
      'Platelets': 4,
      'FFP': 6
    },
    primaryReceivingHospitalId: 'fac-metro',
    primaryReceivingHospitalName: 'Metro General Hospital (Level 1 Trauma)'
  },
  {
    id: 'spot-102',
    name: 'Downtown Commercial & Transit Nexus',
    corridor: 'Grand Avenue & Market Boulevard',
    coordinates: { x: 42, y: 48, lat: 37.7790, lng: -122.4180 },
    riskLevel: 'ELEVATED',
    peakDays: ['Thursday', 'Friday', 'Saturday'],
    peakHours: '19:00 — 02:00',
    historicalTraumaMonthly: 16,
    primaryInjuries: 'Pedestrian collisions, penetrating trauma, orthopedic fractures',
    recommendedPreStock: {
      'O- PRBC': 4,
      'A+ PRBC': 6,
      'Platelets': 3
    },
    primaryReceivingHospitalId: 'fac-apex',
    primaryReceivingHospitalName: 'Apex Trauma & Orthopaedic Care'
  },
  {
    id: 'spot-103',
    name: 'South Ring Road & Industrial Freight Tollway',
    corridor: 'State Route 84 Freight Corridor',
    coordinates: { x: 78, y: 76, lat: 37.7520, lng: -122.3850 },
    riskLevel: 'ELEVATED',
    peakDays: ['Monday', 'Wednesday', 'Friday'],
    peakHours: '04:30 — 08:30 (Heavy Fog Morning Commute)',
    historicalTraumaMonthly: 12,
    primaryInjuries: 'Heavy vehicle crushing injuries, severe chest trauma',
    recommendedPreStock: {
      'O- PRBC': 6,
      'B+ PRBC': 6,
      'FFP': 4
    },
    primaryReceivingHospitalId: 'fac-apex',
    primaryReceivingHospitalName: 'Apex Trauma & Orthopaedic Care'
  },
  {
    id: 'spot-104',
    name: 'Uptown Valley Bridge & Overpass',
    corridor: 'Northern Ridge Parkway',
    coordinates: { x: 25, y: 18, lat: 37.8020, lng: -122.4410 },
    riskLevel: 'MODERATE',
    peakDays: ['Saturday', 'Sunday'],
    peakHours: '14:00 — 20:00',
    historicalTraumaMonthly: 8,
    primaryInjuries: 'Motorcycle trauma, spinal injuries',
    recommendedPreStock: {
      'O- PRBC': 3,
      'O+ PRBC': 5
    },
    primaryReceivingHospitalId: 'fac-stjude',
    primaryReceivingHospitalName: 'St. Jude Memorial Hospital'
  }
];

export const INITIAL_ORDERS: BloodOrder[] = [
  {
    id: 'ord-901',
    orderNumber: 'ORD-2026-W35-01',
    facilityId: 'fac-metro',
    facilityName: 'Metro General Hospital',
    supplierFacilityId: 'fac-central-bank',
    supplierFacilityName: 'City Central Blood Center',
    orderingMode: 'ai_draft',
    items: [
      { id: 'item-1', bloodGroup: 'O-', component: 'PRBC', units: 8, unitPrice: 210, totalCost: 1680, urgency: 'CRITICAL', rationale: 'Compensating for 2 weekend trauma arrivals and universal ER reserve' },
      { id: 'item-2', bloodGroup: 'O+', component: 'PRBC', units: 14, unitPrice: 190, totalCost: 2660, urgency: 'HIGH', rationale: 'Replenishing stock for 4 scheduled cardiac and vascular surgeries' },
      { id: 'item-3', bloodGroup: 'A+', component: 'Platelets', units: 6, unitPrice: 240, totalCost: 1440, urgency: 'HIGH', rationale: 'Platelet 5-day expiry replenishment rotation' },
      { id: 'item-4', bloodGroup: 'B+', component: 'FFP', units: 5, unitPrice: 150, totalCost: 750, urgency: 'NORMAL', rationale: 'Baseline coagulopathy buffer' }
    ],
    totalUnits: 33,
    totalCost: 6530,
    status: 'pending_approval',
    autoApproved: false,
    aiRationale: 'AI-calculated 7-day deficit based on surgical reservations and Highway 101 weekend trauma forecast.',
    complianceFlags: ['Within Standard Hospital Budget ($10,000 max)', 'Approved Tier-1 Blood Bank'],
    createdAt: '2026-09-01T07:30:00Z'
  },
  {
    id: 'ord-899',
    orderNumber: 'ORD-2026-W34-08',
    facilityId: 'fac-metro',
    facilityName: 'Metro General Hospital',
    supplierFacilityId: 'fac-central-bank',
    supplierFacilityName: 'City Central Blood Center',
    orderingMode: 'controlled_auto',
    items: [
      { id: 'item-81', bloodGroup: 'A+', component: 'PRBC', units: 10, unitPrice: 190, totalCost: 1900, urgency: 'NORMAL', rationale: 'Routine weekly replenishment' },
      { id: 'item-82', bloodGroup: 'O+', component: 'FFP', units: 8, unitPrice: 150, totalCost: 1200, urgency: 'NORMAL', rationale: 'Deep freezer rotation' }
    ],
    totalUnits: 18,
    totalCost: 3100,
    status: 'delivered',
    autoApproved: true,
    aiRationale: 'Controlled autonomous order triggered when A+ PRBC fell below 40% safety threshold. Automatically verified against $10,000 monthly ceiling.',
    humanApprover: 'System Autonomous Trigger (Rule #CO-402)',
    complianceFlags: ['Autonomous Policy Certified', 'Verified Cold Chain Receipt'],
    createdAt: '2026-08-25T10:00:00Z',
    deliveredAt: '2026-08-25T14:40:00Z'
  }
];

export const INITIAL_EMERGENCY_REQUESTS: EmergencyRequest[] = [
  {
    id: 'emg-701',
    requesterFacilityId: 'fac-metro',
    requesterFacilityName: 'Metro General Hospital',
    targetBloodGroup: 'O-',
    targetComponent: 'PRBC',
    unitsRequested: 4,
    unitsAllocated: 4,
    urgency: 'CRITICAL_STAT',
    patientDiagnosis: 'Massive internal hemorrhage from multi-vehicle highway collision (Resuscitation Bay 1)',
    patientRoom: 'Trauma Bay 1 (Level 1 Resuscitation)',
    status: 'in_transit',
    temperatureTarget: { min: 2.0, max: 6.0 },
    currentTransitTemp: 3.9,
    createdAt: '2026-09-01T08:15:00Z',
    estimatedArrivalMins: 9,
    courierVehicle: 'Rapid Response Bio-Courier #402 (Green Light Corridor Enabled)',
    handoverCode: 'BR-88392',
    matchedFacilities: [
      {
        facilityId: 'fac-central-bank',
        facilityName: 'City Central Blood Center',
        distanceKm: 6.4,
        etaMins: 14,
        availableUnits: 28,
        status: 'accepted_full',
        unitsOffered: 4,
        respondedAt: '2026-09-01T08:16:30Z'
      },
      {
        facilityId: 'fac-apex',
        facilityName: 'Apex Trauma & Orthopaedic Care',
        distanceKm: 11.2,
        etaMins: 22,
        availableUnits: 6,
        status: 'rejected',
        rejectReason: 'Units actively reserved for ongoing pelvic repair surgery',
        respondedAt: '2026-09-01T08:17:00Z'
      }
    ],
    dispatchLog: [
      {
        timestamp: '08:15:10',
        stage: 'Request Broadcasted',
        description: 'STAT Emergency broadcast sent to verified facilities within 20km radius.',
        temperatureC: 4.0,
        courierLocation: 'Metro General ER Dispatch Console',
        completed: true
      },
      {
        timestamp: '08:16:30',
        stage: 'Accepted by City Central Blood Center',
        description: 'City Central Blood Bank reserved 4 units of O- PRBC with barcode lock.',
        temperatureC: 4.1,
        courierLocation: 'City Central Blood Bank - Vault 3',
        completed: true
      },
      {
        timestamp: '08:19:00',
        stage: 'Cold-Chain Secure Packed',
        description: 'Insulated pneumatic temperature-logged container packed (Logged 3.8°C).',
        temperatureC: 3.8,
        courierLocation: 'City Central Dispatch Dock',
        completed: true
      },
      {
        timestamp: '08:22:15',
        stage: 'Rapid Transit En-Route',
        description: 'Bio-Courier #402 moving via Expressway 4. GPS tracking active.',
        temperatureC: 3.9,
        courierLocation: 'Highway 101 Southbound (Approaching Exit 18)',
        completed: true
      },
      {
        timestamp: 'Pending (ETA 08:31)',
        stage: 'Hospital Receiving Dock Handover',
        description: 'Verification PIN required at Metro General Trauma Dock.',
        temperatureC: 4.0,
        courierLocation: 'Metro General ER Arrival Bay',
        completed: false
      }
    ]
  }
];

export const INITIAL_FORECASTS: ForecastItem[] = [
  {
    bloodGroup: 'O-',
    component: 'PRBC',
    currentUsableStock: 4,
    predictedDemand7Days: 14,
    shortageEtaDays: 2.5,
    recommendedOrderUnits: 12,
    safetyStockTarget: 6,
    riskLevel: 'CRITICAL',
    reasoning: 'Stock is currently 4 units (below 6-unit emergency threshold). Slated pelvic reconstruction surgery requires 3 reserved units and Highway 101 weekend trauma surge has a 92% historical probability of requiring 4+ units.'
  },
  {
    bloodGroup: 'O+',
    component: 'PRBC',
    currentUsableStock: 8,
    predictedDemand7Days: 20,
    shortageEtaDays: 4.8,
    recommendedOrderUnits: 17,
    safetyStockTarget: 8,
    riskLevel: 'HIGH',
    reasoning: 'Hospital A may face an O-positive shortage within five days. Current usable stock is 8 units, predicted demand is 20 units and recommended order is 17 units, including safety stock.'
  },
  {
    bloodGroup: 'A+',
    component: 'Platelets',
    currentUsableStock: 3,
    predictedDemand7Days: 7,
    shortageEtaDays: 3.0,
    recommendedOrderUnits: 6,
    safetyStockTarget: 4,
    riskLevel: 'HIGH',
    reasoning: 'Platelet 5-day shelf life constraint requires rolling daily replenishment. 2 units are currently within 48h of expiration.'
  },
  {
    bloodGroup: 'B+',
    component: 'FFP',
    currentUsableStock: 12,
    predictedDemand7Days: 8,
    shortageEtaDays: null,
    recommendedOrderUnits: 4,
    safetyStockTarget: 6,
    riskLevel: 'OPTIMAL',
    reasoning: 'Sub-zero frozen plasma stock is healthy with 1-year shelf life. Modest replenishment suggested to maintain optimal coagulopathy emergency buffer.'
  },
  {
    bloodGroup: 'AB-',
    component: 'Platelets',
    currentUsableStock: 1,
    predictedDemand7Days: 3,
    shortageEtaDays: 1.8,
    recommendedOrderUnits: 3,
    safetyStockTarget: 2,
    riskLevel: 'CRITICAL',
    reasoning: 'Rare blood group with scheduled oncological stem cell infusion on September 3 requiring 2 units.'
  }
];

export const DEFAULT_AUTO_RULES: AutoOrderRules = {
  enabled: true,
  maxBudgetMonthly: 10000,
  currentMonthlySpent: 3100,
  maxUnitsPerOrder: 25,
  requiresApprovalIfUnitsExceed: 30,
  approvedSupplierIds: ['fac-central-bank', 'fac-stjude'],
  autoTriggerSafetyStockPercent: 35
};

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-001',
    timestamp: '2026-09-01T08:15:10Z',
    actorName: 'Dr. Evelyn Hayes',
    actorRole: 'Emergency Blood Director',
    action: 'STAT_EMERGENCY_BROADCAST',
    facilityId: 'fac-metro',
    details: 'STAT request for 4 units O- PRBC broadcasted for Trauma Bay 1. Proximity matching radius set to 25km.',
    complianceSeal: 'SEAL-883921'
  },
  {
    id: 'log-002',
    timestamp: '2026-09-01T08:16:30Z',
    actorName: 'Marcus Vance',
    actorRole: 'Blood Bank Dispatcher',
    action: 'EMERGENCY_UNITS_RESERVED',
    facilityId: 'fac-central-bank',
    details: 'Reserved 4 units of O- PRBC (Batches: BT-092, BT-093). Cold-chain transit initialized at 3.9°C.',
    complianceSeal: 'SEAL-491024'
  },
  {
    id: 'log-003',
    timestamp: '2026-09-01T07:30:00Z',
    actorName: 'BloodRUSH AI Engine',
    actorRole: 'Neural Inventory Forecast Engine',
    action: 'AI_ORDER_DRAFTED',
    facilityId: 'fac-metro',
    details: 'Weekly order draft ORD-2026-W35-01 prepared. 33 units total ($6,530.00). Awaiting inventory director sign-off.',
    complianceSeal: 'SEAL-902183'
  },
  {
    id: 'log-004',
    timestamp: '2026-08-31T16:20:00Z',
    actorName: 'System Telemetry Monitor',
    actorRole: 'IoT Cold-Chain Validator',
    action: 'COLD_CHAIN_TEMP_VERIFIED',
    facilityId: 'fac-metro',
    details: 'Cold Vault 1 steady at 3.9°C (Tolerance 2.0°C - 6.0°C). Platelet agitators operating at 60 RPM.',
    complianceSeal: 'SEAL-110934'
  },
  {
    id: 'log-005',
    timestamp: '2026-08-30T09:12:00Z',
    actorName: 'Nurse Director Sarah Lin',
    actorRole: 'Senior Transfusion Officer',
    action: 'UNIT_RESERVED',
    facilityId: 'fac-stjude',
    details: '2 units of AB- Platelets reserved for Hematology Infusion Ward (Patient PT-ONC-3312).',
    complianceSeal: 'SEAL-774920'
  }
];
