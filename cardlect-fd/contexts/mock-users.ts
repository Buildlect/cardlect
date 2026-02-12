export type UserRole =
  | "super-user"
  | "admin"
  | "finance"
  | "security"
  | "teacher"
  | "parents"
  | "students"
  | "clinic"
  | "store"
  | "approved-stores"
  | "exam-officer"
  | "librarian"
  | "visitor"

export interface MockUser {
  id: string
  name: string
  email: string
  role: UserRole
  schoolId?: string
  schoolName?: string
  password: string // For demo only
  allowedPages?: string[]
}

export const MOCK_USERS: MockUser[] = [
  {
    id: "su-001",
    name: "Super Admin",
    email: "superadmin@cardlect.com",
    role: "super-user",
    schoolId: "sch-001",
    schoolName: "Cardlect Admin",
    password: "password",
    allowedPages: [
      "/dashboard/super-user",
      "/dashboard/super-user-analytics",
      "/dashboard/super-user-api",
      "/dashboard/super-user-approved-stores",
      "/dashboard/super-user-bulk-import",
      "/dashboard/super-user-cards",
      "/dashboard/communication",
      "/dashboard/super-user-exams",
      "/dashboard/super-user-schools",
      "/dashboard/settings",
      "/dashboard/super-user-staff-management",
      "/dashboard/super-user-student-registration",
    ],
  },
  {
    id: "admin-001",
    name: "John Smith",
    email: "admin@school1.com",
    role: "admin",
    schoolId: "sch-001",
    schoolName: "Cambridge Academy",
    password: "password",
    allowedPages: [
      "/dashboard/admin",
      "/dashboard/admin-students",
      "/dashboard/admin-staffs",
      "/dashboard/admin-classes",
      "/dashboard/admin-cards",
      "/dashboard/admin-attendance",
      "/dashboard/admin-gate-logs",
      "/dashboard/admin-wallet",
      "/dashboard/admin-exams",
      "/dashboard/admin-reports",
      "/dashboard/communication",
      "/dashboard/settings",
    ],
  },
  {
    id: "finance-001",
    name: "Finance Manager",
    email: "finance@school1.com",
    role: "finance",
    schoolId: "sch-001",
    schoolName: "Cambridge Academy",
    password: "password",
    allowedPages: [
      "/dashboard/finance",
      "/dashboard/finance-invoices",
      "/dashboard/finance-payments",
      "/dashboard/communication",
      "/dashboard/finance-reports",
      "/dashboard/finance-students",
      "/dashboard/settings",
    ],
  },
  {
    id: "security-001",
    name: "Michael Johnson",
    email: "security@school1.com",
    role: "security",
    schoolId: "sch-001",
    schoolName: "Cambridge Academy",
    password: "password",
    allowedPages: [
      "/dashboard/security",
      "/dashboard/security-pickup-authorization",
      "/dashboard/security-alerts",
      "/dashboard/security-gate-logs",
      "/dashboard/security-visitor-incident-log",
      "/dashboard/communication",
      "/dashboard/settings",
    ],
  },
  {
    id: "teacher-001",
    name: "Sarah Williams",
    email: "teacher@school1.com",
    role: "teacher",
    schoolId: "sch-001",
    schoolName: "Cambridge Academy",
    password: "password",
    allowedPages: [
      "/dashboard/teacher",
      "/dashboard/teacher-exams",
      "/dashboard/teacher-classes",
      "/dashboard/teacher-assignments",
      "/dashboard/communication",
      "/dashboard/teacher-grades",
      "/dashboard/teacher-attendance",
      "/dashboard/settings",
    ],
  },
  {
    id: "exam-001",
    name: "Dr. James Wilson",
    email: "examofficer@school1.com",
    role: "exam-officer",
    schoolId: "sch-001",
    schoolName: "Cambridge Academy",
    password: "password",
    allowedPages: [
      "/dashboard/exam-officer",
      "/dashboard/exam-officer-exams",
      "/dashboard/exam-officer-results",
      "/dashboard/communication",
      "/dashboard/exam-officer-reports",
      "/dashboard/settings",
    ],
  },
  {
    id: "librarian-001",
    name: "Emma Davis",
    email: "librarian@school1.com",
    role: "librarian",
    schoolId: "sch-001",
    schoolName: "Cambridge Academy",
    password: "password",
    allowedPages: [
      "/dashboard/librarian",
      "/dashboard/librarian-books",
      "/dashboard/librarian-borrowals",
      "/dashboard/communication",
      "/dashboard/librarian-students",
      "/dashboard/librarian-reports",
      "/dashboard/settings",
    ],
  },
  {
    id: "clinic-001",
    name: "Dr. Robert Brown",
    email: "clinic@school1.com",
    role: "clinic",
    schoolId: "sch-001",
    schoolName: "Cambridge Academy",
    password: "password",
    allowedPages: [
      "/dashboard/clinic",
      "/dashboard/clinic-students",
      "/dashboard/communication",
      "/dashboard/clinic-medical-records",
      "/dashboard/clinic-visits",
      "/dashboard/clinic-reports",
      "/dashboard/settings",
    ],
  },
  {
    id: "store-001",
    name: "Store Manager",
    email: "store@school1.com",
    role: "store",
    schoolId: "sch-001",
    schoolName: "Cambridge Academy Store",
    password: "password",
    allowedPages: [
      "/dashboard/store",
      "/dashboard/store-inventory",
      "/dashboard/store-sales",
      "/dashboard/communication",
      "/dashboard/store-customers",
      "/dashboard/store-reports",
      "/dashboard/settings",
    ],
  },
  {
    id: "approved-stores-001",
    name: "Vendor Manager",
    email: "vendor@school1.com",
    role: "approved-stores",
    schoolId: "sch-001",
    schoolName: "Approved Partner Store",
    password: "password",
    allowedPages: [
      "/dashboard/approved-stores",
      "/dashboard/approved-stores-stores",
      "/dashboard/communication",
      "/dashboard/approved-stores-orders",
      "/dashboard/approved-stores-sales",
      "/dashboard/settings",
      "/dashboard/approved-stores-partners",
    ],
  },
  {
    id: "parents-001",
    name: "Alice Thompson",
    email: "parent@cardlect.com",
    role: "parents",
    schoolId: "sch-001",
    schoolName: "Cambridge Academy",
    password: "password",
    allowedPages: [
      "/dashboard/parent",
      "/dashboard/parent-exams",
      "/dashboard/parent-children",
      "/dashboard/parent-activity-log",
      "/dashboard/communication",
      "/dashboard/parent-notifications",
      "/dashboard/parent-reports",
      "/dashboard/settings",
    ],
  },
  {
    id: "student-001",
    name: "Sarah Johnson",
    email: "student@school1.com",
    role: "students",
    schoolId: "sch-001",
    schoolName: "Cambridge Academy",
    password: "password",
    allowedPages: [
      "/dashboard/student",
      "/dashboard/student-exams",
      "/dashboard/student-assignments",
      "/dashboard/student-grades",
      "/dashboard/communication",
      "/dashboard/student-schedule",
      "/dashboard/student-study-groups",
      "/dashboard/settings",
    ],
  },
]

export const getDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case "super-user":
      return "/super-user"
    case "admin":
      return "/admin"
    case "finance":
      return "/finance"
    case "security":
      return "/security"
    case "teacher":
      return "/teacher"
    case "exam-officer":
      return "/exam-officer"
    case "librarian":
      return "/librarian"
    case "clinic":
      return "/clinic"
    case "store":
      return "/store"
    case "approved-stores":
      return "/approved-stores"
    case "parents":
      return "/parent"
    case "students":
      return "/student"
    case "visitor":
      return "/"
    default:
      return "/"
  }
}
// Authentication helpers for demo/testing
export function validateCredentials(email: string, password: string): MockUser | null {
  const user = MOCK_USERS.find(u => u.email === email && u.password === password)
  return user || null
}

export function getUserById(id: string): MockUser | null {
  return MOCK_USERS.find(u => u.id === id) || null
}

export function getUserByEmail(email: string): MockUser | null {
  return MOCK_USERS.find(u => u.email === email) || null
}