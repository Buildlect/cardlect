'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LayoutShell } from "@/components/SuperAdmin/layout.shell"
import { Plus, Upload, Camera, LinkIcon, Tag, Trash2, Edit2 } from 'lucide-react'
import { useCardlect } from '@/contexts/cardlect-context'

export default function StudentRegistrationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { students, addStudent, updateStudent, deleteStudent, getSchoolStudents, schools } = useCardlect()
  
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [schoolId, setSchoolId] = useState<string>(searchParams?.get('schoolId') || '')
  const [showAddForm, setShowAddForm] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [schoolStudents, setSchoolStudents] = useState(students.filter(s => s.schoolId === schoolId))
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [formData, setFormData] = useState({
    name: '', admissionNo: '', class: '', email: '', phone: '', dateOfBirth: '', parentEmails: '', imageData: ''
  })

  useEffect(() => {
    setSchoolStudents(getSchoolStudents(schoolId))
  }, [schoolId, students])

  // Prevent background scroll while modal open
  useEffect(() => {
    const prev = document.body.style.overflow
    if (showAddForm) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = prev
    return () => {
      document.body.style.overflow = prev
    }
  }, [showAddForm])

  // Cleanup camera stream on unmount or when camera closed
  useEffect(() => {
    return () => {
      stopStream()
    }
  }, [])

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      setStream(s)
      setCameraOpen(true)
      if (videoRef.current) {
        videoRef.current.srcObject = s
        videoRef.current.play().catch(() => {})
      }
    } catch (err) {
      console.error('Unable to access camera', err)
      alert('Unable to access camera. Please allow camera permissions or use a supported device.')
    }
  }

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop())
    }
    setStream(null)
    setCameraOpen(false)
  }

  // When the video element mounts or stream changes, ensure srcObject is set
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
      videoRef.current.play().catch(() => {})
    }
  }, [stream])

  const capturePhoto = () => {
    if (!videoRef.current) return
    const video = videoRef.current
    const w = video.videoWidth || 640
    const h = video.videoHeight || 480

    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas')
    }
    const canvas = canvasRef.current
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0, w, h)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setFormData({ ...formData, imageData: dataUrl })
    stopStream()
  }

  const handleAddStudent = () => {
    if (!formData.name || !formData.admissionNo || !schoolId) {
      alert('Please fill in required fields and select a school')
      return
    }

    addStudent({
      schoolId,
      name: formData.name,
      admissionNo: formData.admissionNo,
      class: formData.class || 'Unassigned',
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      parents: formData.parentEmails.split(',').map(e => e.trim()).filter(e => e),
      cardStatus: 'pending',
      imageVerified: false,
      enrollmentDate: new Date().toISOString().split('T')[0],
      // include imageData
      imageData: formData.imageData,
    } as any)

    setFormData({ name: '', admissionNo: '', class: '', email: '', phone: '', dateOfBirth: '', parentEmails: '', imageData: '' })
    setShowAddForm(false)
  }

  const getCardStatusColor = (status: string) => {
    switch (status) {
      case 'issued': return 'bg-green-500/10 text-green-600'
      case 'pending': return 'bg-yellow-500/10 text-yellow-600'
      case 'inactive': return 'bg-red-500/10 text-red-600'
      default: return 'bg-secondary'
    }
  }

  return (
    <LayoutShell currentPage="student-registration">
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Student Registration</h1>
                <p className="text-muted-foreground">Register students and issue cards with parent linking</p>
              </div>
              <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-all">
                <Plus size={18} />
                Add Student
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">Select School</label>
              <select value={schoolId} onChange={(e) => setSchoolId(e.target.value)} className="px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Choose a school...</option>
                {schools.map(school => (
                  <option key={school.id} value={school.id}>{school.name}</option>
                ))}
              </select>
            </div>

            {!schoolId ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <p className="text-muted-foreground mb-4">Select a school to view and register students</p>
              </div>
            ) : schoolStudents.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <p className="text-muted-foreground mb-4">No students registered in this school yet</p>
                <button onClick={() => setShowAddForm(true)} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
                  <Plus size={18} />
                  Register First Student
                </button>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-secondary/30">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Admission No.</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Class</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Card Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Image Verified</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schoolStudents.map((student, idx) => (
                        <tr key={student.id} className={`${idx % 2 === 0 ? 'bg-secondary/20' : ''} border-b border-border hover:bg-secondary/40 transition-all`}>
                          <td className="px-6 py-4 text-sm text-foreground font-medium">{student.name}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{student.admissionNo}</td>
                          <td className="px-6 py-4 text-sm text-foreground">{student.class}</td>
                          <td className="px-6 py-4 text-sm text-foreground">{student.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getCardStatusColor(student.cardStatus)}`}>
                              {student.cardStatus.charAt(0).toUpperCase() + student.cardStatus.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${student.imageVerified ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'}`}>
                              {student.imageVerified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex gap-2">
                              <button onClick={() => deleteStudent(student.id)} className="p-1 hover:bg-secondary/50 rounded transition-all">
                                <Trash2 size={16} className="text-destructive" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modal: Registration Form */}
            {showAddForm && schoolId && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                onClick={() => { setShowAddForm(false); stopStream() }}
              >
                <div
                  className="bg-card border border-border rounded-lg p-6 w-full max-w-4xl mx-2 shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                  role="dialog"
                  aria-modal="true"
                >
                  <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Register New Student</h2>
                  <button onClick={() => { setShowAddForm(false); stopStream() }} className="text-muted-foreground hover:text-foreground">Close</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Student Name *</label>
                    <input type="text" placeholder="John Paul" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Student ID. *</label>
                    <input type="text" placeholder="STU-001" value={formData.admissionNo} onChange={(e) => setFormData({...formData, admissionNo: e.target.value})} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <input type="email" placeholder="student@school.edu" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                    <input type="tel" placeholder="+234 (555) 000-0000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Class</label>
                    <select value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Select Class</option>
                    <option value="NUR-3">NUR-3</option>
                    <option value="NUR-2">NUR-2</option>
                    <option value="NUR-1">NUR-1</option>
                    <option value="PRI-5">PRI-5</option>
                    <option value="PRI-4">PRI-4</option>
                    <option value="PRI-3">PRI-3</option>
                    <option value="PRI-2">PRI-2</option>
                    <option value="PRI-1">PRI-1</option>
                    <option value="SS-3">SS-3</option>
                    <option value="SS-2">SS-2</option>
                    <option value="SS-1">SS-1</option>
                    <option value="JSS-3">JSS-3</option>
                    <option value="JSS-2">JSS-2</option>
                    <option value="JSS-1">JSS-1</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
                    <input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">Parent Emails (comma-separated)</label>
                    <input type="text" placeholder="parent1@email.com, parent2@email.com" value={formData.parentEmails} onChange={(e) => setFormData({...formData, parentEmails: e.target.value})} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  </div>

                  <div className="flex gap-3 justify-end items-center">
                  <div className="flex items-center gap-3">
                    {/* Capture Photo button with stronger hover effect */}
                    <button
                      onClick={startCamera}
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 hover:scale-105 transition-transform transition-colors"
                    >
                      <Camera size={18} />
                      Capture Photo
                    </button>

                    {/* Thumbnail preview if captured */}
                    {formData.imageData ? (
                      <img src={formData.imageData} alt="preview" className="w-16 h-12 object-cover rounded border border-border" />
                    ) : (
                      <div className="w-16 h-12 bg-secondary/50 rounded border border-border flex items-center justify-center text-xs text-muted-foreground">
                        No Photo
                      </div>
                    )}
                  </div>

                  <button onClick={handleAddStudent} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all">
                    <Tag size={18} />
                    Register & Issue Card
                  </button>
                  <button onClick={() => { setShowAddForm(false); stopStream() }} className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-all">
                    Cancel
                  </button>
                  </div>

                  {/* Camera overlay inside modal */}
                  {cameraOpen && (
                    <div className="mt-4 border border-border rounded-lg p-3 bg-secondary/60">
                      <div className="flex flex-col md:flex-row gap-4 items-center">
                        <video ref={videoRef} className="w-full max-w-md rounded bg-black" playsInline />
                        <div className="flex flex-col gap-2">
                          <button onClick={capturePhoto} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all">Capture</button>
                          <button onClick={() => stopStream()} className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-all">Close Camera</button>
                          <p className="text-xs text-muted-foreground">Make sure to allow camera access in your browser.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
    </LayoutShell>
  )
}
