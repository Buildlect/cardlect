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
    id: "usr_super_001",
    name: "Buildlect Technologies Ltd",
    email: "controlroom@model.cardlect.com",
    role: "super_admin",
    schoolId: "sch_001",
    schoolName: "Cardlect Model School",
    password: "password123",
  },
  {
    id: "usr_admin_001",
    name: "James Administrator",
    email: "admin@model.cardlect.com",
    role: "school_admin",
    schoolId: "sch_001",
    schoolName: "Cardlect Model School",
    password: "password123",
  },
  {
    id: "usr_staff_001",
    name: "Linda Teacher",
    email: "linda.teacher@model.cardlect.com",
    role: "staff",
    customRole: "exam_officer",
    schoolId: "sch_001",
    schoolName: "Cardlect Model School",
    password: "password123",
  },
  {
    id: "usr_parent_001",
    name: "Robert Parent",
    email: "robert.parent@model.cardlect.com",
    role: "parent",
    schoolId: "sch_001",
    schoolName: "Cardlect Model School",
    password: "password123",
  },
  {
    id: "usr_student_001",
    name: "Sarah Student",
    email: "sarah.student@model.cardlect.com",
    role: "student",
    schoolId: "sch_001",
    schoolName: "Cardlect Model School",
    password: "password123",
  },
  {
    id: "usr_partner_001",
    name: "The Mall Hub",
    email: "info@mall.model.cardlect.com",
    role: "partner",
    schoolId: "sch_001",
    schoolName: "Cardlect Partners",
    password: "password123",
  },
  {
    id: "usr_visitor_001",
    name: "John Visitor",
    email: "john.visitor@model.cardlect.com",
    role: "visitor",
    schoolId: "sch_001",
    schoolName: "Cardlect Model School",
    password: "password123",
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
