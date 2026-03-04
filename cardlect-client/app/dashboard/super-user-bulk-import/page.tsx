"use client"

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Upload, Download, Plus, CheckCircle, AlertCircle, Loader2, FileSpreadsheet, Building2, Check, ExternalLink } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'
import { Button } from "@/components/ui/button"

type ImportType = 'students' | 'staff' | 'parents'

export default function BulkImportPage() {
  const router = useRouter()
  const [schools, setSchools] = useState<any[]>([])
  const [importType, setImportType] = useState<ImportType>('students')
  const [schoolId, setSchoolId] = useState('')
  const [csvContent, setCsvContent] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [importResult, setImportResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await api.get('/schools')
        setSchools(response.data.data)
      } catch (err) {
        console.error('Failed to fetch schools')
      }
    }
    fetchSchools()
  }, [])

  const downloadTemplate = () => {
    let csvTemplate = ''
    if (importType === 'students') {
      csvTemplate = `full_name,admission_number,class_name,email,phone,date_of_birth,parent_emails\nAlice Johnson,STU-001,10A,alice@school.edu,9876543210,2009-03-15,parent1@email.com`
    } else if (importType === 'staff') {
      csvTemplate = `full_name,role,email,phone,department\nMr. John Smith,teacher,john@school.edu,9876543220,Science`
    } else {
      csvTemplate = `full_name,email,phone,relationship,linked_students\nMr. Robert Johnson,robert@email.com,9876543230,father,STU-001`
    }

    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvTemplate))
    element.setAttribute('download', `${importType}_template.csv`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => setCsvContent(event.target?.result as string)
      reader.readAsText(file)
    }
  }

  const processImport = async () => {
    if (!schoolId) return alert('Institutional node assignment required.')
    setIsProcessing(true)

    const lines = csvContent.trim().split('\n')
    if (lines.length < 2) return setIsProcessing(false)

    const headers = lines[0].split(',').map(h => h.trim())
    const usersData = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const user: any = { role: importType === 'students' ? 'student' : importType === 'staff' ? 'teacher' : 'parent' }
      headers.forEach((h, idx) => { user[h] = values[idx] })
      usersData.push(user)
    }

    try {
      const response = await api.post('/users/bulk-create', { users: usersData, schoolId })
      setImportResult(response.data.data)
      setCsvContent('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err: any) {
      alert(`Deployment Error: ${err.response?.data?.message || err.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <DashboardLayout currentPage="bulk-import" role="super_admin">
      <div className="space-y-10 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-foreground tracking-tighter">Mass Enrollment Core</h2>
            <p className="text-muted-foreground mt-1 font-medium italic">Integrated CSV ingestion for large-scale institutional population mapping.</p>
          </div>
          <Button
            className="bg-primary hover:bg-primary-darker text-white rounded-2xl h-14 px-8 font-black shadow-lg shadow-primary/20 active:scale-95 transition-all"
            onClick={downloadTemplate}
          >
            <Download size={20} className="mr-2" /> Global Template
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border border-border rounded-[2.5rem] p-10 shadow-sm space-y-8">
              <div className="flex items-center gap-4 p-2 bg-muted rounded-[1.8rem]">
                {(['students', 'staff', 'parents'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => { setImportType(type); setImportResult(null) }}
                    className={`flex-1 py-4 rounded-[1.4rem] font-black text-xs uppercase tracking-widest transition-all ${importType === type ? 'bg-white shadow-xl text-primary' : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                <div className="relative group">
                  <Building2 className="absolute left-6 top-6 text-muted-foreground group-focus-within:text-primary transition-all" size={24} />
                  <select
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    className="w-full bg-muted/40 border-2 border-transparent focus:border-primary/30 rounded-3xl p-6 pl-16 text-xl font-black outline-none appearance-none transition-all"
                  >
                    <option value="">Target Institutional Node...</option>
                    {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div className="relative group">
                  <textarea
                    value={csvContent}
                    onChange={(e) => setCsvContent(e.target.value)}
                    placeholder="Raw CSV Protocol Buffer (Paste data here or ingest via file uplink)"
                    className="w-full h-80 bg-muted/40 border-2 border-transparent focus:border-primary/30 rounded-[2rem] p-8 text-sm font-mono font-bold outline-none transition-all resize-none placeholder:text-muted-foreground/30"
                  />
                  <div className="absolute right-6 bottom-6 flex gap-3">
                    <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                    <Button
                      variant="outline"
                      className="rounded-2xl h-12 px-6 font-black border-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={18} className="mr-2" /> Local Uplink
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary-darker text-white rounded-[1.8rem] h-20 font-black text-lg shadow-2xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
                  onClick={processImport}
                  disabled={!csvContent || !schoolId || isProcessing}
                >
                  {isProcessing ? <Loader2 className="animate-spin" /> : <><Plus size={24} className="mr-3" /> Execute Mass Enrollment Protocol</>}
                </Button>
              </div>
            </div>

            {importResult && (
              <div className={`bg-card border-l-8 rounded-[2rem] p-10 shadow-xl animate-in slide-in-from-bottom-4 duration-500 ${importResult.failed === 0 ? 'border-green-500' : 'border-amber-500'}`}>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-foreground">Ingestion Report</h3>
                  <div className="flex gap-4">
                    <div className="text-center bg-green-500/10 px-6 py-2 rounded-2xl border border-green-500/20">
                      <p className="text-[10px] font-black uppercase text-green-600 tracking-widest">Successful</p>
                      <p className="text-xl font-black text-green-700">{importResult.success}</p>
                    </div>
                    <div className="text-center bg-amber-500/10 px-6 py-2 rounded-2xl border border-amber-500/20">
                      <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest">Failed</p>
                      <p className="text-xl font-black text-amber-700">{importResult.failed}</p>
                    </div>
                  </div>
                </div>
                {importResult.errors.length > 0 && (
                  <div className="bg-muted/30 rounded-[1.5rem] p-6 max-h-48 overflow-y-auto space-y-2 border border-border">
                    {importResult.errors.map((e, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                        <AlertCircle size={14} className="text-amber-500" /> {e}
                      </div>
                    ))}
                  </div>
                )}
                <Button variant="ghost" className="mt-8 font-black uppercase tracking-widest text-[10px]" onClick={() => setImportResult(null)}>Dissmiss Report</Button>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-10">
              <div className="flex items-center gap-3 mb-6">
                <FileSpreadsheet className="text-primary" size={24} />
                <h3 className="text-lg font-black text-primary tracking-tight">CSV Protocol Specs</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'students', spec: 'full_name, admission_number, class_name, email, phone' },
                  { label: 'staff', spec: 'full_name, role, email, phone, department' },
                  { label: 'parents', spec: 'full_name, email, phone, relationship, linked_students' }
                ].map(spec => (
                  <div key={spec.label} className={`p-4 rounded-2xl border transition-all ${importType === spec.label ? 'bg-white border-primary shadow-lg scale-105' : 'bg-white/50 border-transparent opacity-60'}`}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{spec.label}</p>
                    <code className="text-xs font-bold break-all">{spec.spec}</code>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-[2.5rem] p-10 space-y-6">
              <h3 className="font-black text-foreground">Infrastructure Tips</h3>
              <div className="space-y-4">
                {[
                  'Validated templates ensure zero-latency ingestion.',
                  'Mass operations are strictly multi-tenant isolated.',
                  'Linked IDs must match existing node records.',
                  'Audit logs capture all ingestion metadata.'
                ].map((tip, i) => (
                  <div key={i} className="flex gap-4">
                    <Check size={16} className="text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-sm font-bold text-muted-foreground leading-snug">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" className="w-full rounded-3xl h-16 border-2 font-black uppercase tracking-widest text-[10px] gap-2">
              <ExternalLink size={16} /> Technical Documentation
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
