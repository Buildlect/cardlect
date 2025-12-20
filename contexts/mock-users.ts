export type UserRole =
  | "super_admin"
  | "school_admin"
  | "security_staff"
  | "parent"
  | "teacher"
  | "librarian"
  | "clinic_staff"

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
    id: "sa-001",
    name: "Admin User",
    email: "admin@cardlect.com",
    role: "super_admin",
    password: "superadmin@123",
  },
  {
    id: "sa-002",
    name: "John Smith",
    email: "schooladmin001@gmail.com",
    role: "school_admin",
    schoolId: "sch-001",
    schoolName: "Trinity Secondary School",
    password: "schooladmin@123!",
  },
  {
    id: "ss-001",
    name: "Michael Johnson",
    email: "security@school.com",
    role: "security_staff",
    schoolId: "sch-001",
    schoolName: "Trinity Secondary School",
    password: "Security123!",
  },
  {
    id: "teacher-001",
    name: "Sarah Williams",
    email: "sarah@school.com",
    role: "teacher",
    schoolId: "sch-001",
    schoolName: "Trinity Secondary School",
    password: "Teacher123!",
  },
  {
    id: "librarian-001",
    name: "Emma Davis",
    email: "library@school.com",
    role: "librarian",
    schoolId: "sch-001",
    schoolName: "Trinity Secondary School",
    password: "Librarian123!",
  },
  {
    id: "clinic-001",
    name: "Dr. Robert Brown",
    email: "clinic@school.com",
    role: "clinic_staff",
    schoolId: "sch-001",
    schoolName: "Trinity Secondary School",
    password: "Clinic123!",
  },
  {
    id: "parent-001",
    name: "Alice Thompson",
    email: "parent@example.com",
    role: "parent",
    schoolId: "sch-001",
    schoolName: "Trinity Secondary School",
    password: "Parent123!",
  },
]

export const getDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case "super_admin":
      return "/super-user"
    case "school_admin":
      return "/admin"
    case "security_staff":
      return "/school-admin/gate-logs"
    case "teacher":
      return "/school-admin/attendance"
    case "librarian":
      return "/school-admin/students"
    case "clinic_staff":
      return "/school-admin/students"
    case "parent":
      return "/parent-dashboard"
    default:
      return "/"
  }
}
