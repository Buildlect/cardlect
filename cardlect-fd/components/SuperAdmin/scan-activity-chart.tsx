'use client'

import {
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

export function ScanActivityChart() {
  const data = [
    { day: 'Mon', scans: 40 },
    { day: 'Tue', scans: 65 },
    { day: 'Wed', scans: 48 },
    { day: 'Thu', scans: 72 },
    { day: 'Fri', scans: 55 },
    { day: 'Sat', scans: 68 },
    { day: 'Sun', scans: 75 },
  ]

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
      <h3 className="text-lg font-semibold mb-5 text-foreground tracking-tight">
        NFC Scan Activity
      </h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            {/* --- X Axis --- */}
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }}
            />

            {/* --- Y Axis hidden for clean look --- */}
            <YAxis hide />

            {/* --- Tooltip --- */}
            <Tooltip
              cursor={{ stroke: '#d96126', strokeWidth: 1, opacity: 0.2 }}
              contentStyle={{
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '10px',
              }}
              labelStyle={{ color: '#fff' }}
              formatter={(value) => [`${value}`, 'Scans']}
            />

            {/* --- Gradient Fill --- */}
            <defs>
              <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d96126" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#d96126" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            {/* --- Smooth area line --- */}
            <Area
              type="monotone"
              dataKey="scans"
              stroke="#d96126"
              strokeWidth={3}
              fill="url(#scanGradient)"
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
