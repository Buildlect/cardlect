'use client'

import { useEffect, useState } from 'react'
import { ChevronRight, ChevronLeft, Check, X } from 'lucide-react'
import { useCardlect } from '@/contexts/cardlect-context'

interface WizardProps {
    onComplete?: () => void
    onCancel: () => void
}

export function SchoolOnboardingWizard({ onComplete, onCancel }: WizardProps) {
    const { addSchool } = useCardlect()
    const [currentStep, setCurrentStep] = useState(0)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [formData, setFormData] = useState({
        // Step 1: Basic Info
        name: '',
        subdomain: '',
        address: '',
        // Step 2: Contact
        email: '',
        phone: '',
        // Step 3: Principal
        principalName: '',
        principalEmail: '',
        // Step 4: Plan & Settings
        subscriptionPlan: 'basic' as const,
    })

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel()
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [onCancel])

    const steps = [
        { title: 'Basic Information', description: 'School name and location' },
        { title: 'Contact Details', description: 'Email and phone number' },
        { title: 'Principal Information', description: 'Principal details' },
        { title: 'Plan & Review', description: 'Subscription plan and confirmation' },
    ]

    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {}

        if (step === 0) {
            if (!formData.name.trim()) newErrors.name = 'School name is required'
            if (!formData.subdomain.trim()) newErrors.subdomain = 'Subdomain is required'
            if (formData.subdomain && !/^[a-z0-9-]+$/.test(formData.subdomain)) {
                newErrors.subdomain = 'Subdomain can only contain lowercase letters, numbers, and hyphens'
            }
            if (!formData.address.trim()) newErrors.address = 'Address is required'
        } else if (step === 1) {
            if (!formData.email.trim()) newErrors.email = 'Email is required'
            if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = 'Invalid email format'
            }
            if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
        } else if (step === 2) {
            if (!formData.principalName.trim()) newErrors.principalName = 'Principal name is required'
            if (!formData.principalEmail.trim()) newErrors.principalEmail = 'Principal email is required'
            if (formData.principalEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.principalEmail)) {
                newErrors.principalEmail = 'Invalid email format'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validateStep(currentStep)) {
            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1)
            }
        }
    }

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
            setErrors({})
        }
    }

    const handleComplete = () => {
        if (validateStep(currentStep)) {
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
            onComplete?.()
        }
    }

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
        >
            {/* Backdrop */}
            <div
                onClick={onCancel}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            />

            {/* Modal */}
            <div className="relative w-full max-w-6xl bg-background border border-border rounded-xl shadow-2xl overflow-hidden z-10 grid grid-cols-12">
                {/* Left sidebar: Steps */}
                <aside className="col-span-4 lg:col-span-3 bg-secondary/5 p-6 flex flex-col gap-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-foreground">School Onboarding</h2>
                            <p className="text-sm text-muted-foreground mt-1">Guided setup to get you started</p>
                        </div>
                        
                    </div>

                    <nav className="flex-1 flex flex-col gap-3 pt-2 overflow-auto">
                        {steps.map((s, idx) => {
                            const isActive = idx === currentStep
                            const done = idx < currentStep
                            return (
                                <button
                                    key={s.title}
                                    onClick={() => {
                                        // allow jumping to completed steps or current step
                                        if (done || isActive) setCurrentStep(idx)
                                    }}
                                    className={`w-full text-left flex items-center gap-3 p-3 rounded-lg transition ${
                                        isActive ? 'bg-primary/10 border border-primary' : 'hover:bg-secondary/50'
                                    } ${done ? 'opacity-90' : ''}`}
                                >
                                    <div className={`w-8 h-8 flex items-center justify-center rounded-full ${done ? 'bg-primary text-white' : isActive ? 'bg-primary/80 text-white' : 'bg-secondary/50 text-muted-foreground'}`}>
                                        {done ? <Check size={16} /> : <span className="text-sm font-medium">{idx + 1}</span>}
                                    </div>
                                    <div>
                                        <div className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{s.title}</div>
                                        <div className="text-xs text-muted-foreground">{s.description}</div>
                                    </div>
                                </button>
                            )
                        })}
                    </nav>

                    <div className="text-xs text-muted-foreground">
                        <div>Step {currentStep + 1} of {steps.length}</div>
                    </div>
                </aside>

                {/* Right content */}
                <div className="col-span-8 mx-20 lg:col-span-9 p-8 min-h-[420px] flex flex-col m-8">
                    <div className="flex-1 overflow-auto">
                        {currentStep === 0 && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-1">{steps[0].title}</h3>
                                    <p className="text-sm text-muted-foreground mb-6">{steps[0].description}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        School Name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., lagos international school"
                                        value={formData.name}
                                        onChange={(e) => updateField('name', e.target.value)}
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
                                            value={formData.subdomain}
                                            onChange={(e) => updateField('subdomain', e.target.value.toLowerCase())}
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
                                            value={formData.address}
                                            onChange={(e) => updateField('address', e.target.value)}
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
                                    <h3 className="text-lg font-semibold text-foreground mb-1">{steps[1].title}</h3>
                                    <p className="text-sm text-muted-foreground mb-6">{steps[1].description}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            School Email *
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="admin@school.edu"
                                            value={formData.email}
                                            onChange={(e) => updateField('email', e.target.value)}
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
                                            value={formData.phone}
                                            onChange={(e) => updateField('phone', e.target.value)}
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
                                    <h3 className="text-lg font-semibold text-foreground mb-1">{steps[2].title}</h3>
                                    <p className="text-sm text-muted-foreground mb-6">{steps[2].description}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Principal Name *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Dr. John Smith"
                                            value={formData.principalName}
                                            onChange={(e) => updateField('principalName', e.target.value)}
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
                                            value={formData.principalEmail}
                                            onChange={(e) => updateField('principalEmail', e.target.value)}
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
                                    <h3 className="text-lg font-semibold text-foreground mb-1">{steps[3].title}</h3>
                                    <p className="text-sm text-muted-foreground mb-6">{steps[3].description}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Subscription Plan
                                    </label>
                                    <select
                                        value={formData.subscriptionPlan}
                                        onChange={(e) => updateField('subscriptionPlan', e.target.value)}
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
                                            <span className="text-foreground font-medium">{formData.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Subdomain:</span>
                                            <span className="text-foreground font-medium">{formData.subdomain}.cardlect.io</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Principal:</span>
                                            <span className="text-foreground font-medium">{formData.principalName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Plan:</span>
                                            <span className="text-foreground font-medium capitalize">{formData.subscriptionPlan}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-6 border-t border-border flex items-center justify-between gap-4">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 text-foreground hover:bg-secondary/50 rounded-lg transition-all"
                        >
                            Cancel
                        </button>

                        <div className="flex gap-3">
                            <button
                                onClick={handlePrevious}
                                disabled={currentStep === 0}
                                className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={18} />
                                Previous
                            </button>

                            {currentStep < steps.length - 1 ? (
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
                                >
                                    Next
                                    <ChevronRight size={18} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleComplete}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
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
    )
}

export default SchoolOnboardingWizard
