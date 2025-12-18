export interface Alert {
  id: string
  severity: 'CRITICAL' | 'WARNING' | 'SYSTEM' | 'INFO'
  time: string
  date: string
  alertType: {
    icon: string
    title: string
    description: string
  }
  subject: {
    name: string
    id: string
    avatar?: string
  } | null
  source: string
  status: 'unresolved' | 'resolved' | 'investigating'
}

export const mockAlerts: Alert[] = [
  {
    id: 'ALT-001',
    severity: 'CRITICAL',
    time: '10:02 AM',
    date: 'Today',
    alertType: {
      icon: 'unauthorized-pickup',
      title: 'Unauthorized Pickup',
      description: 'Unregistered guardian attempted checkout'
    },
    subject: {
      name: 'Sarah Jenkins',
      id: '#88321',
      avatar: 'SJ'
    },
    source: 'Gate B-North',
    status: 'unresolved'
  },
  {
    id: 'ALT-002',
    severity: 'CRITICAL',
    time: '09:48 AM',
    date: 'Today',
    alertType: {
      icon: 'forced-entry',
      title: 'Forced Entry',
      description: 'Door forced open without badge scan'
    },
    subject: null,
    source: 'Library Rear Exit',
    status: 'unresolved'
  },
  {
    id: 'ALT-003',
    severity: 'WARNING',
    time: '09:15 AM',
    date: 'Today',
    alertType: {
      icon: 'payment-failed',
      title: 'Payment Failed',
      description: 'Insufficient funds multiple attempts'
    },
    subject: {
      name: 'Michael Chen',
      id: '#99216',
      avatar: 'MC'
    },
    source: 'Cafeteria Term 2',
    status: 'resolved'
  },
  {
    id: 'ALT-004',
    severity: 'SYSTEM',
    time: '08:55 AM',
    date: 'Today',
    alertType: {
      icon: 'reader-offline',
      title: 'Reader Offline',
      description: 'Device not responding to heartbeats'
    },
    subject: null,
    source: 'Gym Entrance',
    status: 'resolved'
  },
  {
    id: 'ALT-005',
    severity: 'INFO',
    time: '08:30 AM',
    date: 'Today',
    alertType: {
      icon: 'overdue-material',
      title: 'Overdue Material',
      description: 'Library book 14 days overdue'
    },
    subject: {
      name: 'Mr. A. Silva',
      id: '#77845',
      avatar: 'AS'
    },
    source: 'Library System',
    status: 'resolved'
  }
]

export const mockStats = {
  criticalBreaches: {
    value: 2,
    trend: '+1 since 9am',
    trendUp: true
  },
  unauthorizedPickups: {
    value: 1,
    trend: 'No change',
    trendUp: false
  },
  systemWarnings: {
    value: 5,
    trend: '+2 new',
    trendUp: true
  },
  resolvedToday: {
    value: 14,
    trend: '94% Resolution Rate',
    trendUp: false
  }
}