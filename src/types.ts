export type UserRole = 'parent' | 'worker' | 'supervisor';

export interface GrowthRecord {
  month: string;
  ageInMonths: number;
  heightCm: number;
  weightKg: number;
  bmi: number;
  whoCategory: 'Normal' | 'Underweight' | 'Severely Underweight' | 'Overweight';
  recordedBy: string;
  notes?: string;
}

export interface VaccineRecord {
  id: string;
  name: string;
  diseaseTarget: string;
  dueAge: string;
  status: 'Completed' | 'Due' | 'Upcoming';
  administeredDate?: string;
  administeredBy?: string;
  batchNumber?: string;
  dueDate: string;
  importantNote?: string;
}

export interface MealItem {
  id: string;
  time: string;
  mealName: string;
  description: string;
  caloriesKcal: number;
  proteinGrams: number;
  nutrientsHighlighted: string[];
  status: 'Served' | 'In Preparation' | 'Scheduled';
  iconType: 'morning' | 'lunch' | 'snack';
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
  status: 'present' | 'absent' | 'holiday' | 'weekend';
  notes?: string;
}

export interface Child {
  id: string;
  name: string;
  age: string;
  ageMonths: number;
  gender: 'Male' | 'Female';
  dob: string;
  bloodGroup: string;
  parentName: string;
  parentPhone: string;
  centerId: string;
  centerName: string;
  photoUrl?: string;
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
  growthHistory: GrowthRecord[];
  vaccines: VaccineRecord[];
  allergies: string[];
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
  batchNumber: string;
  lastUpdated: string;
  supplier: string;
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
}

export interface Announcement {
  id: string;
  title: string;
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
