export interface GateLog {
  id: string
  timestamp: string
  user: {
    name: string
    id: string
    avatar: string
  }
  role: 'Student' | 'Staff' | 'Visitor'
  gateLocation: string
  event: 'Entry' | 'Exit'
  status: 'Granted' | 'Denied'
}

export const mockGateLogs: GateLog[] = [
  {
    id: 'LOG-001',
    timestamp: 'Oct 24, 08:32 AM',
    user: {
      name: 'John Miller',
      id: '249001',
      avatar: 'JM'
    },
    role: 'Student',
    gateLocation: 'Main Entrance - North',
    event: 'Entry',
    status: 'Granted'
  },
  {
    id: 'LOG-002',
    timestamp: 'Oct 24, 08:30 AM',
    user: {
      name: 'Sarah Davis',
      id: 'ST-8821',
      avatar: 'SD'
    },
    role: 'Staff',
    gateLocation: 'Library Gate 2',
    event: 'Exit',
    status: 'Granted'
  },
  {
    id: 'LOG-003',
    timestamp: 'Oct 24, 08:28 AM',
    user: {
      name: 'Unknown / Card Error',
      id: 'N/A',
      avatar: '?'
    },
    role: 'Visitor',
    gateLocation: 'Parking Gate South',
    event: 'Entry',
    status: 'Denied'
  },
  {
    id: 'LOG-004',
    timestamp: 'Oct 24, 08:25 AM',
    user: {
      name: 'Alex Lee',
      id: '249055',
      avatar: 'AL'
    },
    role: 'Student',
    gateLocation: 'Main Entrance - North',
    event: 'Entry',
    status: 'Granted'
  },
  {
    id: 'LOG-005',
    timestamp: 'Oct 24, 08:22 AM',
    user: {
      name: 'Maria Rodriguez',
      id: '248812',
      avatar: 'MR'
    },
    role: 'Student',
    gateLocation: 'Gymnasium Entrance',
    event: 'Entry',
    status: 'Granted'
  }
]

export const mockGateStats = {
  totalEntriesToday: {
    value: 1245,
    trend: '+12% vs yesterday',
    trendUp: true
  },
  activeAlerts: {
    value: 3,
    trend: 'Requires Attention',
    trendUp: false
  },
  peakTrafficTime: {
    value: '07:45 AM',
    trend: '-5m vs avg',
    trendUp: false
  }
}