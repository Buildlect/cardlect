export interface Visitor {
  id: string
  name: string
  type: string
  role: string
  avatar: string
  host: string
  purpose: string
  checkIn: {
    time: string
    date: string
  }
  checkOut: {
    time: string
    date: string
  } | null
  status: 'On Campus' | 'Checked Out' | 'Incident Open'
  isUnauthorized?: boolean
}

export const mockVisitors: Visitor[] = [
  {
    id: 'VIS-001',
    name: 'Sarah Jenkins',
    type: 'Contractor',
    role: 'ABc Electric',
    avatar: 'SJ',
    host: 'Facility Manager',
    purpose: 'Maintenance: Server Room',
    checkIn: {
      time: '08:45 AM',
      date: 'Today'
    },
    checkOut: null,
    status: 'On Campus'
  },
  {
    id: 'VIS-002',
    name: 'Michael Ross',
    type: 'Parent',
    role: '',
    avatar: 'MR',
    host: 'Principal Anderson',
    purpose: 'Scheduled Meeting',
    checkIn: {
      time: '09:15 AM',
      date: 'Today'
    },
    checkOut: {
      time: '10:30 AM',
      date: 'Today'
    },
    status: 'Checked Out'
  },
  {
    id: 'VIS-003',
    name: 'David Kim',
    type: 'Delivery',
    role: 'Fedex',
    avatar: 'DK',
    host: 'Front Desk',
    purpose: 'Package Drop-off',
    checkIn: {
      time: '10:05 AM',
      date: 'Today'
    },
    checkOut: {
      time: '10:12 AM',
      date: 'Today'
    },
    status: 'Checked Out'
  },
  {
    id: 'VIS-004',
    name: 'Unknown Visitor',
    type: 'Unauthorized Entry',
    role: '',
    avatar: '?',
    host: 'Security Team',
    purpose: 'Main Gate Breach',
    checkIn: {
      time: '11:20 AM',
      date: 'Today'
    },
    checkOut: null,
    status: 'Incident Open',
    isUnauthorized: true
  },
  {
    id: 'VIS-005',
    name: 'Emily Chen',
    type: 'Guest Speaker',
    role: '',
    avatar: 'EC',
    host: 'Mr. Thompson',
    purpose: 'Science Dept. Seminar',
    checkIn: {
      time: '11:30 AM',
      date: 'Today'
    },
    checkOut: null,
    status: 'On Campus'
  }
]

export const mockVisitorStats = {
  currentVisitors: {
    value: 42,
    trend: '↗5%',
    trendUp: true
  },
  totalCheckIns: {
    value: 115,
    trend: '↗12%',
    trendUp: true
  },
  openIncidents: {
    value: 3,
    trend: '1 Urgent',
    urgent: true
  },
  resolvedToday: {
    value: 12,
    trend: 'Last 24h'
  }
}