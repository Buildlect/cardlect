"use client"

import { useEffect, useMemo, useState } from "react"
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Loader2, Users, Bell, ShieldCheck, Clock } from "lucide-react"
import api from "@/lib/api-client"

interface ChildRow {
  id: string
  full_name: string
}

interface PickupEventRow {
  id: string
  student_id: string
  student_name?: string
  pickup_person_name?: string
  gate_location?: string
  created_at?: string
}

interface AnnouncementRow {
  id: string
  title?: string
  content?: string
  created_at?: string
}

type ActivityItem = {
  id: string
  type: "pickup" | "announcement"
  title: string
  subtitle: string
  time: string
  timestamp: number
}

export default function ParentActivityLogPage() {
  const [loading, setLoading] = useState(true)
  const [children, setChildren] = useState<ChildRow[]>([])
  const [events, setEvents] = useState<PickupEventRow[]>([])
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [childrenRes, eventsRes, announcementsRes] = await Promise.allSettled([
        api.get("/users/children"),
        api.get("/pickups/events?limit=50"),
        api.get("/announcements?limit=20"),
      ])

      const nextChildren: ChildRow[] =
        childrenRes.status === "fulfilled" && Array.isArray(childrenRes.value.data?.data)
          ? childrenRes.value.data.data
          : []

      const childIds = new Set(nextChildren.map((c) => c.id))

      const nextEventsRaw: PickupEventRow[] =
        eventsRes.status === "fulfilled" && Array.isArray(eventsRes.value.data?.data)
          ? eventsRes.value.data.data
          : []

      const nextEvents = nextEventsRaw.filter((e) => childIds.size === 0 || childIds.has(e.student_id))

      const nextAnnouncements: AnnouncementRow[] =
        announcementsRes.status === "fulfilled" && Array.isArray(announcementsRes.value.data?.data)
          ? announcementsRes.value.data.data
          : []

      setChildren(nextChildren)
      setEvents(nextEvents)
      setAnnouncements(nextAnnouncements)
      setLoading(false)
    }

    load()
  }, [])

  const todayIso = new Date().toISOString().slice(0, 10)

  const todayPickups = useMemo(
    () => events.filter((e) => (e.created_at || "").slice(0, 10) === todayIso).length,
    [events, todayIso],
  )

  const timeline = useMemo<ActivityItem[]>(() => {
    const fromEvents: ActivityItem[] = events.map((e) => {
      const ts = e.created_at ? new Date(e.created_at).getTime() : 0
      return {
        id: `pickup-${e.id}`,
        type: "pickup",
        title: `Pickup verified for ${e.student_name || "student"}`,
        subtitle: `${e.pickup_person_name || "Authorized person"} at ${e.gate_location || "Main Gate"}`,
        time: e.created_at ? new Date(e.created_at).toLocaleString() : "N/A",
        timestamp: ts,
      }
    })

    const fromAnnouncements: ActivityItem[] = announcements.map((a) => {
      const ts = a.created_at ? new Date(a.created_at).getTime() : 0
      return {
        id: `announcement-${a.id}`,
        type: "announcement",
        title: a.title || "School announcement",
        subtitle: a.content || "",
        time: a.created_at ? new Date(a.created_at).toLocaleString() : "N/A",
        timestamp: ts,
      }
    })

    return [...fromEvents, ...fromAnnouncements]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20)
  }, [events, announcements])

  if (loading) {
    return (
      <DashboardLayout currentPage="activity-log" role="parent">
        <div className="flex items-center justify-center p-20 min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPage="activity-log" role="parent">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Activity Log</h1>
          <p className="text-muted-foreground">Live parent-facing timeline from backend events.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="text-xs text-muted-foreground">Linked Children</div>
            <div className="text-3xl font-black text-foreground mt-2">{children.length}</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="text-xs text-muted-foreground">Pickups Today</div>
            <div className="text-3xl font-black text-foreground mt-2">{todayPickups}</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="text-xs text-muted-foreground">Announcements</div>
            <div className="text-3xl font-black text-foreground mt-2">{announcements.length}</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="text-xs text-muted-foreground">Recent Events</div>
            <div className="text-3xl font-black text-foreground mt-2">{timeline.length}</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Recent Activity</h2>
          {timeline.length === 0 ? (
            <div className="text-sm text-muted-foreground py-6">No activity records available.</div>
          ) : (
            <div className="space-y-3">
              {timeline.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-border bg-background/40">
                  <div className="flex items-center gap-2 mb-1">
                    {item.type === "pickup" ? <ShieldCheck size={16} className="text-emerald-600" /> : <Bell size={16} className="text-primary" />}
                    <span className="text-sm font-semibold text-foreground">{item.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={12} />
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-3">Children</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {children.map((child) => (
              <div key={child.id} className="p-4 border border-border rounded-xl bg-background/40 flex items-center gap-2">
                <Users size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">{child.full_name}</span>
              </div>
            ))}
            {children.length === 0 && <div className="text-sm text-muted-foreground">No linked children.</div>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
