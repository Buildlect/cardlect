export const mockStudent = {
  id: 'stu-001',
  name: 'Jane Doe',
  class: 'Grade 5 / Class B',
  lastEntry: '10:05 AM',
  recentPickups: ['John Doe', 'Michael Doe'],
  authorizedPersons: [
    { id: 'p-001', name: 'Sarah Doe', relationship: 'Mother', cardStatus: 'Active' },
    { id: 'p-002', name: 'John Doe', relationship: 'Father', cardStatus: 'Active' },
    { id: 'p-003', name: 'Michael Doe', relationship: 'Guardian', cardStatus: 'Inactive' },
  ],
}

export const mockParent = {
  id: 'p-001',
  name: 'Sarah Doe',
  relationship: 'Mother',
}

export const authorizedPersons = [
  { id: 'p-001', name: 'Sarah Doe', relationship: 'Mother', cardStatus: 'Active' },
  { id: 'p-002', name: 'John Doe', relationship: 'Father', cardStatus: 'Active' },
  { id: 'p-003', name: 'Michael Doe', relationship: 'Guardian', cardStatus: 'Inactive' },
]

export const pickupLogs = [
  { time: '10:45 AM', student: 'Jane Doe', parent: 'Sarah Doe', status: 'Authorized' },
  { time: '10:08 AM', student: 'John Doe', parent: 'John Doe', status: 'Denied' },
  { time: '10:05 AM', student: 'Jane Doe', parent: 'John Doe', status: 'Mismatch' },
]

export const authorizationList = [
  { id: 'a1', student: 'Olivia Rhye', class: 'Grade 5', authorizedPerson: 'John Doe', relationship: 'Father', status: 'Active' },
  { id: 'a2', student: 'Phoenix Baker', class: 'Grade 3', authorizedPerson: 'Jane Smith', relationship: 'Mother', status: 'Active' },
  { id: 'a3', student: 'Lana Steiner', class: 'Grade 1', authorizedPerson: 'Emily White', relationship: 'Aunt', status: 'Expired' },
  { id: 'a4', student: 'Demi Wilkinson', class: 'Grade 6', authorizedPerson: 'Michael Brown', relationship: 'Grandfather', status: 'Active' },
  { id: 'a5', student: 'Candice Wu', class: 'Grade 2', authorizedPerson: 'David Green', relationship: 'Uncle', status: 'Pending' },
]

export default {
  mockStudent,
  mockParent,
  authorizedPersons,
  pickupLogs,
  authorizationList,
}
