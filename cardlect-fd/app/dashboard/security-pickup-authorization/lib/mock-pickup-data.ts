// Mock data for Pickup Authorization functionality

export interface Student {
    id: string
    name: string
    class: string
    image: string
    lastEntryTime: string
    recentPickups: Array<{
        time: string
        parent: string
        status: 'authorized' | 'denied'
    }>
    linkedParent: string
}

export interface Parent {
    id: string
    name: string
    relationship: string
    image: string
    cardStatus: 'active' | 'inactive'
}

export interface AuthorizedPerson {
    id: string
    name: string
    relationship: string
    cardStatus: 'active' | 'inactive'
}

export interface PickupLog {
    id: string
    time: string
    student: string
    parent: string
    status: 'authorized' | 'denied' | 'mismatch'
}

// Mock Student Data
export const mockStudent: Student = {
    id: 'STU001',
    name: 'Alice Johnson',
    class: 'Grade 5A',
    image: '', // Removed image URL
    lastEntryTime: '8:30 AM Today',
    recentPickups: [
        {
            time: 'Yesterday 3:45 PM',
            parent: 'Sarah Johnson',
            status: 'authorized'
        },
        {
            time: 'Last Week 2:30 PM',
            parent: 'Sarah Johnson',
            status: 'authorized'
        }
    ],
    linkedParent: 'Sarah Johnson'
}

// Mock Parent Data
export const mockParent: Parent = {
    id: 'PAR001',
    name: 'Sarah Johnson',
    relationship: 'Mother',
    image: '', // Removed image URL
    cardStatus: 'active'
}

// Authorized Persons for the student
export const authorizedPersons: AuthorizedPerson[] = [
    {
        id: 'PAR001',
        name: 'Sarah Johnson',
        relationship: 'Mother',
        cardStatus: 'active'
    },
    {
        id: 'PAR002',
        name: 'Michael Johnson',
        relationship: 'Father',
        cardStatus: 'active'
    },
    {
        id: 'PAR003',
        name: 'Emma Wilson',
        relationship: 'Aunt',
        cardStatus: 'inactive'
    }
]

// Initial Pickup Logs
export const initialPickupLogs: PickupLog[] = [
    {
        id: 'LOG001',
        time: 'Today 8:30 AM',
        student: 'Alice Johnson',
        parent: 'Sarah Johnson',
        status: 'authorized'
    },
    {
        id: 'LOG002',
        time: 'Yesterday 3:45 PM',
        student: 'Alice Johnson',
        parent: 'Sarah Johnson',
        status: 'authorized'
    },
    {
        id: 'LOG003',
        time: 'Last Week 2:30 PM',
        student: 'Bob Smith',
        parent: 'John Smith',
        status: 'denied'
    },
    {
        id: 'LOG004',
        time: 'Last Week 1:15 PM',
        student: 'Alice Johnson',
        parent: 'Unknown Person',
        status: 'mismatch'
    }
]

// Valid mock IDs for testing manual input
export const validStudentIds = ['STU001', 'STU002', 'STU003', 'STU004', 'STU005']
export const validParentIds = ['PAR001', 'PAR002', 'PAR003', 'PAR004', 'PAR005']

// Mock function to simulate card scanning
export const mockScanStudent = (): Student => {
    return mockStudent
}

export const mockScanParent = (): Parent => {
    return mockParent
}

// Mock function to simulate ID lookup
export const mockLookupStudentById = (id: string): Student | null => {
    if (id === 'STU001') return mockStudent
    // In a real app, this would query a database
    return null
}

export const mockLookupParentById = (id: string): Parent | null => {
    if (id === 'PAR001') return mockParent
    // In a real app, this would query a database
    return null
}

// Authorization logic
export type AuthorizationStatus = 'authorized' | 'denied' | 'mismatch'

export const checkAuthorization = (student: Student, parent: Parent): AuthorizationStatus => {
    // Check if parent is in authorized persons list
    const isAuthorized = authorizedPersons.some(person =>
        person.name === parent.name && person.cardStatus === 'active'
    )

    if (!isAuthorized) {
        return 'denied'
    }

    // Check if parent matches the linked parent
    if (parent.name === student.linkedParent) {
        return 'authorized'
    }

    // If authorized but not the primary parent
    return 'authorized'
}
