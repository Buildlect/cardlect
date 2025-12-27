'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Upload, Download, Plus, CheckCircle, AlertCircle } from 'lucide-react'
import { useCardlect } from '@/contexts/cardlect-context'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'

type ImportType = 'students' | 'staff' | 'parents'

export default function BulkImportPage() {
  const router = useRouter()
  const { addStudent, addStaff, addParent, schools } = useCardlect()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [importType, setImportType] = useState<ImportType>('students')
  const [schoolId, setSchoolId] = useState('')
  const [csvContent, setCsvContent] = useState('')
  const [importResult, setImportResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const downloadTemplate = () => {
    let csvTemplate = ''
    
    if (importType === 'students') {
      csvTemplate = `Name,AdmissionNo,Class,Email,Phone,DateOfBirth,ParentEmails
Alice Johnson,STU-001,10A,alice@school.edu,9876543210,2009-03-15,parent1@email.com
Bob Chen,STU-002,10B,bob@school.edu,9876543211,2009-07-22,parent2@email.com
Carol Davis,STU-003,11A,carol@school.edu,9876543212,2008-05-10,parent3@email.com`
    } else if (importType === 'staff') {
      csvTemplate = `Name,Role,Email,Phone,Department
Mr. John Smith,Principal,john@school.edu,9876543220,Administration
Mrs. Sarah Johnson,Vice Principal,sarah@school.edu,9876543221,Administration
Mr. Michael Chen,IT Manager,michael@school.edu,9876543222,IT`
    } else {
      csvTemplate = `Name,Email,Phone,Relationship,LinkedStudents
Mr. Robert Johnson,robert@email.com,9876543230,Father,STU-001
Mrs. Emily Chen,emily@email.com,9876543231,Mother,STU-002
Mr. James Davis,james@email.com,9876543232,Father,STU-003`
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
      reader.onload = (event) => {
        const content = event.target?.result as string
        setCsvContent(content)
      }
      reader.readAsText(file)
    }
  }

  const processImport = () => {
    if (!schoolId) {
      alert('Please select a school')
      return
    }

    const lines = csvContent.trim().split('\n')
    if (lines.length < 2) {
      alert('CSV file must have header and at least one data row')
      return
    }

    const headers = lines[0].split(',').map(h => h.trim())
    const errors: string[] = []
    let successCount = 0

    try {
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        
        try {
          if (importType === 'students') {
            const [name, admissionNo, classRoom, email, phone, dateOfBirth, parentEmails] = values
            if (!name || !admissionNo) {
              errors.push(`Row ${i + 1}: Missing name or admission number`)
              continue
            }
            addStudent({
              schoolId,
              name,
              admissionNo,
              class: classRoom || 'Unassigned',
              email: email || '',
              phone: phone || '',
              dateOfBirth: dateOfBirth || '',
              parents: parentEmails ? parentEmails.split(';').map(e => e.trim()) : [],
              cardStatus: 'pending',
              imageVerified: false,
              enrollmentDate: new Date().toISOString().split('T')[0],
            })
            successCount++
          } else if (importType === 'staff') {
            const [name, role, email, phone, department] = values
            if (!name || !role) {
              errors.push(`Row ${i + 1}: Missing name or role`)
              continue
            }
            addStaff({
              schoolId,
              name,
              role,
              email: email || '',
              phone: phone || '',
              department: department || 'General',
              joinDate: new Date().toISOString().split('T')[0],
              status: 'active',
              permissions: [],
            })
            successCount++
          } else {
            const [name, email, phone, relationship, linkedStudents] = values
            if (!name || !email) {
              errors.push(`Row ${i + 1}: Missing name or email`)
              continue
            }
            addParent({
              schoolId,
              name,
              email,
              phone: phone || '',
              relationship: relationship || 'Parent',
              linkedStudents: linkedStudents ? linkedStudents.split(';').map(s => s.trim()) : [],
              verified: false,
            })
            successCount++
          }
        } catch (e) {
          errors.push(`Row ${i + 1}: ${(e as Error).message}`)
        }
      }

      setImportResult({ success: successCount, failed: errors.length, errors })
      setCsvContent('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (e) {
      alert(`Import failed: ${(e as Error).message}`)
    }
  }

  return (
    <DashboardLayout currentPage="bulk-import" role="super-user">
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Bulk Registration Import</h1>
              <p className="text-muted-foreground">Import & register multiple students, staff, or parents via CSV</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Import Configuration</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Import Type</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['students', 'staff', 'parents'] as const).map(type => (
                          <button
                            key={type}
                            onClick={() => {
                              setImportType(type)
                              setImportResult(null)
                            }}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              importType === type
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-foreground hover:bg-secondary/80'
                            }`}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Select School *</label>
                      <select value={schoolId} onChange={(e) => setSchoolId(e.target.value)} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="">Choose a school...</option>
                        {schools.map(school => (
                          <option key={school.id} value={school.id}>{school.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">CSV Content</label>
                      <textarea
                        value={csvContent}
                        onChange={(e) => setCsvContent(e.target.value)}
                        placeholder="Paste CSV content here or upload a file below"
                        className="w-full h-48 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-foreground mb-2">Or Upload CSV File</label>
                      <div className="flex gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".csv"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-all"
                        >
                          <Upload size={18} />
                          Choose File
                        </button>
                        <button
                          onClick={downloadTemplate}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-all"
                        >
                          <Download size={18} />
                          Template
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={processImport}
                      disabled={!csvContent || !schoolId}
                      className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Plus size={18} />
                      Import {importType}
                    </button>
                  </div>
                </div>

                {importResult && (
                  <div className="bg-card border rounded-lg p-6" style={{ borderColor: importResult.failed === 0 ? `${CARDLECT_COLORS.success.main}33` : `${CARDLECT_COLORS.warning.main}33`, backgroundColor: importResult.failed === 0 ? `${CARDLECT_COLORS.success.main}0D` : `${CARDLECT_COLORS.warning.main}0D` }}>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      {importResult.failed === 0 ? (
                        <><CheckCircle size={20} style={{ color: CARDLECT_COLORS.success.main }} /> Import Successful</>
                      ) : (
                        <><AlertCircle size={20} style={{ color: CARDLECT_COLORS.warning.main }} /> Import Completed with Errors</>
                      )}
                    </h3>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-foreground">Successfully Registered: <span className="font-semibold" style={{ color: CARDLECT_COLORS.success.main }}>{importResult.success}</span></p>
                      {importResult.failed > 0 && (
                        <p className="text-sm text-foreground">Failed: <span className="font-semibold" style={{ color: CARDLECT_COLORS.warning.main }}>{importResult.failed}</span></p>
                      )}
                    </div>
                    {importResult.errors.length > 0 && (
                      <div className="bg-secondary/30 rounded p-3 text-xs text-muted-foreground max-h-40 overflow-y-auto">
                        {importResult.errors.map((error, idx) => (
                          <div key={idx} className="mb-1">{error}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="border rounded-lg p-4" style={{ backgroundColor: `${CARDLECT_COLORS.info.main}19`, borderColor: `${CARDLECT_COLORS.info.main}33` }}>
                  <h3 className="font-semibold mb-2" style={{ color: CARDLECT_COLORS.info.main }}>CSV Format</h3>
                  <div className="text-xs space-y-1" style={{ color: `${CARDLECT_COLORS.info.main}CC` }}>
                    <p>First row must be headers</p>
                    <p>Required fields vary by type</p>
                    <p>Emails can be semicolon-separated for multiple values</p>
                    <p>Download template for correct format</p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-3">Import Tips</h3>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li>Use the provided templates for consistency</li>
                    <li>Validate data before importing</li>
                    <li>Import one type at a time</li>
                    <li>Check results and review errors</li>
                    <li>Use semicolons for linked data</li>
                  </ul>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-3">Column Reference</h3>
                  <div className="space-y-3 text-xs">
                    {importType === 'students' && (
                      <div className="space-y-2">
                        <p><span className="font-medium text-foreground">Name</span> - Student full name (required)</p>
                        <p><span className="font-medium text-foreground">AdmissionNo</span> - Unique ID (required)</p>
                        <p><span className="font-medium text-foreground">Class</span> - Class name (e.g., 10A)</p>
                        <p><span className="font-medium text-foreground">Email</span> - Student email</p>
                        <p><span className="font-medium text-foreground">Phone</span> - Contact number</p>
                        <p><span className="font-medium text-foreground">DateOfBirth</span> - YYYY-MM-DD format</p>
                        <p><span className="font-medium text-foreground">ParentEmails</span> - Semicolon-separated emails</p>
                      </div>
                    )}
                    {importType === 'staff' && (
                      <div className="space-y-2">
                        <p><span className="font-medium text-foreground">Name</span> - Staff name (required)</p>
                        <p><span className="font-medium text-foreground">Role</span> - Position title (required)</p>
                        <p><span className="font-medium text-foreground">Email</span> - Work email</p>
                        <p><span className="font-medium text-foreground">Phone</span> - Contact number</p>
                        <p><span className="font-medium text-foreground">Department</span> - Department name</p>
                      </div>
                    )}
                    {importType === 'parents' && (
                      <div className="space-y-2">
                        <p><span className="font-medium text-foreground">Name</span> - Parent name (required)</p>
                        <p><span className="font-medium text-foreground">Email</span> - Email address (required)</p>
                        <p><span className="font-medium text-foreground">Phone</span> - Contact number</p>
                        <p><span className="font-medium text-foreground">Relationship</span> - Parent/Guardian/Other</p>
                        <p><span className="font-medium text-foreground">LinkedStudents</span> - Student admission IDs (semicolon-separated)</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    </DashboardLayout>
  )
}
