export type UserRole =
  | 'super_admin'
  | 'school_admin'
  | 'staff'
  | 'parent'
  | 'student'
  | 'visitor'
  | 'partner'

export interface MockUser {
  id: string
  name: string
  email: string
  role: UserRole
  customRole?: string
  schoolId?: string
  schoolName?: string
  password: string // For demo only
  allowedPages?: string[]
}

export const MOCK_USERS: MockUser[] = [
  {
    id: "su-001",
    name: "Buildlect Technologies Ltd",
    email: "controlroom@model.cardlect.com",
    role: "super_admin",
    schoolId: "sch_model_001",
    schoolName: "Cardlect HQ",
    password: "password",
  },
  {
    id: "admin-001",
    name: "School Administrator",
    email: "admin@model.cardlect.com",
    role: "school_admin",
    schoolId: "sch_model_001",
    schoolName: "Cardlect Model School",
    password: "password",
  },
  {
    id: "teacher-001",
    name: "Jane Smith",
    email: "teacher@model.cardlect.com",
    role: "staff",
    customRole: "teacher",
    schoolId: "sch_model_001",
    schoolName: "Cardlect Model School",
    password: "password",
  },
  {
    id: "finance-001",
    name: "Finance Officer",
    email: "finance@model.cardlect.com",
    role: "staff",
    customRole: "finance",
    schoolId: "sch_model_001",
    schoolName: "Cardlect Model School",
    password: "password",
  },
  {
    id: "security-001",
    name: "Security Head",
    email: "security@model.cardlect.com",
    role: "staff",
    customRole: "security",
    schoolId: "sch_model_001",
    schoolName: "Cardlect Model School",
    password: "password",
  },
  {
    id: "exam-001",
    name: "Exam Officer",
    email: "exams@model.cardlect.com",
    role: "staff",
    customRole: "exam_officer",
    schoolId: "sch_model_001",
    schoolName: "Cardlect Model School",
    password: "password",
  },
  {
    id: "parent-001",
    name: "John Doe",
    email: "parent@model.cardlect.com",
    role: "parent",
    schoolId: "sch_model_001",
    schoolName: "Cardlect Model School",
    password: "password",
  },
  {
    id: "student-001",
    name: "Jimmy Doe",
    email: "student@model.cardlect.com",
    role: "student",
    schoolId: "sch_model_001",
    schoolName: "Cardlect Model School",
    password: "password",
  },
  {
    id: "partner-001",
    name: "Central Store",
    email: "partner@model.cardlect.com",
    role: "partner",
    schoolId: "sch_model_001",
    schoolName: "Cardlect Partners",
    password: "password",
  },
  {
    id: "visitor-001",
    name: "Guest User",
    email: "visitor@model.cardlect.com",
    role: "visitor",
    schoolId: "sch_model_001",
    schoolName: "Cardlect Model School",
    password: "password",
  },
]

export const getDashboardRoute = (role: UserRole): string => {
  if (role === 'visitor') return '/'
  return "/dashboard/overview"
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