"use client"

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Copy, Eye, EyeOff, Plus, Trash2, AlertCircle, CheckCircle, Sun, Moon, Loader2, Code2, ShieldCheck, Zap, Terminal, Check } from 'lucide-react'
import { CARDLECT_COLORS, SEMANTIC_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'
import { Button } from "@/components/ui/button"

export default function ApiPage() {
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({})
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [newKeyName, setNewKeyName] = useState('')

  const fetchKeys = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api-keys')
      setApiKeys(response.data.data)
    } catch (err) {
      console.error('Failed to fetch API keys')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKeys()
  }, [])

  const generateKey = async () => {
    if (!newKeyName) return alert('Token identification name required.')
    try {
      await api.post('/api-keys', { name: newKeyName })
      setNewKeyName('')
      fetchKeys()
    } catch (err) {
      alert('Key generation failed.')
    }
  }

  const deleteKey = async (id: string) => {
    if (!confirm('Revoking this token will immediately terminate all dependent integrations. Proceed?')) return
    try {
      await api.delete(`/api-keys/${id}`)
      fetchKeys()
    } catch (err) {
      alert('Key revocation failed.')
    }
  }

  const copyToClipboard = async (key: string, id: string) => {
    await navigator.clipboard.writeText(key)
    setCopiedKey(id)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  if (loading) {
    return (
      <DashboardLayout currentPage="api" role="super_admin">
        <div className="flex items-center justify-center p-20 min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPage="api" role="super_admin">
      <div className="space-y-10 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-foreground tracking-tighter">Ecosystem Protocols</h2>
            <p className="text-muted-foreground mt-1 font-medium italic">Global API management and hardware integration credentials.</p>
          </div>
          <div className="flex items-center gap-4 bg-card border border-border px-6 py-2 rounded-2xl shadow-sm">
            <Code2 className="text-primary" size={20} />
            <span className="text-xs font-black uppercase tracking-widest">Protocol v1.4.2-STABLE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Generation Area */}
            <div className="bg-card border border-border rounded-[2.5rem] p-10 shadow-sm group">
              <h3 className="text-2xl font-black text-foreground mb-8 tracking-tight">Generate New Hardware Token</h3>
              <div className="flex gap-4">
                <div className="relative group flex-1">
                  <Terminal className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-all" size={20} />
                  <input
                    className="w-full bg-muted/40 border-2 border-transparent focus:border-primary/30 rounded-3xl h-16 pl-14 pr-6 font-black outline-none transition-all"
                    placeholder="Developer Identity (e.g. Mobile App v2, Point of Sale Node)..."
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                <Button
                  className="bg-primary hover:bg-primary-darker text-white rounded-3xl h-16 px-10 font-black shadow-xl shadow-primary/20 active:scale-95 transition-all"
                  onClick={generateKey}
                >
                  <Plus size={24} />
                </Button>
              </div>
            </div>

            {/* Keys List */}
            <div className="space-y-6">
              <h3 className="text-xl font-black text-foreground flex items-center gap-3">
                <ShieldCheck className="text-green-500" /> Authorized Registry
              </h3>
              {apiKeys.map(k => (
                <div key={k.id} className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm hover:border-primary/40 transition-all group overflow-hidden relative">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="text-xl font-black text-foreground leading-none">{k.name}</h4>
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${k.status === 'active' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-muted text-muted-foreground'}`}>
                          {k.status}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">Node: {k.school_id || 'GLOBAL_ROOT'}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl" onClick={() => deleteKey(k.id)}>
                      <Trash2 size={20} />
                    </Button>
                  </div>

                  <div className="bg-muted/30 border border-border rounded-2xl p-6 flex items-center justify-between group/key">
                    <code className="font-mono text-sm font-black text-foreground break-all">
                      {showKeys[k.id] ? k.key : k.key.substring(0, 10).padEnd(k.key.length, '•')}
                    </code>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="rounded-lg h-10 w-10 hover:bg-white shadow-sm" onClick={() => setShowKeys(p => ({ ...p, [k.id]: !p[k.id] }))}>
                        {showKeys[k.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-lg h-10 w-10 hover:bg-white shadow-sm" onClick={() => copyToClipboard(k.key, k.id)}>
                        {copiedKey === k.id ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                      </Button>
                      {copiedKey === k.id && <span className="absolute top-0 right-0 p-1 text-[8px] font-black text-green-600 uppercase">Copied!</span>}
                    </div>
                  </div>

                  <div className="mt-8 flex items-center gap-8 border-t border-border pt-6">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Last Transmission</p>
                      <p className="text-sm font-black text-foreground">{k.last_used ? new Date(k.last_used).toLocaleString() : 'NEVER_USED'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Generated</p>
                      <p className="text-sm font-black text-foreground">{new Date(k.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2 px-4 py-1 bg-primary/5 rounded-xl border border-primary/10">
                      <Zap size={14} className="text-primary" />
                      <p className="text-[10px] font-black text-primary uppercase">Production Token</p>
                    </div>
                  </div>
                </div>
              ))}
              {apiKeys.length === 0 && (
                <div className="bg-muted/10 border-2 border-dashed border-border rounded-[2.5rem] p-20 text-center">
                  <Code2 size={48} className="mx-auto mb-6 text-muted-foreground opacity-20" />
                  <p className="text-sm font-black uppercase tracking-widest text-muted-foreground opacity-40">Zero Production Tokens In Registry</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-card border border-border rounded-[2.5rem] p-10 shadow-sm space-y-8">
              <h3 className="text-xl font-black text-foreground tracking-tight">Security Hardening</h3>
              <div className="space-y-6">
                {[
                  { title: 'Transport Layer Security', desc: 'All API requests are intercepted via TLS 1.3 encrypted tunnels.' },
                  { title: 'Hardware Isolation', desc: 'Tokens are bound to specific institutional nodes by default.' },
                  { title: 'Rotation Protocol', desc: 'Security auditing recommends rotating production tokens every 90 days.' }
                ].map((tip, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-green-500" />
                      <p className="text-xs font-black uppercase tracking-widest text-foreground">{tip.title}</p>
                    </div>
                    <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">{tip.desc}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full h-14 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px]">
                Security Whitepaper
              </Button>
            </div>

            <div className="bg-primary border border-primary rounded-[2.5rem] p-10 shadow-2xl shadow-primary/30 relative overflow-hidden group">
              <div className="relative z-10 text-white space-y-6">
                <Terminal size={40} className="opacity-40" />
                <h3 className="text-2xl font-black tracking-tight leading-tight">Native Node Persistence</h3>
                <p className="text-xs font-bold text-white/70 leading-relaxed">
                  Cardlect's universal API enables deep integration with physical NFC hardware, biometric scanners, and institutional ERP systems.
                </p>
                <Button className="bg-white text-primary hover:bg-white/90 rounded-2xl h-12 px-6 font-black uppercase tracking-widest text-[10px]">
                  Developer Portal
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
