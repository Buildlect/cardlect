"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Plus, Eye, Pause, Play, X, Users, Activity, TrendingUp, Edit2, Trash2, Check, ChevronRight, ChevronLeft, Loader2, Globe, Building2, MapPin, Mail, Phone, ShieldCheck } from "lucide-react"
import { CARDLECT_COLORS } from "@/lib/cardlect-colors"
import api from "@/lib/api-client"
import { Button } from "@/components/ui/button"

export default function SchoolsPage() {
  const router = useRouter()
  const [schools, setSchools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [wizardFormData, setWizardFormData] = useState({
    name: "", subdomain: "", address: "", email: "", phone: "", principal_name: "", principal_email: "", plan: "basic"
  })

  const fetchSchools = async () => {
    setLoading(true)
    try {
      const response = await api.get("/schools")
      setSchools(response.data.data)
    } catch (err) {
      console.error("Failed to fetch schools:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchools()
  }, [])

  const wizardSteps = [
    { title: "Foundational Identity", description: "School designation and localization" },
    { title: "Communication Node", description: "Integrated contact channels" },
    { title: "Executive Leadership", description: "Principal & administrative authority" },
    { title: "Service Tier", description: "Subscription architecture & deployment" },
  ]

  const validateWizardStep = (step: number) => {
    const newErrors: Record<string, string> = {}
    if (step === 0) {
      if (!wizardFormData.name.trim()) newErrors.name = "Designation is required"
      if (!wizardFormData.subdomain.trim()) newErrors.subdomain = "Node ID required"
      if (!wizardFormData.address.trim()) newErrors.address = "Geolocation required"
    } else if (step === 1) {
      if (!wizardFormData.email.trim()) newErrors.email = "Primary email required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateSchool = async () => {
    if (!validateWizardStep(currentStep)) return
    try {
      await api.post("/schools", wizardFormData)
      setShowAddForm(false)
      fetchSchools()
    } catch (err) {
      alert("Deployment failed. Verify network connectivity.")
    }
  }

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'disabled' : 'active'
      await api.put(`/schools/${id}/status`, { status: newStatus })
      fetchSchools()
    } catch (err) {
      console.error('Status sync failed.')
    }
  }

  if (loading) {
    return (
      <DashboardLayout currentPage="schools" role="super_admin">
        <div className="flex items-center justify-center p-20 min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout currentPage="schools" role="super_admin">
      <div className="space-y-10 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-foreground tracking-tighter">School Infrastructure</h2>
            <p className="text-muted-foreground mt-1 font-medium italic">Global node management and institutional deployment.</p>
          </div>
          <Button
            className="bg-primary hover:bg-primary-darker text-white rounded-2xl h-14 px-8 font-black shadow-lg shadow-primary/20 active:scale-95 transition-all"
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={20} className="mr-2" /> Deploy New School
          </Button>
        </div>

        {/* Global Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            { label: 'Active Nodes', val: schools.filter(s => s.status === 'active').length, icon: Globe, sub: `${schools.length} Total` },
            { label: 'Total Enrollment', val: (schools.reduce((s, c) => s + (c.student_count || 0), 0)).toLocaleString(), icon: Users, sub: 'Across Ecosystem' },
            { label: 'Network Integrity', val: '99.9%', icon: ShieldCheck, sub: 'All Nodes Verified' },
            { label: 'Global Volume', val: '₦4.2M', icon: TrendingUp, sub: 'Last 24 Hours' }
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border rounded-3xl p-8 shadow-sm group hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  <stat.icon size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.sub}</span>
              </div>
              <p className="text-3xl font-black text-foreground mb-1">{stat.val}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* School Registry Table */}
        <div className="bg-card border border-border rounded-[2.5rem] shadow-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="p-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Institutional Node</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Subdomain</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Network Status</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground text-center">Population</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Deployment</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {schools.map((school) => (
                <tr key={school.id} className="hover:bg-muted/10 transition-colors group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center font-black text-xl border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                        {school.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-foreground text-lg tracking-tight">{school.name}</p>
                        <p className="text-xs text-muted-foreground font-medium italic">{school.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <code className="bg-muted rounded-xl px-3 py-1.5 text-xs font-black text-primary border border-border">
                      {school.subdomain}.cardlect.io
                    </code>
                  </td>
                  <td className="p-8">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${school.status === 'active' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'
                      }`}>
                      {school.status}
                    </span>
                  </td>
                  <td className="p-8 text-center">
                    <p className="text-lg font-black text-foreground">{school.student_count || 0}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase italic dark:text-gray-400">Total Enrolled</p>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-2">
                      <Activity className="text-green-500" size={14} />
                      <span className="text-sm font-bold text-foreground">{new Date(school.created_at).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="icon" className="rounded-xl hover:bg-primary hover:text-white border-2" title="Inspect Node">
                        <Eye size={18} />
                      </Button>
                      <Button
                        variant="outline" size="icon" className="rounded-xl border-2 hover:bg-amber-500 hover:text-white"
                        title={school.status === 'active' ? 'Decommission' : 'Restore'}
                        onClick={() => toggleStatus(school.id, school.status)}
                      >
                        {school.status === 'active' ? <Pause size={18} /> : <Play size={18} />}
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-xl border-2 hover:bg-red-500 hover:text-white" title="Decommission Permanently">
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Deployment Wizard Modal */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-card border border-border rounded-[3rem] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row h-[700px]">
              <aside className="w-full md:w-80 bg-muted/30 p-10 border-r border-border flex flex-col">
                <h3 className="text-2xl font-black text-foreground mb-2">Node Wizard</h3>
                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest mb-10 italic">Initializing School Infrastructure</p>
                <div className="space-y-6 flex-1">
                  {wizardSteps.map((step, i) => (
                    <div key={i} className={`flex items-start gap-4 transition-all ${i === currentStep ? 'opacity-100' : 'opacity-40'}`}>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black ${i <= currentStep ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-muted'
                        }`}>
                        {i < currentStep ? <Check size={16} /> : i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-black text-foreground">{step.title}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter leading-tight mt-0.5">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
              <div className="flex-1 p-16 flex flex-col">
                <div className="flex-1">
                  {currentStep === 0 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                      <div className="space-y-6">
                        <div className="relative group">
                          <Building2 className="absolute left-6 top-6 text-muted-foreground group-focus-within:text-primary transition-all" size={24} />
                          <input
                            className="w-full bg-muted/40 border-2 border-transparent focus:border-primary/30 rounded-3xl p-6 pl-16 text-xl font-black outline-none transition-all placeholder:text-muted-foreground/30"
                            placeholder="Legal Designation (School Name)"
                            value={wizardFormData.name}
                            onChange={(e) => setWizardFormData({ ...wizardFormData, name: e.target.value })}
                          />
                        </div>
                        <div className="relative group">
                          <Globe className="absolute left-6 top-6 text-muted-foreground group-focus-within:text-primary transition-all" size={24} />
                          <input
                            className="w-full bg-muted/40 border-2 border-transparent focus:border-primary/30 rounded-3xl p-6 pl-16 text-xl font-black outline-none transition-all placeholder:text-muted-foreground/30"
                            placeholder="Autonomous Subdomain ID"
                            value={wizardFormData.subdomain}
                            onChange={(e) => setWizardFormData({ ...wizardFormData, subdomain: e.target.value.toLowerCase() })}
                          />
                          <span className="absolute right-8 top-8 font-black text-muted-foreground/30">.cardlect.io</span>
                        </div>
                        <div className="relative group">
                          <MapPin className="absolute left-6 top-6 text-muted-foreground group-focus-within:text-primary transition-all" size={24} />
                          <input
                            className="w-full bg-muted/40 border-2 border-transparent focus:border-primary/30 rounded-3xl p-6 pl-16 text-xl font-black outline-none transition-all placeholder:text-muted-foreground/30"
                            placeholder="Physical Localization Geocode"
                            value={wizardFormData.address}
                            onChange={(e) => setWizardFormData({ ...wizardFormData, address: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {currentStep === 1 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                      <div className="space-y-6">
                        <div className="relative group">
                          <Mail className="absolute left-6 top-6 text-muted-foreground group-focus-within:text-primary transition-all" size={24} />
                          <input
                            className="w-full bg-muted/40 border-2 border-transparent focus:border-primary/30 rounded-3xl p-6 pl-16 text-xl font-black outline-none transition-all placeholder:text-muted-foreground/30"
                            placeholder="Infrastructure Admin Email"
                            value={wizardFormData.email}
                            onChange={(e) => setWizardFormData({ ...wizardFormData, email: e.target.value })}
                          />
                        </div>
                        <div className="relative group">
                          <Phone className="absolute left-6 top-6 text-muted-foreground group-focus-within:text-primary transition-all" size={24} />
                          <input
                            className="w-full bg-muted/40 border-2 border-transparent focus:border-primary/30 rounded-3xl p-6 pl-16 text-xl font-black outline-none transition-all placeholder:text-muted-foreground/30"
                            placeholder="Unified Emergency Contact"
                            value={wizardFormData.phone}
                            onChange={(e) => setWizardFormData({ ...wizardFormData, phone: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {currentStep === 2 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                      <div className="space-y-6">
                        <div className="relative group">
                          <Users className="absolute left-6 top-6 text-muted-foreground group-focus-within:text-primary transition-all" size={24} />
                          <input
                            className="w-full bg-muted/40 border-2 border-transparent focus:border-primary/30 rounded-3xl p-6 pl-16 text-xl font-black outline-none transition-all placeholder:text-muted-foreground/30"
                            placeholder="Principal Full Identity"
                            value={wizardFormData.principal_name}
                            onChange={(e) => setWizardFormData({ ...wizardFormData, principal_name: e.target.value })}
                          />
                        </div>
                        <div className="relative group">
                          <Mail className="absolute left-6 top-6 text-muted-foreground group-focus-within:text-primary transition-all" size={24} />
                          <input
                            className="w-full bg-muted/40 border-2 border-transparent focus:border-primary/30 rounded-3xl p-6 pl-16 text-xl font-black outline-none transition-all placeholder:text-muted-foreground/30"
                            placeholder="Principal Direct Channel"
                            value={wizardFormData.principal_email}
                            onChange={(e) => setWizardFormData({ ...wizardFormData, principal_email: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {currentStep === 3 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-6 italic">Configuration Review</h4>
                        <div className="bg-muted/30 rounded-4xl p-8 border border-border space-y-4">
                          <div className="flex justify-between items-center"><span className="text-xs font-black uppercase text-muted-foreground">Entity</span><span className="font-black text-foreground">{wizardFormData.name}</span></div>
                          <div className="flex justify-between items-center"><span className="text-xs font-black uppercase text-muted-foreground">Gateway</span><span className="font-black text-primary italic">{wizardFormData.subdomain}.cardlect.io</span></div>
                          <div className="flex justify-between items-center"><span className="text-xs font-black uppercase text-muted-foreground">Principal</span><span className="font-black text-foreground">{wizardFormData.principal_name}</span></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mt-12 gap-4">
                  <Button
                    variant="ghost"
                    className="rounded-2xl h-14 px-8 font-black hover:bg-muted"
                    onClick={() => setShowAddForm(false)}
                  >
                    Abort
                  </Button>
                  <div className="flex gap-4">
                    {currentStep > 0 && (
                      <Button
                        variant="outline"
                        className="rounded-2xl h-14 px-8 font-black border-2"
                        onClick={() => setCurrentStep(currentStep - 1)}
                      >
                        Revert
                      </Button>
                    )}
                    <Button
                      className="bg-primary hover:bg-primary-darker text-white rounded-2xl h-14 px-10 font-black shadow-xl shadow-primary/20 active:scale-95 transition-all"
                      onClick={currentStep === 3 ? handleCreateSchool : () => setCurrentStep(currentStep + 1)}
                    >
                      {currentStep === 3 ? 'Execute Deployment' : 'Continue Integration'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
