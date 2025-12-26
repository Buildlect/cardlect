'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Search, Phone, Video, Paperclip, Smile, MoreVertical, MessageSquare, Bell, X } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'

interface User {
  id: string
  name: string
  avatar: string
  role: string
  status: 'online' | 'offline' | 'away'
  lastSeen?: string
}

interface Message {
  id: string
  senderId: string
  text: string
  timestamp: string
  type: 'sent' | 'received'
  isRead?: boolean
}

interface CommunicationComponentProps {
  currentRole: 'admin' | 'security' | 'super-user' | 'parents' | 'students' | 'finance' | 'store' | 'teacher' | 'clinic' | 'approved-stores' | 'exam-officer' | 'librarian' | 'visitor'
  title?: string
  subtitle?: string
  accentColor?: { start: string; end: string }
}

const ROLE_PERMISSIONS = {
  admin: ['super-user', 'security', 'finance', 'teacher', 'parents'],
  'super-user': ['admin', 'security', 'finance', 'teacher', 'parents', 'students', 'clinic', 'store', 'approved-stores', 'exam-officer', 'librarian'],
  security: ['admin', 'super-user', 'parents'],
  finance: ['admin', 'super-user', 'parents', 'store'],
  teacher: ['super-user', 'admin', 'parents', 'students', 'exam-officer'],
  parents: ['teacher', 'admin', 'finance', 'clinic'],
  students: ['teacher', 'admin', 'clinic', 'librarian'],
  clinic: ['admin', 'super-user', 'parents', 'students'],
  store: ['super-user', 'finance', 'approved-stores'],
  'approved-stores': ['super-user', 'finance', 'store'],
  'exam-officer': ['super-user', 'admin', 'teacher', 'students'],
  'librarian': ['students', 'teacher', 'admin'],
  'visitor': ['admin', 'super-user'],
}

const SAMPLE_USERS: Record<string, User[]> = {
  admin: [
    { id: '1', name: 'Super Admin', avatar: '👑', role: 'super-user', status: 'online', lastSeen: 'now' },
    { id: '2', name: 'Security Chief', avatar: '👮', role: 'security', status: 'online', lastSeen: 'now' },
    { id: '3', name: 'Finance Manager', avatar: '💼', role: 'finance', status: 'away', lastSeen: '5m' },
    { id: '4', name: 'Head Teacher', avatar: '👨‍🏫', role: 'teacher', status: 'online', lastSeen: 'now' },
  ],
  'super-user': [
    { id: '1', name: 'School Admin', avatar: '👨‍💼', role: 'admin', status: 'online', lastSeen: 'now' },
    { id: '2', name: 'Security Team', avatar: '🚨', role: 'security', status: 'online', lastSeen: 'now' },
    { id: '3', name: 'Finance Dept', avatar: '💰', role: 'finance', status: 'away', lastSeen: '10m' },
    { id: '4', name: 'Store Manager', avatar: '🏪', role: 'store', status: 'online', lastSeen: 'now' },
    { id: '5', name: 'Exam Officer', avatar: '📝', role: 'exam-officer', status: 'online', lastSeen: 'now' },
    { id: '6', name: 'Librarian', avatar: '📚', role: 'librarian', status: 'online', lastSeen: '2m' },
  ],
  security: [
    { id: '1', name: 'School Admin', avatar: '👨‍💼', role: 'admin', status: 'online', lastSeen: 'now' },
    { id: '2', name: 'Super Admin', avatar: '👑', role: 'super-user', status: 'online', lastSeen: 'now' },
    { id: '3', name: 'Parent', avatar: '👨‍👩‍👧', role: 'parents', status: 'online', lastSeen: '1m' },
  ],
  finance: [
    { id: '1', name: 'School Admin', avatar: '👨‍💼', role: 'admin', status: 'online', lastSeen: 'now' },
    { id: '2', name: 'Super Admin', avatar: '👑', role: 'super-user', status: 'away', lastSeen: '15m' },
    { id: '3', name: 'Parent', avatar: '👨‍👩‍👧', role: 'parents', status: 'online', lastSeen: 'now' },
    { id: '4', name: 'Store', avatar: '🏪', role: 'store', status: 'online', lastSeen: 'now' },
  ],
  teacher: [
    { id: '1', name: 'Super Admin', avatar: '👑', role: 'super-user', status: 'online', lastSeen: 'now' },
    { id: '2', name: 'School Admin', avatar: '👨‍💼', role: 'admin', status: 'online', lastSeen: 'now' },
    { id: '3', name: 'Parent', avatar: '👨‍👩‍👧', role: 'parents', status: 'away', lastSeen: '20m' },
    { id: '4', name: 'Student', avatar: '👨‍🎓', role: 'students', status: 'online', lastSeen: 'now' },
    { id: '5', name: 'Exam Officer', avatar: '📝', role: 'exam-officer', status: 'online', lastSeen: '5m' },
  ],
  parents: [
    { id: '1', name: 'Teacher', avatar: '👩‍🏫', role: 'teacher', status: 'online', lastSeen: 'now' },
    { id: '2', name: 'School Admin', avatar: '👨‍💼', role: 'admin', status: 'online', lastSeen: 'now' },
    { id: '3', name: 'Finance', avatar: '💼', role: 'finance', status: 'away', lastSeen: '30m' },
    { id: '4', name: 'Clinic', avatar: '⚕️', role: 'clinic', status: 'online', lastSeen: '3m' },
  ],
  students: [
    { id: '1', name: 'Teacher', avatar: '👩‍🏫', role: 'teacher', status: 'online', lastSeen: 'now' },
    { id: '2', name: 'School Admin', avatar: '👨‍💼', role: 'admin', status: 'online', lastSeen: 'now' },
    { id: '3', name: 'Librarian', avatar: '📚', role: 'librarian', status: 'online', lastSeen: '2m' },
  ],
  clinic: [
    { id: '1', name: 'Super Admin', avatar: '👑', role: 'super-user', status: 'online', lastSeen: 'now' },
    { id: '2', name: 'School Admin', avatar: '👨‍💼', role: 'admin', status: 'online', lastSeen: 'now' },
    { id: '3', name: 'Parent', avatar: '👨‍👩‍👧', role: 'parents', status: 'online', lastSeen: '1m' },
  ],
  store: [
    { id: '1', name: 'Super Admin', avatar: '👑', role: 'super-user', status: 'online', lastSeen: 'now' },
    { id: '2', name: 'Finance', avatar: '💰', role: 'finance', status: 'online', lastSeen: 'now' },
    { id: '3', name: 'Approved Store', avatar: '🛍️', role: 'approved-stores', status: 'online', lastSeen: '1m' },
  ],
  'approved-stores': [
    { id: '1', name: 'Super Admin', avatar: '👑', role: 'super-user', status: 'online', lastSeen: 'now' },
    { id: '2', name: 'Finance Team', avatar: '💰', role: 'finance', status: 'away', lastSeen: '25m' },
    { id: '3', name: 'Store', avatar: '🏪', role: 'store', status: 'online', lastSeen: '3m' },
  ],
  'exam-officer': [
    { id: '1', name: 'Super Admin', avatar: '👑', role: 'super-user', status: 'online', lastSeen: 'now' },
    { id: '2', name: 'School Admin', avatar: '👨‍💼', role: 'admin', status: 'online', lastSeen: 'now' },
    { id: '3', name: 'Teacher', avatar: '👩‍🏫', role: 'teacher', status: 'online', lastSeen: '4m' },
    { id: '4', name: 'Student', avatar: '👨‍🎓', role: 'students', status: 'online', lastSeen: 'now' },
  ],
  'librarian': [
    { id: '1', name: 'Student', avatar: '👨‍🎓', role: 'students', status: 'online', lastSeen: 'now' },
    { id: '2', name: 'Teacher', avatar: '👩‍🏫', role: 'teacher', status: 'online', lastSeen: '5m' },
    { id: '3', name: 'School Admin', avatar: '👨‍💼', role: 'admin', status: 'online', lastSeen: 'now' },
  ],
  'visitor': [
    { id: '1', name: 'School Admin', avatar: '👨‍💼', role: 'admin', status: 'online', lastSeen: 'now' },
    { id: '2', name: 'Super Admin', avatar: '👑', role: 'super-user', status: 'online', lastSeen: 'now' },
  ],
}

export function CommunicationComponent({
  currentRole,
  title = 'Communications',
  subtitle = 'Connect and collaborate with team members',
  accentColor = { start: 'orange', end: 'amber' },
}: CommunicationComponentProps) {
  const [user, setUser] = useState<User | null>(null)
  const [msgs, setMsgs] = useState<Message[]>([])
  const [txt, setTxt] = useState('')
  const [query, setQuery] = useState('')
  const [notificationOpen, setNotificationOpen] = useState(false)
  const messagesRef = useRef<HTMLDivElement>(null)

  // Get allowed contacts based on role
  const allowedRoles = (ROLE_PERMISSIONS as any)[currentRole] || []
  const availableUsers = (SAMPLE_USERS as any)[currentRole]?.filter((u: User) => allowedRoles.includes(u.role)) || []
  const filteredUsers = availableUsers.filter((u: User) => u.name.toLowerCase().includes(query.toLowerCase()))
  const unreadCount = msgs.filter(m => m.type === 'received' && !m.isRead).length

  useEffect(() => {
    messagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  const loadMessages = (u: User) => {
    setUser(u)
    setMsgs([
      { id: '1', senderId: 'o', text: 'Hi there! How can I help?', timestamp: '2:10 PM', type: 'received', isRead: true },
      { id: '2', senderId: 'me', text: 'Thanks for reaching out!', timestamp: '2:12 PM', type: 'sent', isRead: true },
      { id: '3', senderId: 'o', text: 'I have some updates to share about the ongoing project.', timestamp: '2:15 PM', type: 'received', isRead: true },
    ])
  }

  const sendMessage = () => {
    if (txt.trim() && user) {
      setMsgs([...msgs, {
        id: Date.now().toString(),
        senderId: 'me',
        text: txt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'sent',
        isRead: true,
      }])
      setTxt('')
      setTimeout(() => {
        setMsgs(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          senderId: 'o',
          text: 'Thanks for that information. I\'ll review and get back to you soon.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'received',
          isRead: false,
        }])
      }, 1500)
    }
  }

  const getStatusColor = (status: string) => {
    if (status === 'online') return 'bg-green-500'
    if (status === 'away') return 'bg-yellow-500'
    return 'bg-gray-400'
  }

  const getRoleColor = (role: string) => {
    // Unified Cardlect Orange colors for all roles
    return 'from-orange-500 to-amber-500'
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setNotificationOpen(!notificationOpen)} className="p-3 hover:bg-muted rounded-lg transition-all relative">
                <Bell size={20} className="text-muted-foreground hover:text-foreground transition-colors" />
                {unreadCount > 0 && (
                  <span style={{ backgroundColor: CARDLECT_COLORS.danger.main }} className="absolute top-0 right-0 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-semibold">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notificationOpen && unreadCount > 0 && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg p-4 z-50">
                  <p className="text-sm font-semibold text-foreground mb-2">Unread Messages</p>
                  <p className="text-xs text-muted-foreground">{unreadCount} new message{unreadCount > 1 ? 's' : ''} from your contacts</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-280px)]">
        {/* Users List */}
        <div className="lg:col-span-1 bg-card border border-border rounded-2xl overflow-hidden flex flex-col shadow-md">
          <div className="p-4 border-b border-border bg-gradient-to-r from-card to-background/50">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-background border border-border rounded-lg pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all"
                style={{ '--tw-ring-color': CARDLECT_COLORS.primary.darker } as any}
              />
            </div>
            {filteredUsers.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">{filteredUsers.length} contact{filteredUsers.length > 1 ? 's' : ''}</p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare size={32} className="mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No contacts available</p>
              </div>
            ) : (
              filteredUsers.map((u: User) => (
                <button
                  key={u.id}
                  onClick={() => loadMessages(u)}
                  className={`w-full p-4 border-b border-border hover:bg-muted/50 transition-all text-left group ${
                    user?.id === u.id ? 'bg-muted/70 border-l-2' : ''
                  }`}
                  style={user?.id === u.id ? { borderLeftColor: CARDLECT_COLORS.primary.darker } : {}}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRoleColor(u.role)} flex items-center justify-center text-lg shadow-sm`}>
                        {u.avatar}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(u.status)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:font-semibold transition-all">{u.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{u.role} • {u.lastSeen}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 bg-card border border-border rounded-2xl overflow-hidden flex flex-col shadow-md">
          {user ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-card/50 to-background/30 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRoleColor(user.role)} flex items-center justify-center text-xl shadow-md`}>
                    {user.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs flex items-center gap-1">
                      <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor(user.status)}`} />
                      <span className="text-muted-foreground capitalize">{user.status === 'online' ? 'Active now' : `Last seen ${user.lastSeen}`}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-background rounded-lg transition-all hover:shadow-sm" title="Voice call">
                    <Phone size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
                  </button>
                  <button className="p-2 hover:bg-background rounded-lg transition-all hover:shadow-sm" title="Video call">
                    <Video size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
                  </button>
                  <button className="p-2 hover:bg-background rounded-lg transition-all hover:shadow-sm" title="More options">
                    <MoreVertical size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-background/50 to-background/30">
                {msgs.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageSquare size={40} className="mx-auto text-muted-foreground/30 mb-2" />
                      <p className="text-sm text-muted-foreground">Start a conversation</p>
                    </div>
                  </div>
                ) : (
                  msgs.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                          message.type === 'sent'
                            ? `bg-gradient-to-br ${CARDLECT_COLORS.primary.darker.startsWith('#') ? 'custom-sent' : CARDLECT_COLORS.primary.darker} text-white rounded-br-none`
                            : 'bg-muted text-foreground border border-border/50 rounded-bl-none'
                        }`}
                        style={message.type === 'sent' ? { backgroundColor: CARDLECT_COLORS.primary.darker } : {}}
                      >
                        <p className="text-sm break-words">{message.text}</p>
                        <p className={`text-xs mt-1 ${message.type === 'sent' ? 'text-white/70' : 'text-muted-foreground'}`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-gradient-to-t from-background/50 to-transparent">
                <div className="flex items-end gap-3">
                  <button className="p-2 hover:bg-muted rounded-lg transition-all hover:shadow-sm" title="Attach file">
                    <Paperclip size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
                  </button>
                  <div className="flex-1 flex items-end gap-2 bg-muted border border-border rounded-2xl px-3 py-2 focus-within:ring-2 transition-all" style={{ '--tw-ring-color': CARDLECT_COLORS.primary.darker } as any}>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={txt}
                      onChange={(e) => setTxt(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          sendMessage()
                        }
                      }}
                      className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none resize-none max-h-24"
                    />
                    <button className="p-1 hover:bg-background rounded-lg transition-all hover:shadow-sm" title="Emoji">
                      <Smile size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!txt.trim()}
                    className="p-3 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:scale-105 disabled:hover:scale-100"
                    style={{ backgroundColor: txt.trim() ? CARDLECT_COLORS.primary.darker : CARDLECT_COLORS.primary.darker + '60' }}
                    title="Send message (Enter)"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-background/50 to-background/30">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={32} className="text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">No contact selected</h3>
              <p className="text-sm text-muted-foreground">Select someone from the list to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
