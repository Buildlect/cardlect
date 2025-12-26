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
  },
  {
    id: "admin-001",
    name: "John Smith",
    email: "admin@school1.com",
    role: "admin",
    schoolId: "sch-001",
    schoolName: "Cambridge Academy",
    password: "password",
  },
  {
    id: "finance-001",
    name: "Finance Manager",
    email: "finance@school1.com",
    role: "finance",
    schoolId: "sch-001",
    schoolName: "Cambridge Academy",
    password: "password",
  },
  {
    id: "security-001",
    name: "Michael Johnson",
    email: "security@school1.com",
    role: "security",
    schoolId: "sch-001",
    schoolName: "Cambridge Academy",
    password: "password",
  },
  {
    id: "teacher-001",
    name: "Sarah Williams",
    email: "teacher@school1.com",
    role: "teacher",
    schoolId: "sch-001",
    schoolName: "Cambridge Academy",
    password: "password",
  },
  {
    id: "exam-001",
    name: "Dr. James Wilson",
    email: "examofficer@school1.com",
    role: "exam-officer",
    schoolId: "sch-001",
    schoolName: "Cambridge Academy",
    password: "password",
  },
  {
    id: "librarian-001",
    name: "Emma Davis",
    email: "librarian@school1.com",
    role: "librarian",
    schoolId: "sch-001",
    schoolName: "Cambridge Academy",
    password: "password",
  },
  {
    id: "clinic-001",
    name: "Dr. Robert Brown",
    email: "clinic@school1.com",
    role: "clinic",
    schoolId: "sch-001",
    schoolName: "Cambridge Academy",
    password: "password",
  },
  {
    id: "store-001",
    name: "Store Manager",
    email: "store@school1.com",
    role: "store",
    schoolId: "sch-001",
    schoolName: "Cambridge Academy Store",
    password: "password",
  },
  {
    id: "approved-stores-001",
    name: "Vendor Manager",
    email: "vendor@school1.com",
    role: "approved-stores",
    schoolId: "sch-001",
    schoolName: "Approved Partner Store",
    password: "password",
  },
  {
    id: "parents-001",
    name: "Alice Thompson",
    email: "parent@cardlect.com",
    role: "parents",
    schoolId: "sch-001",
    schoolName: "Cambridge Academy",
    password: "password",
  },
  {
    id: "student-001",
    name: "Sarah Johnson",
    email: "student@school1.com",
    role: "students",
    schoolId: "sch-001",
    schoolName: "Cambridge Academy",
    password: "password",
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