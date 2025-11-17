'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/SuperAdmin/sidebar'
import { Header } from '@/components/SuperAdmin/header'
import { Copy, Eye, EyeOff, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  key: string
  rateLimit: number
  requestsToday: number
  lastUsed: string
  status: 'active' | 'inactive'
  createdDate: string
}

interface WebhookLog {
  id: string
  event: string
  status: 'success' | 'failed'
  statusCode?: number
  timestamp: string
  endpoint: string
}

export default function ApiPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({})
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: 'key-001', name: 'Mobile App Integration', key: 'sk_live_abc123def456ghi789jkl', rateLimit: 10000, requestsToday: 4523, lastUsed: '2 minutes ago', status: 'active', createdDate: '2024-01-10' },
    { id: 'key-002', name: 'External Dashboard', key: 'sk_live_xyz789uvw456rst123opq', rateLimit: 5000, requestsToday: 1240, lastUsed: '15 minutes ago', status: 'active', createdDate: '2024-01-05' },
    { id: 'key-003', name: 'Legacy System (Deprecated)', key: 'sk_live_old_key_12345678900', rateLimit: 1000, requestsToday: 0, lastUsed: '1 week ago', status: 'inactive', createdDate: '2023-06-15' },
  ])

  const mockWebhooks: WebhookLog[] = [
    { id: 'wh-001', event: 'card.scanned', status: 'success', statusCode: 200, timestamp: '2024-01-15 14:32:10', endpoint: 'https://app.example.com/webhooks/card' },
    { id: 'wh-002', event: 'wallet.transaction', status: 'success', statusCode: 200, timestamp: '2024-01-15 14:28:45', endpoint: 'https://app.example.com/webhooks/wallet' },
    { id: 'wh-003', event: 'gate.access', status: 'success', statusCode: 200, timestamp: '2024-01-15 14:15:20', endpoint: 'https://app.example.com/webhooks/gate' },
    { id: 'wh-004', event: 'card.scanned', status: 'failed', statusCode: 500, timestamp: '2024-01-15 14:10:33', endpoint: 'https://webhook.example.com/cardlect' },
    { id: 'wh-005', event: 'attendance.marked', status: 'success', statusCode: 200, timestamp: '2024-01-15 13:55:12', endpoint: 'https://app.example.com/webhooks/attendance' },
  ]

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId],
    }))
  }

  const copyToClipboard = (key: string, keyId: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(keyId)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const deleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== id))
  }

  return (
    <div className="flex h-screen bg-background dark">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} onNavigate={(href) => router.push(href)} currentPage="api" />
      <div className="flex-1 flex flex-col">
        <Header sidebarOpen={sidebarOpen} />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">API Keys & Integrations</h1>
              <p className="text-muted-foreground">Manage API keys, webhooks, and third-party integrations</p>
            </div>

            <div className="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-foreground">
                {' '}
                <a href="#" className="text-primary hover:underline">
                  Read API Documentation
                </a>{' '}
                to learn how to integrate with Cardlect
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">API Keys</h2>
                <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-all">
                  <Plus size={18} />
                  Generate New Key
                </button>
              </div>

              <div className="space-y-4">
                {apiKeys.map(apiKey => (
                  <div key={apiKey.id} className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-foreground">{apiKey.name}</h3>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              apiKey.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {apiKey.status.charAt(0).toUpperCase() + apiKey.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Created: {apiKey.createdDate}</p>
                      </div>
                      <button
                        className="p-2 hover:bg-secondary rounded transition-all"
                        onClick={() => deleteApiKey(apiKey.id)}
                      >
                        <Trash2 size={18} className="text-destructive" />
                      </button>
                    </div>

                    <div className="bg-secondary/30 rounded-lg p-4 mb-4 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">API Key</p>
                        <code className="text-sm font-mono text-foreground">
                          {showKeys[apiKey.id] ? apiKey.key : '••••••••••••••••••••••••••'}
                        </code>
                      </div>
                      <button
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="p-2 hover:bg-secondary rounded transition-all ml-2"
                      >
                        {showKeys[apiKey.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                        className="p-2 hover:bg-secondary rounded transition-all"
                      >
                        <Copy size={18} className={copiedKey === apiKey.id ? 'text-primary' : ''} />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-secondary/20 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Rate Limit</p>
                        <p className="text-lg font-semibold text-foreground">{apiKey.rateLimit.toLocaleString()} req/mo</p>
                      </div>
                      <div className="bg-secondary/20 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Requests Today</p>
                        <p className="text-lg font-semibold text-primary">{apiKey.requestsToday.toLocaleString()}</p>
                      </div>
                      <div className="bg-secondary/20 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Last Used</p>
                        <p className="text-lg font-semibold text-foreground">{apiKey.lastUsed}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Webhook Logs</h2>

              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Timestamp</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Event</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Endpoint</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Response</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockWebhooks.map((log, idx) => (
                        <tr key={log.id} className={`${idx % 2 === 0 ? 'bg-secondary/20' : ''} border-b border-border hover:bg-secondary/40 transition-all`}>
                          <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{log.timestamp}</td>
                          <td className="px-6 py-4 text-sm text-foreground">{log.event}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground truncate">{log.endpoint}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {log.status === 'success' ? (
                                <CheckCircle size={16} className="text-primary" />
                              ) : (
                                <AlertCircle size={16} className="text-destructive" />
                              )}
                              <span className="text-sm font-medium text-foreground capitalize">{log.status}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`px-2 py-1 rounded text-xs font-mono ${
                                log.status === 'success' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
                              }`}
                            >
                              {log.statusCode}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
