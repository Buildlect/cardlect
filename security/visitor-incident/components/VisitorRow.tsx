import { Visitor } from '../data/mockVisitorData'
import { EllipsisVerticalIcon, EyeIcon } from '@heroicons/react/24/outline'

interface VisitorRowProps {
  visitor: Visitor
  selected?: boolean
  onSelect?: (id: string) => void
  onAction?: (id: string) => void
}

export function VisitorRow({ visitor, selected, onSelect, onAction }: VisitorRowProps) {
  return (
    <tr className="border-b border-border hover:bg-secondary/20 transition-colors">
      <td className="py-4 px-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect?.(visitor.id)}
          className="w-4 h-4 rounded border-border bg-secondary text-primary focus:ring-2 focus:ring-primary"
        />
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${visitor.isUnauthorized ? 'bg-gray-600' : 'bg-primary'} text-primary-foreground flex items-center justify-center text-sm font-semibold`}>
            {visitor.avatar}
          </div>
          <div>
            <div className="font-medium text-sm text-foreground">{visitor.name}</div>
            <div className={`text-xs ${visitor.isUnauthorized ? 'text-red-500' : 'text-muted-foreground'}`}>
              {visitor.type}
              {visitor.role && ` • ${visitor.role}`}
            </div>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <div>
          <div className="font-medium text-sm text-foreground">{visitor.host}</div>
          <div className="text-xs text-muted-foreground">{visitor.purpose}</div>
        </div>
      </td>
      <td className="py-4 px-4">
        <div>
          <div className="font-medium text-sm text-foreground">{visitor.checkIn.time}</div>
          <div className="text-xs text-muted-foreground">{visitor.checkIn.date}</div>
        </div>
      </td>
      <td className="py-4 px-4">
        {visitor.checkOut ? (
          <div>
            <div className="font-medium text-sm text-foreground">{visitor.checkOut.time}</div>
            <div className="text-xs text-muted-foreground">{visitor.checkOut.date}</div>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </td>
      <td className="py-4 px-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium ${
          visitor.status === 'On Campus' 
            ? 'bg-green-500/20 text-green-400' 
            : visitor.status === 'Checked Out'
            ? 'bg-gray-500/20 text-gray-400'
            : 'bg-red-500/20 text-red-400'
        }`}>
          {visitor.status === 'On Campus' && <span className="w-1.5 h-1.5 rounded-full bg-green-400" />}
          {visitor.status === 'Incident Open' && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
          {visitor.status}
        </span>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          {visitor.status === 'Incident Open' && (
            <button
              onClick={() => onAction?.(visitor.id)}
              className="p-1.5 bg-red-500/20 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <EyeIcon className="w-4 h-4" />
            </button>
          )}
          {visitor.status !== 'Incident Open' && (
            <button
              onClick={() => onAction?.(visitor.id)}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <EllipsisVerticalIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}