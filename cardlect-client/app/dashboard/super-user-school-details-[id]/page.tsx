'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { useRouter, useParams } from 'next/navigation'
import { X, Edit2, Save, Users, UserCheck, BookOpen, Settings, Activity, TrendingUp, Wifi, HardDrive, Lock, Bell, Zap, BarChart3, MapPin, Mail, Phone, Calendar, Check, AlertCircle, Server, Shield, Trash2, Plus } from 'lucide-react'
import { useCardlect, School } from '@/contexts/cardlect-context'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'

export default function SchoolDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const { schools, getSchoolStudents, getSchoolStaff, getSchoolParents, updateSchool, addDevice } = useCardlect()
  
  const schoolId = params?.id as string
  const school = schools.find(s => s.id === schoolId)
  
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(school || {})
  const [activeTab, setActiveTab] = useState<'overview' | 'people' | 'hardware' | 'features' | 'settings'>('overview')
  const [showDeviceForm, setShowDeviceForm] = useState(false)
  const [deviceForm, setDeviceForm] = useState({
    name: '',
    type: 'NFC Reader' as 'NFC Reader' | 'USB Camera',
    location: '',
    battery: 100,
  })

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const tabParam = searchParams.get('tab') as any
    if (tabParam && ['overview', 'people', 'hardware', 'features', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [])

  if (!school) {
    return (
      <DashboardLayout currentPage="schools" role="super-user">
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex flex-col">
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">School not found</p>
              <button onClick={() => router.push('/super-user/schools')} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                Back to Schools
              </button>
            </div>
          </main>
        </div>
      </div>
      </DashboardLayout>
    )
  }

  const students = getSchoolStudents(schoolId)
  const staff = getSchoolStaff(schoolId)
  const parents = getSchoolParents(schoolId)

  const handleSave = () => {
    updateSchool(schoolId, editData)
    setIsEditing(false)
  }

  const handleAddDevice = () => {
    if (deviceForm.name && deviceForm.location) {
      addDevice({
        schoolId,
        name: deviceForm.name,
        type: deviceForm.type,
        location: deviceForm.location,
        status: 'active',
        battery: deviceForm.battery,
        firmwareVersion: '1.0.0',
        lastSync: 'Just now'
      })
      setDeviceForm({ name: '', type: 'NFC Reader', location: '', battery: 100 })
      setShowDeviceForm(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return { color: CARDLECT_COLORS.success.main, backgroundColor: `${CARDLECT_COLORS.success.main}20`, borderColor: `${CARDLECT_COLORS.success.main}40` }
      case 'disabled': return { color: CARDLECT_COLORS.danger.main, backgroundColor: `${CARDLECT_COLORS.danger.main}20`, borderColor: `${CARDLECT_COLORS.danger.main}40` }
      case 'pending': return { color: CARDLECT_COLORS.warning.main, backgroundColor: `${CARDLECT_COLORS.warning.main}20`, borderColor: `${CARDLECT_COLORS.warning.main}40` }
      default: return { color: '#6B7280', backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' }
    }
  }

  const allFeatures = Object.entries(school.features).map(([key, enabled]) => ({
    key,
    name: key.replace(/([A-Z])/g, ' $1').trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    enabled
  }))

  const enabledFeatures = allFeatures.filter(f => f.enabled)
  const disabledFeatures = allFeatures.filter(f => !f.enabled)

  return (
    <DashboardLayout currentPage="schools" role="super-user">
    <div className="flex h-screen bg-background">
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-foreground">{school.name}</h1>
                    <span style={{
                      ...getStatusColor(school.status),
                      padding: '0.75rem 1rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      border: `1px solid ${getStatusColor(school.status).borderColor}`
                    }}>
                      {school.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{school.address}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => router.push(`super-user/school-config?schoolId=${schoolId}`)} className="flex items-center gap-2 px-3 py-2 text-sm bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-all">
                    <BookOpen size={16} />
                    Plan
                  </button>
                  <button onClick={() => setActiveTab('hardware')} className="flex items-center gap-2 px-3 py-2 text-sm bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-all">
                    <Server size={16} />
                    Hardware
                  </button>
                  <button onClick={() => setActiveTab('features')} className="flex items-center gap-2 px-3 py-2 text-sm bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-all">
                    <Zap size={16} />
                    Features
                  </button>
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                      <Edit2 size={18} />
                      Edit
                    </button>
                  ) : (
                    <>
                      <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90" style={{ backgroundColor: CARDLECT_COLORS.success.main }}>
                        <Save size={18} />
                        Save
                      </button>
                      <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80">
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Students</p>
                  <p className="text-2xl font-bold text-foreground">{school.students}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Staff</p>
                  <p className="text-2xl font-bold text-foreground">{school.staff}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Parents</p>
                  <p className="text-2xl font-bold text-foreground">{school.parents}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Attendance</p>
                  <p className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.primary.darker }}>{school.attendance}%</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Card Usage</p>
                  <p className="text-2xl font-bold" style={{ color: CARDLECT_COLORS.primary.darker }}>{school.cardUsage}%</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Transactions</p>
                  <p className="text-2xl font-bold text-foreground">{school.totalTransactions}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-border overflow-x-auto">
              {['overview', 'people', 'hardware', 'features', 'settings'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-3 font-medium text-sm transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab
                      ? 'text-primary border-primary'
                      : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <MapPin size={20} className="text-primary" />
                      School Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-foreground font-medium">{school.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-foreground font-medium">{school.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Subdomain</p>
                        <p className="text-foreground font-medium">{school.subdomain}.cardlect.io</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Established Date</p>
                        <p className="text-foreground font-medium">{new Date(school.establishedDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <UserCheck size={20} className="text-primary" />
                      Principal Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Name</p>
                        <p className="text-foreground font-medium">{school.principalName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-foreground font-medium">{school.principalEmail}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Subscription Plan</p>
                        <p className="text-foreground font-medium capitalize">{school.subscriptionPlan}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Activity</p>
                        <p className="text-foreground font-medium">{school.lastActivity}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <BarChart3 size={20} className="text-primary" />
                    Performance Metrics
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Attendance Rate</span>
                        <span className="text-sm font-semibold" style={{ color: CARDLECT_COLORS.primary.darker }}>{school.attendance}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="h-2 rounded-full" style={{ width: `${school.attendance}%`, backgroundColor: CARDLECT_COLORS.primary.darker }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Card Usage</span>
                        <span className="text-sm font-semibold" style={{ color: CARDLECT_COLORS.primary.darker }}>{school.cardUsage}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="h-2 rounded-full" style={{ width: `${school.cardUsage}%`, backgroundColor: CARDLECT_COLORS.primary.darker }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'people' && (
              <div className="space-y-6">
                {/* Students */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Users size={20} className="text-primary" />
                      Students ({students.length})
                    </h3>
                    <button onClick={() => router.push(`/super-user/student-registration?schoolId=${schoolId}`)} className="flex items-center gap-2 px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90">
                      <Plus size={16} />
                      Manage Student
                    </button>
                  </div>
                  {students.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No students registered yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {students.map(student => (
                        <div key={student.id} className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-all">
                          <div>
                            <p className="font-medium text-foreground">{student.name}</p>
                            <p className="text-xs text-muted-foreground">Class {student.class} • {student.admissionNo}</p>
                          </div>
                          <span style={{
                            color: student.cardStatus === 'issued' ? CARDLECT_COLORS.success.main : CARDLECT_COLORS.warning.main,
                            backgroundColor: student.cardStatus === 'issued' ? `${CARDLECT_COLORS.success.main}20` : `${CARDLECT_COLORS.warning.main}20`,
                            padding: '0.5rem 0.5rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {student.cardStatus}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Staff */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <UserCheck size={20} className="text-primary" />
                      Staff Members ({staff.length})
                    </h3>
                    <button onClick={() => router.push('/super-user/staff-management')} className="flex items-center gap-2 px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90">
                      <Plus size={16} />
                      Manage Staffs
                    </button>
                  </div>
                  {staff.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No staff members added yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {staff.map(member => (
                        <div key={member.id} className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-all">
                          <div>
                            <p className="font-medium text-foreground">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role} • {member.department}</p>
                          </div>
                          <span style={{
                            color: member.status === 'active' ? CARDLECT_COLORS.success.main : CARDLECT_COLORS.danger.main,
                            backgroundColor: member.status === 'active' ? `${CARDLECT_COLORS.success.main}20` : `${CARDLECT_COLORS.danger.main}20`,
                            padding: '0.5rem 0.5rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {member.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {activeTab === 'hardware' && (
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Server size={20} className="text-primary" />
                      Hardware Devices ({school.hardware?.length || 0})
                    </h3>
                    <button 
                      onClick={() => setShowDeviceForm(!showDeviceForm)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
                    >
                      <Plus size={18} />
                      Add Device
                    </button>
                  </div>

                  {showDeviceForm && (
                    <div className="bg-secondary/20 border border-border rounded-lg p-4 mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-foreground">Register New Device</h4>
                        <button onClick={() => setShowDeviceForm(false)} className="text-muted-foreground hover:text-foreground">
                          <X size={20} />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Device Name</label>
                          <input
                            type="text"
                            placeholder="e.g., Main Gate NFC Reader"
                            value={deviceForm.name}
                            onChange={(e) => setDeviceForm({ ...deviceForm, name: e.target.value })}
                            className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1">Device Type</label>
                            <select
                              value={deviceForm.type}
                              onChange={(e) => setDeviceForm({ ...deviceForm, type: e.target.value as any })}
                              className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              <option>NFC Reader</option>
                              <option>USB Camera</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1">Battery %</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={deviceForm.battery}
                              onChange={(e) => setDeviceForm({ ...deviceForm, battery: parseInt(e.target.value) })}
                              className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Location</label>
                          <input
                            type="text"
                            placeholder="e.g., Main Entrance"
                            value={deviceForm.location}
                            onChange={(e) => setDeviceForm({ ...deviceForm, location: e.target.value })}
                            className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleAddDevice}
                            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-all"
                          >
                            Add Device
                          </button>
                          <button
                            onClick={() => setShowDeviceForm(false)}
                            className="px-4 py-2 bg-secondary text-foreground rounded text-sm font-medium hover:bg-secondary/80 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Device List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {school.hardware && school.hardware.length > 0 ? (
                      school.hardware.map((device: any) => (
                        <div key={device.id} className="border border-border rounded-lg p-4 hover:border-primary/50 transition-all">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-medium text-foreground">{device.name}</p>
                              <p className="text-xs text-muted-foreground">{device.type}</p>
                            </div>
                            <span style={{
                              color: device.status === 'active' ? CARDLECT_COLORS.success.main : CARDLECT_COLORS.danger.main,
                              backgroundColor: device.status === 'active' ? `${CARDLECT_COLORS.success.main}20` : `${CARDLECT_COLORS.danger.main}20`,
                              padding: '0.5rem 0.5rem',
                              borderRadius: '0.375rem',
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}>
                              {device.status}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm mb-3">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Battery</span>
                              <span className="text-foreground font-medium">{device.battery}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Location</span>
                              <span className="text-foreground font-medium">{device.location}</span>
                            </div>
                            {device.lastSync && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Last Sync</span>
                                <span className="text-foreground font-medium text-xs">{device.lastSync}</span>
                              </div>
                            )}
                          </div>
                          <button 
                            onClick={() => {
                              const updated = { ...school, hardware: school.hardware?.filter((d: any) => d.id !== device.id) }
                              updateSchool(schoolId, updated)
                            }}
                            style={{
                              width: '100%',
                              padding: '0.5rem 0.5rem',
                              fontSize: '0.75rem',
                              backgroundColor: `${CARDLECT_COLORS.danger.main}20`,
                              color: CARDLECT_COLORS.danger.main,
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              border: 'none',
                              fontWeight: '500',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = `${CARDLECT_COLORS.danger.main}30`}}
                            onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = `${CARDLECT_COLORS.danger.main}20`}}
                          >
                            Remove Device
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <Server size={40} className="mx-auto text-muted-foreground mb-2 opacity-50" />
                        <p className="text-muted-foreground">No devices configured yet. Add your first device to get started.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Zap size={20} className="text-primary" />
                    Feature Management
                  </h3>
                  <div className="mb-6 flex gap-2">
                    <button 
                      onClick={() => {
                        const allEnabled = Object.values(school.features).every(f => f)
                        if (!allEnabled) {
                          const updatedFeatures = Object.keys(school.features).reduce((acc, key) => ({ ...acc, [key]: true }), {})
                          updateSchool(schoolId, { features: updatedFeatures })
                        }
                      }}
                      style={{
                        backgroundColor: `${CARDLECT_COLORS.success.main}20`,
                        color: CARDLECT_COLORS.success.main,
                        borderColor: `${CARDLECT_COLORS.success.main}40`,
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        border: `1px solid`,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = `${CARDLECT_COLORS.success.main}30`}}
                      onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = `${CARDLECT_COLORS.success.main}20`}}
                      className="text-sm font-medium"
                    >
                      Enable All
                    </button>
                    <button 
                      onClick={() => {
                        const allDisabled = Object.values(school.features).every(f => !f)
                        if (!allDisabled) {
                          const updatedFeatures = Object.keys(school.features).reduce((acc, key) => ({ ...acc, [key]: false }), {})
                          updateSchool(schoolId, { features: updatedFeatures })
                        }
                      }}
                      style={{
                        backgroundColor: `${CARDLECT_COLORS.danger.main}20`,
                        color: CARDLECT_COLORS.danger.main,
                        borderColor: `${CARDLECT_COLORS.danger.main}40`,
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        border: `1px solid`,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = `${CARDLECT_COLORS.danger.main}30`}}
                      onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = `${CARDLECT_COLORS.danger.main}20`}}
                      className="text-sm font-medium"
                    >
                      Disable All
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allFeatures.map(feature => (
                      <div key={feature.key} className={`flex items-center justify-between p-4 rounded-lg border transition-all`} style={{
                        backgroundColor: feature.enabled ? `${CARDLECT_COLORS.success.main}20` : '#F3F4F6',
                        borderColor: feature.enabled ? `${CARDLECT_COLORS.success.main}40` : '#E5E7EB'
                      }}>
                        <div className="flex items-center gap-3">
                          {feature.enabled ? (
                            <Check size={18} style={{ color: CARDLECT_COLORS.success.main }} />
                          ) : (
                            <AlertCircle size={18} className="text-muted-foreground" />
                          )}
                          <span style={{
                            fontWeight: '500',
                            color: feature.enabled ? '#1F2937' : '#6B7280'
                          }}>
                            {feature.name}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const updatedFeatures = { ...school.features, [feature.key]: !feature.enabled }
                            updateSchool(schoolId, { features: updatedFeatures })
                          }}
                          style={{
                            backgroundColor: feature.enabled ? CARDLECT_COLORS.success.main : '#4B5563',
                            color: 'white',
                            padding: '0.75rem 0.75rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            border: 'none',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '0.8'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '1'
                          }}
                        >
                          {feature.enabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div style={{
                    backgroundColor: `${CARDLECT_COLORS.success.main}20`,
                    borderColor: `${CARDLECT_COLORS.success.main}40`,
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    border: '1px solid'
                  }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: CARDLECT_COLORS.success.main, marginBottom: '0.5rem' }}>Enabled</h4>
                    <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1F2937' }}>{enabledFeatures.length}/{allFeatures.length}</p>
                  </div>
                  <div style={{
                    backgroundColor: `${CARDLECT_COLORS.warning.main}20`,
                    borderColor: `${CARDLECT_COLORS.warning.main}40`,
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    border: '1px solid'
                  }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: CARDLECT_COLORS.warning.main, marginBottom: '0.5rem' }}>Disabled</h4>
                    <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1F2937' }}>{disabledFeatures.length}/{allFeatures.length}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                {isEditing ? (
                  <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Edit School Information</h3>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">School Name</label>
                      <input
                        type="text"
                        value={(editData as any).name || ''}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value } as any)}
                        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                        <input
                          type="email"
                          value={(editData as any).email || ''}
                          onChange={(e) => setEditData({ ...editData, email: e.target.value } as any)}
                          className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                        <input
                          type="tel"
                          value={(editData as any).phone || ''}
                          onChange={(e) => setEditData({ ...editData, phone: e.target.value } as any)}
                          className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Address</label>
                      <input
                        type="text"
                        value={(editData as any).address || ''}
                        onChange={(e) => setEditData({ ...editData, address: e.target.value } as any)}
                        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Principal Name</label>
                        <input
                          type="text"
                          value={(editData as any).principalName || ''}
                          onChange={(e) => setEditData({ ...editData, principalName: e.target.value } as any)}
                          className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Principal Email</label>
                        <input
                          type="email"
                          value={(editData as any).principalEmail || ''}
                          onChange={(e) => setEditData({ ...editData, principalEmail: e.target.value } as any)}
                          className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-card border border-border rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Settings size={20} className="text-primary" />
                        School Configuration
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subscription Plan</span>
                          <span className="font-medium text-foreground capitalize">{school.subscriptionPlan}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status</span>
                          <span className="font-medium text-foreground capitalize">{school.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Established</span>
                          <span className="font-medium text-foreground">{new Date(school.establishedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      backgroundColor: `${CARDLECT_COLORS.danger.main}20`,
                      borderColor: `${CARDLECT_COLORS.danger.main}40`,
                      borderRadius: '0.5rem',
                      padding: '1.5rem',
                      border: `1px solid`
                    }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: CARDLECT_COLORS.danger.main, marginBottom: '1rem' }}>Danger Zone</h3>
                      <p style={{ fontSize: '0.875rem', color: `${CARDLECT_COLORS.danger.main}80`, marginBottom: '1rem' }}>Deleting a school will remove all associated data permanently.</p>
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: CARDLECT_COLORS.danger.main,
                        color: 'white',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        border: 'none',
                        transition: 'opacity 0.2s'
                      }}
                        onMouseEnter={(e) => {e.currentTarget.style.opacity = '0.8'}}
                        onMouseLeave={(e) => {e.currentTarget.style.opacity = '1'}}
                      >
                        <Trash2 size={18} />
                        Delete School
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </DashboardLayout>
  )
}
