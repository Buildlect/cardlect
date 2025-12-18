const mock = {
  alerts: 13,
  gateEntries: 325,
  pickupsToday: 27,
  recentIncidents: 4,
  gateActivity: [
    { day: 'Mon', value: 120 },
    { day: 'Tue', value: 95 },
    { day: 'Wed', value: 140 },
    { day: 'Thu', value: 160 },
    { day: 'Fri', value: 180 },
    { day: 'Sat', value: 210 },
    { day: 'Sun', value: 240 },
  ],
  recentEvents: [
    { time: '02:00', type: 'Gate Entry', status: 'Resolved' },
    { time: '02:20', type: 'Pickup', status: 'Pending' },
    { time: '02:50', type: 'Incident', status: 'Resolved' },
    { time: '03:05', type: 'Freezer', status: 'Pending' },
    { time: '03:40', type: 'Incident', status: 'Denied' },
  ],
}

export default mock
