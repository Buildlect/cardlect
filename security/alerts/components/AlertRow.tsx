import { Alert } from '../data/mockAlertsData'
import { ShieldExclamationIcon, UserMinusIcon, CreditCardIcon, SignalSlashIcon, DocumentIcon } from '@heroicons/react/24/outline'
import { X } from 'lucide-react'

interface AlertRowProps {
  alert: Alert
  onInvestigate?: (id: string) => void
  onNotify?: (id: string) => void
  onReset?: (id: string) => void
  onDismiss?: (id: string) => void
}

const severityColors = {
  CRITICAL: 'text-red-500',
  WARNING: 'text-orange-500',
  SYSTEM: 'text-yellow-500',
  INFO: 'text-blue-500'
}

const severityDots = {
  CRITICAL: 'bg-red-500',
  WARNING: 'bg-orange-500',
  SYSTEM: 'bg-yellow-500',
  INFO: 'bg-blue-500'
}

const alertIcons = {
  'unauthorized-pickup': UserMinusIcon,
  'forced-entry': ShieldExclamationIcon,
  'payment-failed': CreditCardIcon,
  'reader-offline': SignalSlashIcon,
  'overdue-material': DocumentIcon
}

export function AlertRow({ alert, onInvestigate, onNotify, onReset, onDismiss }: AlertRowProps) {
  const IconComponent = alertIcons[alert.alertType.icon as keyof typeof alertIcons] || DocumentIcon

  return (
    <tr className="border-b border-border hover:bg-secondary/20 transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${severityDots[alert.severity]}`} />
          <span className={`font-semibold text-sm ${severityColors[alert.severity]}`}>
            {alert.severity}
          </span>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="text-sm">
          <div className="font-medium text-foreground">{alert.time}</div>
          <div className="text-xs text-muted-foreground">{alert.date}</div>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${alert.severity === 'CRITICAL' ? 'bg-red-500/10' : alert.severity === 'WARNING' ? 'bg-orange-500/10' : alert.severity === 'SYSTEM' ? 'bg-yellow-500/10' : 'bg-blue-500/10'}`}>
            <IconComponent className={`w-5 h-5 ${severityColors[alert.severity]}`} />
          </div>
          <div>
            <div className="font-medium text-sm text-foreground">{alert.alertType.title}</div>
            <div className="text-xs text-muted-foreground">{alert.alertType.description}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        {alert.subject ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
              {alert.subject.avatar}
            </div>
            <div>
              <div className="font-medium text-sm text-foreground">{alert.subject.name}</div>
              <div className="text-xs text-muted-foreground">ID: {alert.subject.id}</div>
            </div>
          </div>
        ) : (
          <span className="text-sm italic text-muted-foreground">Unknown Subject</span>
        )}
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-foreground">{alert.source}</span>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          {alert.status === 'unresolved' && (
            <button
              onClick={() => onInvestigate?.(alert.id)}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
            >
              Investigate
            </button>
          )}
          {alert.status === 'resolved' && alert.severity === 'WARNING' && (
            <button
              onClick={() => onNotify?.(alert.id)}
              className="px-3 py-1.5 bg-secondary text-foreground rounded-lg text-sm hover:bg-secondary/80 transition-colors"
            >
              Notify
            </button>
          )}
          {alert.status === 'resolved' && alert.severity === 'SYSTEM' && (
            <button
              onClick={() => onReset?.(alert.id)}
              className="px-3 py-1.5 bg-secondary text-foreground rounded-lg text-sm hover:bg-secondary/80 transition-colors"
            >
              Reset
            </button>
          )}
          {alert.status === 'resolved' && (
            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            </div>
          )}
          <button
            onClick={() => onDismiss?.(alert.id)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}