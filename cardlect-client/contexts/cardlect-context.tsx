'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface Student {
  id: string
  schoolId: string
  name: string
  admissionNo: string
  class: string
  email: string
  phone: string
  dateOfBirth: string
  parents: string[]
  cardStatus: 'issued' | 'pending' | 'inactive'
  cardId?: string
  imageVerified: boolean
  imageUrl?: string
  enrollmentDate: string
}

export interface Parent {
  id: string
  schoolId: string
  name: string
  email: string
  phone: string
  relationship: string
  linkedStudents: string[]
  verified: boolean
}

export interface Staff {
  id: string
  schoolId: string
  name: string
  role: string
  email: string
  phone: string
  department: string
  joinDate: string
  status: 'active' | 'inactive'
  permissions: string[]
}

export interface Device {
  id: string
  schoolId: string
  name: string
  type: 'NFC Reader' | 'USB Camera'
  status: 'active' | 'inactive'
  battery: number
  location: string
  firmwareVersion?: string
  lastSync?: string
}

export interface School {
  id: string
  name: string
  subdomain: string
  email: string
  phone: string
  address: string
  status: 'active' | 'disabled' | 'pending'
  students: number
  staff: number
  parents: number
  cardUsage: number
  walletActivity: 'high' | 'medium' | 'low'
  totalTransactions: number
  attendance: number
  lastActivity: string
  subscriptionPlan: 'basic' | 'premium' | 'enterprise'
  establishedDate: string
  principalName: string
  principalEmail: string
  features: {
    [key: string]: boolean
  }
  hardware?: Device[]
}

export interface Feature {
  id: string
  name: string
  category: string
  description: string
  enabled: boolean
}

interface CardlectContextType {
  schools: School[]
  addSchool: (school: Omit<School, 'id'>) => void
  updateSchool: (id: string, school: Partial<School>) => void
  deleteSchool: (id: string) => void

  addDevice: (device: Omit<Device, 'id'>) => void
  updateDevice: (id: string, device: Partial<Device>) => void
  deleteDevice: (id: string) => void
  getSchoolDevices: (schoolId: string) => Device[]

  students: Student[]
  addStudent: (student: Omit<Student, 'id'>) => void
  updateStudent: (id: string, student: Partial<Student>) => void
  deleteStudent: (id: string) => void
  getSchoolStudents: (schoolId: string) => Student[]

  staff: Staff[]
  addStaff: (staffMember: Omit<Staff, 'id'>) => void
  updateStaff: (id: string, staff: Partial<Staff>) => void
  deleteStaff: (id: string) => void
  getSchoolStaff: (schoolId: string) => Staff[]

  parents: Parent[]
  addParent: (parent: Omit<Parent, 'id'>) => void
  updateParent: (id: string, parent: Partial<Parent>) => void
  deleteParent: (id: string) => void
  getSchoolParents: (schoolId: string) => Parent[]

  features: Feature[]
  toggleFeature: (schoolId: string, featureId: string) => void
  bulkToggleFeatures: (schoolId: string, enabled: boolean) => void
}

const CardlectContext = createContext<CardlectContextType | undefined>(undefined)

const mockSchools: School[] = [
  {
    id: '1', name: 'Lagos International School', subdomain: 'lagos', email: 'admin@lagos.edu.ng', phone: '08012345678', address: '12 Tafawa Balewa Way, Lagos', status: 'active', students: 450, staff: 45, parents: 430, cardUsage: 92, walletActivity: 'high', totalTransactions: 2850, attendance: 94, lastActivity: '2 mins ago', subscriptionPlan: 'enterprise', establishedDate: '2015-01-15', principalName: 'Dr. Amina Bello', principalEmail: 'principal@lagos.edu.ng',
    features: { fastScan: true, liveVerification: true, usbCamera: true, qrCode: true, nfcReader: true, attendance: true, wallet: true, library: true, clinic: true, events: true, notifications: true, analytics: true },
    hardware: [
      { id: '1', schoolId: '1', name: 'NFC Reader 1', type: 'NFC Reader', status: 'active', battery: 95, location: 'Main Gate', firmwareVersion: '2.1.0', lastSync: '2 mins ago' },
      { id: '2', schoolId: '1', name: 'USB Camera 1', type: 'USB Camera', status: 'active', battery: 100, location: 'Entrance', firmwareVersion: '1.5.0', lastSync: '5 mins ago' },
    ]
  },
  {
    id: '2', name: 'Ife Community High School', subdomain: 'ife', email: 'admin@ife.edu.ng', phone: '08012345679', address: '45 Obafemi Awolowo Rd, Ile-Ife', status: 'active', students: 320, staff: 35, parents: 310, cardUsage: 78, walletActivity: 'medium', totalTransactions: 1920, attendance: 87, lastActivity: '5 mins ago', subscriptionPlan: 'premium', establishedDate: '2018-03-20', principalName: 'Mr. Chinedu Okafor', principalEmail: 'principal@ife.edu.ng',
    features: { fastScan: true, liveVerification: false, usbCamera: true, qrCode: true, nfcReader: true, attendance: true, wallet: true, library: false, clinic: true, events: false, notifications: true, analytics: true },
    hardware: []
  },
  {
    id: '3', name: 'Kaduna Model Academy', subdomain: 'kaduna', email: 'admin@kaduna.edu.ng', phone: '08012345680', address: '78 Ahmadu Bello Way, Kaduna', status: 'active', students: 280, staff: 28, parents: 270, cardUsage: 65, walletActivity: 'low', totalTransactions: 1340, attendance: 91, lastActivity: '12 mins ago', subscriptionPlan: 'basic', establishedDate: '2020-05-10', principalName: 'Ms. Funke Adeyemi', principalEmail: 'principal@kaduna.edu.ng',
    features: { fastScan: true, liveVerification: false, usbCamera: false, qrCode: true, nfcReader: true, attendance: true, wallet: false, library: false, clinic: false, events: false, notifications: true, analytics: false },
    hardware: []
  },
  {
    id: '4', name: 'Abuja College', subdomain: 'abuja', email: 'admin@abuja.edu.ng', phone: '08012345681', address: '321 Unity Plaza, Abuja', status: 'pending', students: 0, staff: 0, parents: 0, cardUsage: 0, walletActivity: 'low', totalTransactions: 0, attendance: 0, lastActivity: 'N/A', subscriptionPlan: 'basic', establishedDate: '2024-01-01', principalName: 'Dr. Michael Okoye', principalEmail: 'principal@abuja.edu.ng',
    features: { fastScan: false, liveVerification: false, usbCamera: false, qrCode: false, nfcReader: false, attendance: false, wallet: false, library: false, clinic: false, events: false, notifications: false, analytics: false },
    hardware: []
  },
  {
    id: '5', name: 'Port Harcourt Academy', subdomain: 'ph', email: 'admin@ph.edu.ng', phone: '08012345682', address: '654 Isaac Boro Rd, Port Harcourt', status: 'disabled', students: 200, staff: 20, parents: 195, cardUsage: 45, walletActivity: 'low', totalTransactions: 980, attendance: 45, lastActivity: '3 days ago', subscriptionPlan: 'basic', establishedDate: '2016-07-25', principalName: 'Prof. David Eze', principalEmail: 'principal@ph.edu.ng',
    features: { fastScan: false, liveVerification: false, usbCamera: false, qrCode: true, nfcReader: false, attendance: true, wallet: false, library: false, clinic: false, events: false, notifications: false, analytics: false },
    hardware: []
  },
]

const mockStudents: Student[] = [
  { id: 's1', schoolId: '1', name: 'Aisha Bello', admissionNo: 'LIS-001', class: '10A', email: 'aisha@lagos.edu.ng', phone: '08020123456', dateOfBirth: '2009-03-15', parents: ['pa1'], cardStatus: 'issued', cardId: 'CARD-001', imageVerified: true, enrollmentDate: '2022-01-10' },
  { id: 's2', schoolId: '1', name: 'Bob Chen', admissionNo: 'CA-002', class: '10B', email: 'bob@cambridge.edu', phone: '9876543221', dateOfBirth: '2009-07-22', parents: ['p2'], cardStatus: 'issued', cardId: 'CARD-002', imageVerified: true, enrollmentDate: '2022-01-10' },
  { id: 's3', schoolId: '1', name: 'Carol Davis', admissionNo: 'CA-003', class: '11A', email: 'carol@cambridge.edu', phone: '9876543222', dateOfBirth: '2008-05-10', parents: ['p3'], cardStatus: 'pending', imageVerified: false, enrollmentDate: '2023-06-15' },
  { id: 's4', schoolId: '2', name: 'David Evans', admissionNo: 'OH-001', class: '9A', email: 'david@oxford.edu', phone: '9876543223', dateOfBirth: '2010-01-20', parents: ['p4'], cardStatus: 'issued', cardId: 'CARD-003', imageVerified: true, enrollmentDate: '2023-01-15' },
]

const mockStaff: Staff[] = [
  { id: 'st1', schoolId: '1', name: 'Mr. John Smith', role: 'Principal', email: 'john@cambridge.edu', phone: '9876543230', department: 'Administration', joinDate: '2015-01-15', status: 'active', permissions: ['all'] },
  { id: 'st2', schoolId: '1', name: 'Mrs. Sarah Johnson', role: 'Vice Principal', email: 'sarah@cambridge.edu', phone: '9876543231', department: 'Administration', joinDate: '2015-06-01', status: 'active', permissions: ['manage_school', 'view_analytics'] },
  { id: 'st3', schoolId: '1', name: 'Mr. Michael Chen', role: 'IT Manager', email: 'michael@cambridge.edu', phone: '9876543232', department: 'IT', joinDate: '2018-03-10', status: 'active', permissions: ['manage_hardware', 'manage_cards'] },
  { id: 'st4', schoolId: '2', name: 'Dr. Emily Watson', role: 'Principal', email: 'emily@oxford.edu', phone: '9876543233', department: 'Administration', joinDate: '2018-03-20', status: 'active', permissions: ['all'] },
]

const mockParents: Parent[] = [
  { id: 'pa1', schoolId: '1', name: 'Mr. Robert Johnson', email: 'robert@email.com', phone: '9876543240', relationship: 'Father', linkedStudents: ['s1'], verified: true },
  { id: 'pa2', schoolId: '1', name: 'Mrs. Emily Chen', email: 'emily@email.com', phone: '9876543241', relationship: 'Mother', linkedStudents: ['s2'], verified: true },
  { id: 'pa3', schoolId: '1', name: 'Mr. James Davis', email: 'james@email.com', phone: '9876543242', relationship: 'Father', linkedStudents: ['s3'], verified: false },
  { id: 'pa4', schoolId: '2', name: 'Mrs. Victoria Evans', email: 'victoria@email.com', phone: '9876543243', relationship: 'Mother', linkedStudents: ['s4'], verified: true },
]

const mockFeatures: Feature[] = [
  { id: 'f1', name: 'Fast Scan', category: 'Core', description: 'Quick NFC card scanning', enabled: true },
  { id: 'f2', name: 'Live Verification', category: 'Security', description: 'Real-time face verification', enabled: true },
  { id: 'f3', name: 'USB Camera', category: 'Hardware', description: 'USB camera integration', enabled: true },
  { id: 'f4', name: 'QR Code', category: 'Core', description: 'QR code scanning support', enabled: true },
  { id: 'f5', name: 'NFC Reader', category: 'Hardware', description: 'NFC reader hardware', enabled: true },
  { id: 'f6', name: 'Attendance', category: 'Module', description: 'Attendance tracking', enabled: true },
  { id: 'f7', name: 'Wallet', category: 'Module', description: 'Digital wallet system', enabled: true },
  { id: 'f8', name: 'Library', category: 'Module', description: 'Library management', enabled: false },
  { id: 'f9', name: 'Clinic', category: 'Module', description: 'Clinic management', enabled: true },
  { id: 'f10', name: 'Events', category: 'Module', description: 'Event management', enabled: false },
  { id: 'f11', name: 'Notifications', category: 'System', description: 'Push notifications', enabled: true },
  { id: 'f12', name: 'Analytics', category: 'System', description: 'Advanced analytics', enabled: true },
]

export function CardlectProvider({ children }: { children: ReactNode }) {
  const [schools, setSchools] = useState<School[]>(mockSchools)
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [staff, setStaff] = useState<Staff[]>(mockStaff)
  const [parents, setParents] = useState<Parent[]>(mockParents)
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', schoolId: '1', name: 'NFC Reader 1', type: 'NFC Reader', status: 'active', battery: 95, location: 'Main Gate', firmwareVersion: '2.1.0', lastSync: '2 mins ago' },
    { id: '2', schoolId: '1', name: 'USB Camera 1', type: 'USB Camera', status: 'active', battery: 100, location: 'Entrance', firmwareVersion: '1.5.0', lastSync: '5 mins ago' },
  ])

  const value: CardlectContextType = {
    schools,
    addSchool: (school) => setSchools([...schools, { ...school, id: Date.now().toString(), hardware: [] }]),
    updateSchool: (id, updates) => setSchools(schools.map(s => s.id === id ? { ...s, ...updates } : s)),
    deleteSchool: (id) => setSchools(schools.filter(s => s.id !== id)),

    addDevice: (device) => {
      const newDevice = { ...device, id: Date.now().toString() }
      setDevices([...devices, newDevice])
      setSchools(schools.map(s => s.id === device.schoolId ? { ...s, hardware: [...(s.hardware || []), newDevice] } : s))
    },
    updateDevice: (id, updates) => {
      setDevices(devices.map(d => d.id === id ? { ...d, ...updates } : d))
      setSchools(schools.map(s => ({
        ...s,
        hardware: s.hardware?.map(d => d.id === id ? { ...d, ...updates } : d)
      })))
    },
    deleteDevice: (id) => {
      setDevices(devices.filter(d => d.id !== id))
      setSchools(schools.map(s => ({
        ...s,
        hardware: s.hardware?.filter(d => d.id !== id)
      })))
    },
    getSchoolDevices: (schoolId) => devices.filter(d => d.schoolId === schoolId),

    students,
    addStudent: (student) => setStudents([...students, { ...student, id: Date.now().toString() }]),
    updateStudent: (id, updates) => setStudents(students.map(s => s.id === id ? { ...s, ...updates } : s)),
    deleteStudent: (id) => setStudents(students.filter(s => s.id !== id)),
    getSchoolStudents: (schoolId) => students.filter(s => s.schoolId === schoolId),

    staff,
    addStaff: (staffMember) => setStaff([...staff, { ...staffMember, id: Date.now().toString() }]),
    updateStaff: (id, updates) => setStaff(staff.map(s => s.id === id ? { ...s, ...updates } : s)),
    deleteStaff: (id) => setStaff(staff.filter(s => s.id !== id)),
    getSchoolStaff: (schoolId) => staff.filter(s => s.schoolId === schoolId),

    parents,
    addParent: (parent) => setParents([...parents, { ...parent, id: Date.now().toString() }]),
    updateParent: (id, updates) => setParents(parents.map(p => p.id === id ? { ...p, ...updates } : p)),
    deleteParent: (id) => setParents(parents.filter(p => p.id !== id)),
    getSchoolParents: (schoolId) => parents.filter(p => p.schoolId === schoolId),

    features: mockFeatures,
    toggleFeature: (schoolId, featureId) => {
      setSchools(schools.map(s =>
        s.id === schoolId
          ? { ...s, features: { ...s.features, [featureId]: !s.features[featureId] } }
          : s
      ))
    },
    bulkToggleFeatures: (schoolId, enabled) => {
      setSchools(schools.map(s =>
        s.id === schoolId
          ? { ...s, features: Object.keys(s.features).reduce((acc, key) => ({ ...acc, [key]: enabled }), {}) }
          : s
      ))
    },
  }

  return <CardlectContext.Provider value={value}>{children}</CardlectContext.Provider>
}

export function useCardlect() {
  const context = useContext(CardlectContext)
  if (!context) {
    throw new Error('useCardlect must be used within CardlectProvider')
  }
  return context
}
