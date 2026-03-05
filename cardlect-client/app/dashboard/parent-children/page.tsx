"use client"

import { useState, useEffect } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Phone, Mail, Smartphone, Loader2, User, Building2 } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'

interface Child {
  id: string
  full_name: string
  grade: string
  school_name: string
  admission_number: string
  dob: string
  status: string
  phone_number: string
  email: string
}

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)

  const fetchChildren = async () => {
    setLoading(true)
    try {
      const response = await api.get('/users/children')
      setChildren(response.data.data)
    } catch (err) {
      console.error('Failed to fetch children:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChildren()
  }, [])

  const getCardStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return { color: CARDLECT_COLORS.success.main, backgroundColor: `${CARDLECT_COLORS.success.main}20` }
      case 'inactive': return { color: CARDLECT_COLORS.warning.main, backgroundColor: `${CARDLECT_COLORS.warning.main}20` }
      case 'suspended':
      case 'lost': return { color: CARDLECT_COLORS.danger.main, backgroundColor: `${CARDLECT_COLORS.danger.main}20` }
      default: return { color: '#6B7280', backgroundColor: '#F3F4F6' }
    }
  }

  if (loading) {
    return (
      <DashboardLayout currentPage="children" role="parent">
        <div className="flex items-center justify-center p-20 min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPage="children" role="parent">
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tighter">My Children</h1>
            <p className="text-muted-foreground mt-1 font-medium italic">Manage and monitor institutional enrollment profiles.</p>
          </div>
          <Button style={{ backgroundColor: CARDLECT_COLORS.primary.darker }} className="rounded-2xl h-14 px-8 font-black shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
            <Plus size={20} className="mr-2" /> Link New Profile
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Children', val: children.length, color: CARDLECT_COLORS.primary.darker, sub: 'Registered profiles' },
            { label: 'Active Credentials', val: children.filter(c => c.status === 'active').length, color: CARDLECT_COLORS.success.main, sub: 'With verified cards' },
            { label: 'System Alerts', val: children.filter(c => c.status !== 'active').length, color: CARDLECT_COLORS.warning.main, sub: 'Requires Attention' }
          ].map((stat, i) => (
            <Card key={i} className="rounded-3xl border-border shadow-sm group hover:border-primary/50 transition-all">
              <CardContent className="p-8">
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">{stat.label}</div>
                <div className="text-4xl font-black" style={{ color: stat.color }}>{stat.val}</div>
                <div className="text-xs font-bold text-muted-foreground mt-3 flex items-center gap-2 italic">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stat.color }} />
                  {stat.sub}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Children Cards */}
        {children.length === 0 ? (
          <div className="bg-card border-2 border-dashed border-border rounded-[2.5rem] p-24 text-center">
            <User size={48} className="mx-auto mb-6 text-muted-foreground opacity-20" />
            <p className="text-lg font-black text-muted-foreground/40 uppercase tracking-widest">No Children Linked to this Proxy</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {children.map((child) => {
              const statusStyles = getCardStatusColor(child.status);
              return (
                <Card key={child.id} className="rounded-[2.5rem] border-border shadow-sm group hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all overflow-hidden bg-card">
                  <div className="h-2 bg-primary/10 group-hover:bg-primary transition-all" />
                  <CardContent className="p-10">
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center font-black text-2xl border border-primary/10">
                          {child.full_name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-black text-xl text-foreground tracking-tight leading-tight">{child.full_name}</h3>
                          <p className="text-sm font-bold text-primary mt-0.5">{child.grade || 'N/A'}</p>
                        </div>
                      </div>
                      <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border" style={{ color: statusStyles.color, backgroundColor: statusStyles.backgroundColor, borderColor: `${statusStyles.color}30` }}>
                        {child.status}
                      </span>
                    </div>

                    <div className="space-y-5 mb-10">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-muted/50 text-muted-foreground">
                          <Building2 size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Institutional Node</p>
                          <p className="text-sm font-black text-foreground">{child.school_name || 'Academic Institution'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-muted/50 text-muted-foreground">
                          <Plus size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Registration ID</p>
                          <p className="text-sm font-mono font-bold text-foreground">{child.admission_number}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8 text-[11px] font-bold">
                      <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 p-3 rounded-2xl">
                        <Mail size={14} className="text-primary" />
                        <span className="truncate">{child.email || 'No Email'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 p-3 rounded-2xl">
                        <Phone size={14} className="text-primary" />
                        <span>{child.phone_number || 'No Phone'}</span>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button variant="outline" className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] border-2">
                        <Edit size={16} className="mr-2" /> Global Profile
                      </Button>
                      <Button variant="outline" className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] border-2">
                        <Smartphone size={16} className="mr-2" /> ID Protocol
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

