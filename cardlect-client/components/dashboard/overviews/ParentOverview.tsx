"use client"

import { useState, useEffect } from 'react'
import { Users, Clock, AlertTriangle, MapPin, Bell, CheckCircle, TrendingUp, Calendar, ChevronDown, Loader2, Send, Wallet, Plus } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'

interface Child {
    id: string
    full_name: string
    grade: string
    avatar: string
    status: string
    admission_number: string
    attendance?: number
}

export default function ParentOverview() {
    const [children, setChildren] = useState<Child[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedChildId, setSelectedChildId] = useState<string | null>(null)
    const [showChildSelector, setShowChildSelector] = useState(false)
    const [parentWallet, setParentWallet] = useState<any>(null)
    const [isFunding, setIsFunding] = useState(false)
    const [fundAmount, setFundAmount] = useState('')
    const [fundSuccess, setFundSuccess] = useState(false)

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [childrenRes, walletRes] = await Promise.all([
                    api.get('/users/children'),
                    api.get('/wallets/me')
                ])
                setChildren(childrenRes.data.data)
                setParentWallet(walletRes.data.data)
                if (childrenRes.data.data.length > 0) {
                    setSelectedChildId(childrenRes.data.data[0].id)
                }
            } catch (err) {
                console.error('Failed to fetch parent data:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchInitialData()
    }, [])

    const handleSendMoney = async () => {
        if (!selectedChildId || !fundAmount || isNaN(parseFloat(fundAmount))) return
        setIsFunding(true)
        try {
            await api.post('/wallets/transfer', {
                targetUserId: selectedChildId,
                amount: parseFloat(fundAmount),
                description: 'Allowance from Parent'
            })
            setFundSuccess(true)
            setFundAmount('')
            // Refresh wallet
            const walletRes = await api.get('/wallets/me')
            setParentWallet(walletRes.data.data)
            setTimeout(() => setFundSuccess(false), 3000)
        } catch (err: any) {
            alert(err.response?.data?.message || 'Transfer failed. Check balance.')
        } finally {
            setIsFunding(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    if (children.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center">
                <Users size={48} className="text-muted-foreground mb-4 opacity-20" />
                <h2 className="text-xl font-bold text-foreground">No Children Linked</h2>
                <p className="text-muted-foreground mt-2">Contact your school admin to link your children.</p>
            </div>
        )
    }

    const selectedChild = children.find(c => c.id === selectedChildId) || children[0]

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Parent Portal</h1>
                    <p className="text-muted-foreground">Monitoring dashboard for {selectedChild.full_name}.</p>
                </div>

                {parentWallet && (
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                        <div className="p-2 bg-primary rounded-xl">
                            <Wallet size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">Your Balance</p>
                            <p className="text-lg font-bold text-foreground">₦{parentWallet.balance.toLocaleString()}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Child Status & Overview */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setShowChildSelector(!showChildSelector)}
                            className="w-full flex items-center justify-between gap-3 px-6 py-4 rounded-2xl border border-border bg-card hover:border-primary transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{selectedChild.avatar || '👤'}</span>
                                <div className="text-left">
                                    <p className="font-bold text-foreground">{selectedChild.full_name}</p>
                                    <p className="text-xs text-muted-foreground">{selectedChild.grade || 'Student'}</p>
                                </div>
                            </div>
                            <ChevronDown size={20} className={`transition-transform ${showChildSelector ? 'rotate-180' : ''}`} />
                        </button>

                        {showChildSelector && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
                                {children.map((child) => (
                                    <button
                                        key={child.id}
                                        onClick={() => { setSelectedChildId(child.id); setShowChildSelector(false); }}
                                        className="w-full flex items-center justify-between px-6 py-4 border-b border-border/50 hover:bg-muted/50 transition-colors last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span>{child.avatar || '👤'}</span>
                                            <p className="text-sm font-medium">{child.full_name}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-card p-6 rounded-2xl border border-border hover:shadow-lg transition-all">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Campus Presence</p>
                                    <p className="text-lg font-bold text-foreground">In School</p>
                                </div>
                            </div>
                            <div className="h-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={[{ v: 10 }, { v: 15 }, { v: 12 }, { v: 18 }, { v: 15 }]}>
                                        <Area type="monotone" dataKey="v" stroke={CARDLECT_COLORS.success.main} fill={CARDLECT_COLORS.success.main} fillOpacity={0.1} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-card p-6 rounded-2xl border border-border hover:shadow-lg transition-all">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Attendance</p>
                                    <p className="text-lg font-bold text-foreground">98% Overall</p>
                                </div>
                            </div>
                            <div className="h-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={[{ v: 10 }, { v: 12 }, { v: 15 }, { v: 14 }, { v: 19 }]}>
                                        <Area type="monotone" dataKey="v" stroke={CARDLECT_COLORS.warning.main} fill={CARDLECT_COLORS.warning.main} fillOpacity={0.1} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Live Notifications */}
                    <div className="bg-card border border-border rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-foreground">Live Activity</h3>
                            <button className="text-xs text-primary font-bold hover:underline">View All</button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                                <Clock className="text-success" size={18} />
                                <span className="text-sm font-medium">{selectedChild.full_name} entered Gate A at 08:05 AM</span>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                                <Bell className="text-warning" size={18} />
                                <span className="text-sm font-medium">New exam result published: First Term Maths</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Send Money - Right Sidebar Action */}
                <div className="space-y-6">
                    <div className="bg-primary p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -m-8 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold mb-2">Fund Wallet</h3>
                        <p className="text-white/80 text-sm mb-6">Send allowance directly to {selectedChild.full_name}'s smart card.</p>

                        <div className="space-y-4">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 font-medium">₦</span>
                                <input
                                    type="number"
                                    value={fundAmount}
                                    onChange={(e) => setFundAmount(e.target.value)}
                                    placeholder="Amount"
                                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-8 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all font-bold"
                                />
                            </div>
                            <button
                                onClick={handleSendMoney}
                                disabled={isFunding || !fundAmount}
                                className="w-full bg-white text-primary rounded-xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-primary-lighter transition-colors disabled:opacity-50"
                            >
                                {isFunding ? <Loader2 className="animate-spin" /> : fundSuccess ? <CheckCircle /> : <Send size={18} />}
                                {fundSuccess ? 'Funds Sent!' : 'Send Money'}
                            </button>
                            {fundSuccess && (
                                <p className="text-center text-xs font-bold animate-bounce mt-2 text-white">Transfer complete!</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-6">
                        <h4 className="font-bold text-sm mb-4">Quick Shortcuts</h4>
                        <div className="grid grid-cols-1 gap-3">
                            <button className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-sm font-medium">
                                <span>Exam Results</span>
                                <ChevronDown className="-rotate-90 opacity-50" size={16} />
                            </button>
                            <button className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-sm font-medium">
                                <span>Pickup Authorization</span>
                                <ChevronDown className="-rotate-90 opacity-50" size={16} />
                            </button>
                            <button className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-sm font-medium">
                                <span>Contact School</span>
                                <ChevronDown className="-rotate-90 opacity-50" size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
