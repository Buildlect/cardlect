import { GateLog } from '../data/mockGateLogsData'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'

interface GateLogRowProps {
  log: GateLog
  onAction?: (id: string) => void
}

const roleBadgeColors = {
  Student: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Staff: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Visitor: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
}

export function GateLogRow({ log, onAction }: GateLogRowProps) {
  return (
    <tr className="border-b border-border hover:bg-secondary/20 transition-colors">
      <td className="py-4 px-4">
        <span className="text-sm text-foreground">{log.timestamp}</span>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
            {log.user.avatar}
          </div>
          <div>
            <div className="font-medium text-sm text-foreground">{log.user.name}</div>
            <div className="text-xs text-muted-foreground">ID: {log.user.id}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium border ${roleBadgeColors[log.role]}`}>
          {log.role}
        </span>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-foreground">{log.gateLocation}</span>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-foreground">{log.event}</span>
      </td>
      <td className="py-4 px-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium ${
          log.status === 'Granted' 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-red-500/20 text-red-400'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            log.status === 'Granted' ? 'bg-green-400' : 'bg-red-400'
          }`} />
          {log.status}
        </span>
      </td>
      <td className="py-4 px-4">
        <button
          onClick={() => onAction?.(log.id)}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <EllipsisVerticalIcon className="w-5 h-5" />
        </button>
      </td>
    </tr>
  )
}