"use client"

import { useEffect, useMemo, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Loader2, Users, MessageSquare, Clock } from "lucide-react"
import api from "@/lib/api-client"

interface InboxRow {
  id: string
  subject?: string
  body?: string
  sender_id?: string
  created_at?: string
  channel?: string
}

export default function StudentStudyGroupsPage() {
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<InboxRow[]>([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await api.get("/communications/inbox")
        const rows: InboxRow[] = Array.isArray(res.data?.data) ? res.data.data : []
        setMessages(rows)
      } catch {
        setMessages([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const stats = useMemo(() => {
    const senders = new Set(messages.map((m) => m.sender_id).filter(Boolean))
    const channels = new Set(messages.map((m) => m.channel).filter(Boolean))
    return {
      total: messages.length,
      activeSenders: senders.size,
      channels: channels.size,
      today: messages.filter((m) => (m.created_at || "").slice(0, 10) === new Date().toISOString().slice(0, 10)).length,
    }
  }, [messages])

  if (loading) {
    return (
      <DashboardLayout currentPage="study-groups" role="student">
        <div className="flex items-center justify-center p-20 min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPage="study-groups" role="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Study Groups</h1>
          <p className="text-muted-foreground">Backend-fed collaboration feed from communications inbox.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-2xl p-6"><p className="text-xs text-muted-foreground">Messages</p><p className="text-3xl font-black mt-2">{stats.total}</p></div>
          <div className="bg-card border border-border rounded-2xl p-6"><p className="text-xs text-muted-foreground">Active Senders</p><p className="text-3xl font-black mt-2">{stats.activeSenders}</p></div>
          <div className="bg-card border border-border rounded-2xl p-6"><p className="text-xs text-muted-foreground">Channels</p><p className="text-3xl font-black mt-2">{stats.channels}</p></div>
          <div className="bg-card border border-border rounded-2xl p-6"><p className="text-xs text-muted-foreground">Today</p><p className="text-3xl font-black mt-2">{stats.today}</p></div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Group Feed</h2>
          {messages.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8">No study-group communication yet.</div>
          ) : (
            <div className="space-y-3">
              {messages.slice(0, 20).map((msg) => (
                <div key={msg.id} className="p-4 border border-border rounded-xl bg-background/40">
                  <div className="flex items-center gap-2 mb-1 text-primary"><Users size={14} /><span className="text-xs font-semibold">Group Thread</span></div>
                  <p className="text-sm font-semibold text-foreground">{msg.subject || "Untitled discussion"}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{msg.body || "No message body"}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MessageSquare size={12} /> {msg.channel || "internal"}</span>
                    <span className="inline-flex items-center gap-1"><Clock size={12} /> {msg.created_at ? new Date(msg.created_at).toLocaleString() : "N/A"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
