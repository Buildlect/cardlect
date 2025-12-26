'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Plus, Eye, Pause, Play, X, Users, UserCheck, BookOpen, Settings, Activity, TrendingUp, Edit2, Trash2, Check, Server, Zap, ChevronRight, ChevronLeft } from 'lucide-react'
import { useCardlect, School } from '@/contexts/cardlect-context'

interface SchoolDetailsModal extends School {
  staffList: Array<{ id: string; name: string; role: string; email: string }>
  studentList: Array<{ id: string; name: string; class: string; cardStatus: string }>
  parentList: Array<{ id: string; name: string; contact: string; email: string }>
  recentActivities: Array<{ id: string; type: string; description: string; time: string }>
}

export default function SchoolsPage() {
  const router = useRouter()
  const { schools, addSchool, updateSchool, deleteSchool, getSchoolStudents, getSchoolStaff, getSchoolParents } = useCardlect()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedSchool, setSelectedSchool] = useState<SchoolDetailsModal | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    email: '',
    phone: '',
    address: '',
    principalName: '',
    principalEmail: '',
    subscriptionPlan: 'basic' as const,
  })

  // SchoolOnboardingWizard component inline
  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [wizardFormData, setWizardFormData] = useState({
    name: '',
    subdomain: '',
    address: '',
    email: '',
    phone: '',
    principalName: '',
    principalEmail: '',
    subscriptionPlan: 'basic' as const,
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowAddForm(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const wizardSteps = [
    { title: 'Basic Information', description: 'School name and location' },
    { title: 'Contact Details', description: 'Email and phone number' },
    { title: 'Principal Information', description: 'Principal details' },
    { title: 'Plan & Review', description: 'Subscription plan and confirmation' },
  ]

  const validateWizardStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 0) {
      if (!wizardFormData.name.trim()) newErrors.name = 'School name is required'
      if (!wizardFormData.subdomain.trim()) newErrors.subdomain = 'Subdomain is required'
      if (wizardFormData.subdomain && !/^[a-z0-9-]+$/.test(wizardFormData.subdomain)) {
        newErrors.subdomain = 'Subdomain can only contain lowercase letters, numbers, and hyphens'
      }
      if (!wizardFormData.address.trim()) newErrors.address = 'Address is required'
    } else if (step === 1) {
      if (!wizardFormData.email.trim()) newErrors.email = 'Email is required'
      if (wizardFormData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(wizardFormData.email)) {
        newErrors.email = 'Invalid email format'
      }
      if (!wizardFormData.phone.trim()) newErrors.phone = 'Phone number is required'
    } else if (step === 2) {
      if (!wizardFormData.principalName.trim()) newErrors.principalName = 'Principal name is required'
      if (!wizardFormData.principalEmail.trim()) newErrors.principalEmail = 'Principal email is required'
      if (wizardFormData.principalEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(wizardFormData.principalEmail)) {
        newErrors.principalEmail = 'Invalid email format'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleWizardNext = () => {
    if (validateWizardStep(currentStep)) {
      if (currentStep < wizardSteps.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handleWizardPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    }
  }

  const handleWizardComplete = () => {
    if (validateWizardStep(currentStep)) {
      addSchool({
        ...wizardFormData,
        status: 'pending',
        students: 0,
        staff: 0,
        parents: 0,
        cardUsage: 0,
        walletActivity: 'low',
        totalTransactions: 0,
        attendance: 0,
        lastActivity: 'Just now',
        establishedDate: new Date().toISOString().split('T')[0],
        features: {
          fastScan: false, liveVerification: false, usbCamera: false, qrCode: false, nfcReader: false,
          attendance: false, wallet: false, library: false, clinic: false, events: false, notifications: false, analytics: false
        }
      })
      setShowAddForm(false)
      setCurrentStep(0)
      setWizardFormData({
        name: '', subdomain: '', address: '', email: '', phone: '', principalName: '', principalEmail: '', subscriptionPlan: 'basic'
      })
    }
  }

  const updateWizardField = (field: string, value: string) => {
    setWizardFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const openSchoolDetails = (school: School) => {
    const staffList = getSchoolStaff(school.id)
    const studentList = getSchoolStudents(school.id)
    const parentList = getSchoolParents(school.id)

    const schoolDetails: SchoolDetailsModal = {
      ...school,
      staffList: staffList.map(s => ({ id: s.id, name: s.name, role: s.role, email: s.email })),
      studentList: studentList.map(s => ({ id: s.id, name: s.name, class: s.class, cardStatus: s.cardStatus })),
      parentList: parentList.map(p => ({ id: p.id, name: p.name, contact: p.phone, email: p.email })),
      recentActivities: [
        { id: '1', type: 'gate', description: `${school.students} students scanned at gate`, time: '2 mins ago' },
        { id: '2', type: 'wallet', description: `Wallet transaction: $${school.totalTransactions}`, time: '5 mins ago' },
        { id: '3', type: 'attendance', description: `Attendance recorded: ${school.attendance}%`, time: '8 mins ago' },
      ],
    }
    setSelectedSchool(schoolDetails)
  }

  const toggleStatus = (id: string) => {
    const school = schools.find(s => s.id === id)
    if (school) {
      updateSchool(id, { status: school.status === 'active' ? 'disabled' : 'active' })
    }
  }

  const handleAddSchool = () => {
    if (!formData.name || !formData.subdomain || !formData.email) {
      alert('Please fill in all required fields')
      return
    }
    
    addSchool({
      ...formData,
      status: 'pending',
      students: 0,
      staff: 0,
      parents: 0,
      cardUsage: 0,
      walletActivity: 'low',
      totalTransactions: 0,
      attendance: 0,
      lastActivity: 'Just now',
      establishedDate: new Date().toISOString().split('T')[0],
      features: {
        fastScan: false, liveVerification: false, usbCamera: false, qrCode: false, nfcReader: false,
        attendance: false, wallet: false, library: false, clinic: false, events: false, notifications: false, analytics: false
      }
    })

    setFormData({
      name: '', subdomain: '', email: '', phone: '', address: '', principalName: '', principalEmail: '', subscriptionPlan: 'basic'
    })
    setShowAddForm(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-primary/10 text-primary'
      case 'disabled': return 'bg-destructive/10 text-destructive'
      case 'pending': return 'bg-yellow-500/10 text-yellow-600'
      default: return 'bg-secondary'
    }
  }

  return (
    <DashboardLayout currentPage="schools" role="super-user">
    <div className="flex h-screen bg-background">
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Schools Management</h1>
                <p className="text-muted-foreground">Manage all schools in the Cardlect ecosystem</p>
              </div>
              <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-all">
                <Plus size={18} />
                Add School
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground text-sm">Total Schools</p>
                  <Activity size={20} className="text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground">{schools.length}</p>
                <p className="text-primary text-xs mt-2">{schools.filter(s => s.status === 'active').length} active</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground text-sm">Total Students</p>
                  <Users size={20} className="text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground">{schools.reduce((sum, s) => sum + s.students, 0).toLocaleString()}</p>
                <p className="text-primary text-xs mt-2">Across all schools</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground text-sm">Avg Card Usage</p>
                  <TrendingUp size={20} className="text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground">{Math.round(schools.filter(s => s.status === 'active').reduce((sum, s) => sum + s.cardUsage, 0) / Math.max(schools.filter(s => s.status === 'active').length, 1))}%</p>
                <p className="text-primary text-xs mt-2">System-wide average</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground text-sm">Transactions Today</p>
                  <Activity size={20} className="text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground">{schools.reduce((sum, s) => sum + s.totalTransactions, 0).toLocaleString()}</p>
                <p className="text-primary text-xs mt-2">All activity</p>
              </div>
            </div>

            {showAddForm && (
              <div
                role="dialog"
                aria-modal="true"
                className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
              >
                {/* Backdrop */}
                <div
                  onClick={() => setShowAddForm(false)}
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                />

                {/* Modal */}
                <div className="relative w-full max-w-lg md:max-w-6xl bg-background border border-border rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col md:grid md:grid-cols-12 max-h-[90vh]">
                  {/* Left sidebar: Steps */}
                  <aside className="col-span-12 md:col-span-4 lg:col-span-3 bg-secondary/5 p-4 md:p-6 flex md:flex-col flex-row md:gap-6 gap-2 items-center md:items-start">
                    <div className="flex items-center justify-between w-full md:block">
                      <div>
                        <h2 className="text-base md:text-lg font-bold text-foreground">School Onboarding</h2>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1">Guided setup to get you started</p>
                      </div>

                      {/* close button for small screens */}
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="md:hidden p-2 rounded-md text-muted-foreground hover:bg-secondary/50 ml-2"
                        aria-label="Close onboarding"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <nav className="flex-1 flex md:flex-col flex-row gap-3 pt-2 overflow-auto w-full">
                      {wizardSteps.map((s, idx) => {
                        const isActive = idx === currentStep
                        const done = idx < currentStep
                        return (
                          <button
                            key={s.title}
                            onClick={() => {
                              if (done || isActive) setCurrentStep(idx)
                            }}
                            className={`shrink-0 min-w-[150px] md:w-full text-left flex items-center gap-3 p-3 rounded-lg transition ${
                              isActive ? 'bg-primary/10 border border-primary' : 'hover:bg-secondary/50'
                            } ${done ? 'opacity-90' : ''}`}
                          >
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${done ? 'bg-primary text-white' : isActive ? 'bg-primary/80 text-white' : 'bg-secondary/50 text-muted-foreground'}`}>
                              {done ? <Check size={16} /> : <span className="text-sm font-medium">{idx + 1}</span>}
                            </div>
                            <div className="truncate">
                              <div className={`text-sm font-medium truncate ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{s.title}</div>
                              <div className="text-xs text-muted-foreground truncate">{s.description}</div>
                            </div>
                          </button>
                        )
                      })}
                    </nav>

                    <div className="text-xs text-muted-foreground w-full md:mt-auto md:block hidden">
                      <div>Step {currentStep + 1} of {wizardSteps.length}</div>
                    </div>
                  </aside>

                  {/* Right content */}
                  <div className="col-span-12 md:col-span-8 lg:col-span-9 p-4 md:p-8 overflow-auto flex flex-col min-h-[420px]">
                    <div className="flex-1">
                      {currentStep === 0 && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">{wizardSteps[0].title}</h3>
                            <p className="text-sm text-muted-foreground mb-6">{wizardSteps[0].description}</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              School Name *
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., lagos international school"
                              value={wizardFormData.name}
                              onChange={(e) => updateWizardField('name', e.target.value)}
                              className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none  ${
                                errors.name ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
                              }`}
                            />
                            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                Subdomain * <span className="text-muted-foreground">.cardlect.io</span>
                              </label>
                              <input
                                type="text"
                                placeholder="e.g., lagosinternationalschool"
                                value={wizardFormData.subdomain}
                                onChange={(e) => updateWizardField('subdomain', e.target.value.toLowerCase())}
                                className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none ${
                                  errors.subdomain ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
                                }`}
                              />
                              {errors.subdomain && <p className="text-xs text-red-600 mt-1">{errors.subdomain}</p>}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                Address *
                              </label>
                              <input
                                type="text"
                                placeholder="123 Main Street, Lagos, Nigeria"
                                value={wizardFormData.address}
                                onChange={(e) => updateWizardField('address', e.target.value)}
                                className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none  ${
                                  errors.address ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
                                }`}
                              />
                              {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 1 && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">{wizardSteps[1].title}</h3>
                            <p className="text-sm text-muted-foreground mb-6">{wizardSteps[1].description}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                School Email *
                              </label>
                              <input
                                type="email"
                                placeholder="admin@school.edu"
                                value={wizardFormData.email}
                                onChange={(e) => updateWizardField('email', e.target.value)}
                                className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none  ${
                                  errors.email ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
                                }`}
                              />
                              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                School Phone *
                              </label>
                              <input
                                type="tel"
                                placeholder="+234 (555) 000-0000"
                                value={wizardFormData.phone}
                                onChange={(e) => updateWizardField('phone', e.target.value)}
                                className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none  ${
                                  errors.phone ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
                                }`}
                              />
                              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 2 && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">{wizardSteps[2].title}</h3>
                            <p className="text-sm text-muted-foreground mb-6">{wizardSteps[2].description}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                Principal Name *
                              </label>
                              <input
                                type="text"
                                placeholder="Dr. John Smith"
                                value={wizardFormData.principalName}
                                onChange={(e) => updateWizardField('principalName', e.target.value)}
                                className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none  ${
                                  errors.principalName ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
                                }`}
                              />
                              {errors.principalName && <p className="text-xs text-red-600 mt-1">{errors.principalName}</p>}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                Principal Email *
                              </label>
                              <input
                                type="email"
                                placeholder="principal@school.edu"
                                value={wizardFormData.principalEmail}
                                onChange={(e) => updateWizardField('principalEmail', e.target.value)}
                                className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none  ${
                                  errors.principalEmail ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
                                }`}
                              />
                              {errors.principalEmail && <p className="text-xs text-red-600 mt-1">{errors.principalEmail}</p>}
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 3 && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">{wizardSteps[3].title}</h3>
                            <p className="text-sm text-muted-foreground mb-6">{wizardSteps[3].description}</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Subscription Plan
                            </label>
                            <select
                              value={wizardFormData.subscriptionPlan}
                              onChange={(e) => updateWizardField('subscriptionPlan', e.target.value)}
                              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none  focus:ring-primary"
                            >
                              <option value="basic">Basic - Core features (NFC, Attendance, Wallet)</option>
                              <option value="premium">Premium - Basic + Live Verification & Analytics</option>
                              <option value="enterprise">Enterprise - All features including advanced modules</option>
                            </select>
                          </div>

                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-foreground mb-3">Review Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">School Name:</span>
                                <span className="text-foreground font-medium">{wizardFormData.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Subdomain:</span>
                                <span className="text-foreground font-medium">{wizardFormData.subdomain}.cardlect.io</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Principal:</span>
                                <span className="text-foreground font-medium">{wizardFormData.principalName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Plan:</span>
                                <span className="text-foreground font-medium capitalize">{wizardFormData.subscriptionPlan}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="w-full flex justify-between sm:justify-start gap-3">
                        <button
                          onClick={() => setShowAddForm(false)}
                          className="px-4 py-2 text-foreground hover:bg-secondary/50 rounded-lg transition-all w-full sm:w-auto"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={handleWizardPrevious}
                          disabled={currentStep === 0}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                          <ChevronLeft size={18} />
                          Previous
                        </button>
                      </div>

                      <div className="w-full sm:w-auto flex gap-3">
                        {currentStep < wizardSteps.length - 1 ? (
                          <button
                            onClick={handleWizardNext}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all w-full"
                          >
                            Next
                            <ChevronRight size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={handleWizardComplete}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all w-full"
                          >
                            <Check size={18} />
                            Create School
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">School</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Subdomain</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Students</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Staff</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Parents</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Card Usage</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Attendance</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schools.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-12 text-center text-muted-foreground">
                          No schools added yet. Create your first school to get started.
                        </td>
                      </tr>
                    ) : (
                      schools.map((school, idx) => (
                        <tr key={school.id} className={`${idx % 2 === 0 ? 'bg-secondary/20' : ''} border-b border-border hover:bg-secondary/40 transition-all`}>
                          <td className="px-6 py-4 text-sm text-foreground font-medium">
                              {school.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{school.subdomain}.cardlect.io</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(school.status)}`}>
                              {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-center text-foreground">{school.students}</td>
                          <td className="px-6 py-4 text-sm text-center text-foreground">{school.staff}</td>
                          <td className="px-6 py-4 text-sm text-center text-foreground">{school.parents}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-secondary rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: `${school.cardUsage}%` }} />
                              </div>
                              <span className="text-xs text-foreground">{school.cardUsage}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-center text-foreground font-medium">{school.attendance}%</td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-1">
                              <button onClick={() => router.push(`/super-user/school-details/${school.id}`)} className="p-1 hover:bg-secondary/50 rounded transition-all" title="View Details">
                                <Eye size={16} className="text-primary" />
                              </button>
                              <button onClick={() => router.push(`/super-user/school-details/${school.id}?tab=settings`)} className="p-1 hover:bg-secondary/50 rounded transition-all" title="Settings">
                                <Settings size={16} className="text-purple-600" />
                              </button>
                              <button onClick={() => toggleStatus(school.id)} className="p-1 hover:bg-secondary/50 rounded transition-all" title={school.status === 'active' ? 'Deactivate' : 'Activate'}>
                                {school.status === 'active' ? <Pause size={16} className="text-yellow-600" /> : <Play size={16} className="text-green-600" />}
                              </button>
                              <button onClick={() => deleteSchool(school.id)} className="p-1 hover:bg-secondary/50 rounded transition-all" title="Delete">
                                <Trash2 size={16} className="text-destructive" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {selectedSchool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">{selectedSchool.name}</h2>
              <button onClick={() => setSelectedSchool(null)} className="p-1 hover:bg-secondary/50 rounded">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-muted-foreground text-xs mb-1">Total Students</p>
                  <p className="text-2xl font-bold text-foreground">{selectedSchool.students}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-muted-foreground text-xs mb-1">Staff Members</p>
                  <p className="text-2xl font-bold text-foreground">{selectedSchool.staff}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-muted-foreground text-xs mb-1">Attendance Rate</p>
                  <p className="text-2xl font-bold text-primary">{selectedSchool.attendance}%</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-muted-foreground text-xs mb-1">Card Usage</p>
                  <p className="text-2xl font-bold text-primary">{selectedSchool.cardUsage}%</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <UserCheck size={20} className="text-primary" />
                  Staff Members ({selectedSchool.staffList.length})
                </h3>
                {selectedSchool.staffList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No staff members added yet.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedSchool.staffList.map(staff => (
                      <div key={staff.id} className="flex justify-between items-start p-3 bg-secondary/20 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{staff.name}</p>
                          <p className="text-xs text-muted-foreground">{staff.role}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{staff.email}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Users size={20} className="text-primary" />
                  Recent Students ({selectedSchool.studentList.length})
                </h3>
                {selectedSchool.studentList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No students registered yet.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedSchool.studentList.map(student => (
                      <div key={student.id} className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{student.name}</p>
                          <p className="text-xs text-muted-foreground">Class: {student.class}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${student.cardStatus === 'active' || student.cardStatus === 'issued' ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'}`}>
                          {student.cardStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Users size={20} className="text-primary" />
                  Linked Parents ({selectedSchool.parentList.length})
                </h3>
                {selectedSchool.parentList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No parents linked yet.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedSchool.parentList.map(parent => (
                      <div key={parent.id} className="flex justify-between items-start p-3 bg-secondary/20 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{parent.name}</p>
                          <p className="text-xs text-muted-foreground">{parent.contact}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{parent.email}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Activity size={20} className="text-primary" />
                  Recent Activities
                </h3>
                <div className="space-y-3">
                  {selectedSchool.recentActivities.map(activity => (
                    <div key={activity.id} className="flex justify-between items-start p-3 bg-secondary/20 rounded-lg">
                      <p className="text-sm text-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Settings size={20} className="text-primary" />
                  Management Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={() => router.push(`/student-registration?schoolId=${selectedSchool.id}`)} className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-all text-sm font-medium">
                    Register Students
                  </button>
                  <button onClick={() => router.push(`/staff-management?schoolId=${selectedSchool.id}`)} className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-all text-sm font-medium">
                    Manage Staff
                  </button>
                  <button onClick={() => router.push(`/parent-management?schoolId=${selectedSchool.id}`)} className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-all text-sm font-medium">
                    Manage Parents
                  </button>
                  <button onClick={() => router.push(`/school-config?schoolId=${selectedSchool.id}`)} className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-all text-sm font-medium">
                    School Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
