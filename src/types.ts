export type UserRole = 'parent' | 'worker' | 'supervisor';

export type SidebarSection = 
  | 'home'
  | 'children'
  | 'health'
  | 'attendance'
  | 'consultation'
  | 'vaccination'
  | 'nutrition'
  | 'stocks'
  | 'alerts'
  | 'reports'
  | 'profile';

export type HealthSubSection = 'overview' | 'bmi' | 'deficiency' | 'disability';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  designation: string;
  centerId?: string;
  centerName?: string;
  childId?: string;
  mobile?: string;
  avatarIcon: string;
  username: string;
  password?: string;
}

export interface GrowthRecord {
  id?: string;
  date?: string;
  month: string;
  ageInMonths: number;
  heightCm: number;
  weightKg: number;
  bmi: number;
  whoCategory: 'Normal' | 'Underweight' | 'Severely Underweight' | 'Overweight';
  zScoreRange?: string;
  recordedBy: string;
  notes?: string;
}

export interface VaccineRecord {
  id: string;
  name: string;
  dose: string; // e.g. "Birth Dose", "Dose 1", "Booster 1"
  diseaseTarget?: string;
  protectsAgainst?: string;
  dueAge?: string;
  recommendedAge?: string;
  status: 'Completed' | 'Upcoming' | 'Due soon' | 'Overdue' | 'Due';
  administeredDate?: string;
  dateGiven?: string;
  administeredBy?: string;
  batchNumber?: string;
  dueDate: string;
  vaccinationCenter: string;
  importantNote?: string;
  notes?: string;
}

export interface DeficiencyRecord {
  id: string;
  type:
    | 'Iron Deficiency (Anemia)'
    | 'Vitamin A Deficiency'
    | 'Protein Energy Malnutrition (PEM)'
    | 'Zinc Deficiency'
    | 'Iodine Deficiency'
    | 'Vitamin D'
    | 'Vitamin D Deficiency';
  date?: string;
  diagnosisDate?: string;
  diagnosedDate?: string;
  doctorOrProfessional?: string;
  observations?: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  recommendedAction?: string;
  supplementsPrescribed?: string;
  prescribedSupplement?: string;
  dosage?: string;
  followUpDate?: string;
  status: 'Active' | 'Improving' | 'Resolved';
  notes?: string;
}

export interface DisabilityRecord {
  id: string;
  hasDisability: boolean;
  type:
    | 'None'
    | 'Locomotor'
    | 'Hearing Impairment'
    | 'Visual Impairment'
    | 'Speech & Language'
    | 'Speech & Hearing'
    | 'Intellectual / Developmental'
    | 'Intellectual'
    | 'Visual'
    | 'Multiple'
    | 'Multiple Disabilities';
  assessmentDiagnosisInfo?: string;
  severitySupportRequirement?: string;
  severity?: 'Mild' | 'Moderate' | 'Severe' | string;
  percentageOrSeverity?: string;
  requiredAssistance?: string;
  followUpDate?: string;
  udidNumber?: string;
  assistiveDeviceProvided?: string;
  assistiveDeviceRequired?: string;
  specialSupportNotes?: string;
  notes?: string;
}

export interface ConsultationRecord {
  id: string;
  date: string;
  doctorName: string;
  clinic: string;
  reason: string;
  observations: string;
  recommendation: string;
  followUpDate: string;
  status: 'Scheduled' | 'Completed' | 'Follow-up Required';
  notes?: string;
}

export interface HealthAlert {
  id: string;
  severity: 'High' | 'Medium' | 'Low';
  title: string;
  message: string;
  actionRequired: string;
  date: string;
}

export interface MealItem {
  id: string;
  time: string;
  mealName?: string;
  name?: string;
  mealType?: string;
  description: string;
  caloriesKcal?: number;
  calories?: number | string;
  proteinGrams?: number;
  protein?: number | string;
  nutrientsHighlighted?: string[];
  status?: 'Served' | 'In Preparation' | 'Scheduled';
  iconType?: 'morning' | 'lunch' | 'snack';
}

export interface MedicationDosageLog {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  timing: string;
  prescribedBy: string;
  instructions: string;
  recordedByHelper: string;
  statusToday: 'Administered' | 'Pending' | 'Not Required';
  timeAdministeredToday?: string;
}

export interface AttendanceDay {
  date: string; // YYYY-MM-DD
  day: number;
  dayNumber?: number;
  status: 'present' | 'absent' | 'holiday' | 'weekend' | 'Present' | 'Absent' | string;
  notes?: string;
}

export interface Child {
  id: string;
  name: string;
  age: string;
  ageMonths: number;
  gender: 'Male' | 'Female' | 'Other';
  dob: string; // YYYY-MM-DD
  bloodGroup: string;

  // Parents & Contact
  fatherName: string;
  motherName: string;
  guardianName: string;
  contactNumber: string;
  parentName: string;
  parentPhone: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };

  // Residential Address
  residentialAddress: string;
  villageTown: string;
  district: string;
  state: string;
  pinCode: string;

  // Anganwadi Information
  centerId: string;
  centerName: string;
  anganwadiLocation: string;
  centerLocation?: string;
  workerName: string;
  supervisorName: string;

  // Additional Information
  enrollmentDate: string;
  aadhaarNumber: string; // Masked for privacy: e.g. "•••• •••• 4819"
  guardianOccupation: string;
  socioeconomicCategory: 'BPL' | 'APL' | 'Antyodaya (AAY)';
  previousHealthHistory: string[];
  allergies: string[];
  medicalNotes: string;
  photoUrl?: string;

  // Current measurements shortcut
  heightCm?: number;
  weightKg?: number;
  bmi?: number;

  // Daily Status Logs
  attendanceToday: 'Present' | 'Absent' | 'Unmarked';
  checkInTime?: string;
  foodIntakeToday: {
    morningSnack: 'Full' | 'Half' | 'None' | 'Pending';
    lunch: 'Full' | 'Half' | 'None' | 'Pending';
    specialDietNotes?: string;
  };
  healthToday: {
    temperatureF: number;
    observations: string;
    hasMedication: boolean;
    medicationAdministered: boolean;
    lastUpdated: string;
  };

  // Clinical & Growth Records
  growthHistory: GrowthRecord[];
  vaccines: VaccineRecord[];
  deficiencies: DeficiencyRecord[];
  disability: DisabilityRecord;
  consultations: ConsultationRecord[];
  doctorConsultation?: {
    doctorName: string;
    clinicOrHospital?: string;
    lastVisitDate?: string;
    date?: string;
    findings?: string;
    advice?: string;
    prescriptionsSummary?: string;
    medications?: string;
    nextConsultation?: string;
  };
  lastCheckup: {
    date: string;
    conductedBy: string;
    findings: string;
    vitalsSummary: string;
  };
  nextCheckupDate: string;
  healthAlerts: HealthAlert[];

  // Existing medication logs
  medicalConditions: string[];
  medications: MedicationDosageLog[];
}

export interface StockItem {
  id: string;
  name: string;
  category: 'Food Grains' | 'Dairy & Nutrition' | 'Medical' | 'Educational Supplies';
  unit: string;
  totalReceived: number;
  currentlyAvailable: number;
  dailyConsumptionRate: number;
  thresholdLowStock: number;
  expiryDate: string;
  lastRestockedDate?: string;
  batchNumber?: string;
  lastUpdated?: string;
  supplier?: string;
}

export interface StockUsageLog {
  id: string;
  stockItemId: string;
  stockItemName: string;
  quantityUsed: number;
  unit: string;
  date: string;
  purpose: string;
  loggedBy: string;
}

export interface StockRequisition {
  id: string;
  centerId: string;
  centerName: string;
  workerName?: string;
  itemName: string;
  quantityRequested: number;
  unit: string;
  urgency: 'Normal' | 'High' | 'Emergency';
  dateRequested: string;
  status: 'Pending' | 'Approved' | 'Dispatched';
  reason: string;
}

export interface AnganwadiCenter {
  id: string;
  code: string;
  name: string;
  villageBlock: string;
  inChargeName: string;
  inChargePhone: string;
  supervisorName?: string;
  totalEnrolledChildren: number;
  presentTodayCount: number;
  attendanceRatePercent: number;
  foodDistributionStatus: 'Completed' | 'In Progress' | 'Pending';
  stockStatus: 'Good' | 'Low' | 'Critical';
  criticalItemsCount: number;
  lastInspectionDate: string;
  malnutritionBreakdown: {
    healthyPercent: number;
    moderatePercent: number;
    severePercent: number;
  };
  deficiencyCasesCount?: number;
  disabilityCasesCount?: number;
  vaccinationCoveragePercent?: number;
}

export interface Announcement {
  id: string;
  title: string;
  type?: string;
  category: 'Health Camp' | 'Holiday' | 'Nutrition Drive' | 'Meeting' | 'Alert';
  date: string;
  time?: string;
  description: string;
  location?: string;
  priority: 'High' | 'Normal';
  targetAudience: 'All' | 'Parents' | 'Workers';
}

export interface NotificationAlert {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  read: boolean;
  roleTarget: UserRole | 'all';
}
