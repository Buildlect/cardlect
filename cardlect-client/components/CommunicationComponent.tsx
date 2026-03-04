'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Search, Phone, Video, Paperclip, Smile, MoreVertical, MessageSquare, Bell, X, Loader2 } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'
import api from '@/lib/api-client'

interface User {
  id: string
  full_name: string
  avatar?: string
  role: string
  status: 'online' | 'offline' | 'away'
  last_seen?: string
}

interface Message {
  id: string
  sender_id: string
  content: string
  created_at: string
  type: 'sent' | 'received'
  is_read?: boolean
}

interface CommunicationComponentProps {
  currentRole: string
  title?: string
  subtitle?: string
}

export function CommunicationComponent({
  currentRole,
  title = 'Communications',
  subtitle = 'Connect and collaborate with team members',
}: CommunicationComponentProps) {
  const [activeUser, setActiveUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [contacts, setContacts] = useState<User[]>([])
  const [inbox, setInbox] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchContacts = async () => {
    setLoading(true)
    try {
      // For now, let's fetch all users in the school as potential contacts
      // In a real app, this would be filtered by permissions/previous chats
      const response = await api.get('/users?limit=20')
      setContacts(response.data.data)

      const inboxRes = await api.get('/communications/inbox')
      setInbox(inboxRes.data.data)
    } catch (err) {
      console.error('Failed to fetch communications data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadChat = async (user: User) => {
    setActiveUser(user)
    setMessages([]) // In a real app, fetch history from /communications/history/:userId
  }

  const handleSendMessage = async () => {
    if (!text.trim() || !activeUser || sending) return

    setSending(true)
    const newMessage: Message = {
      id: Date.now().toString(),
      sender_id: 'me',
      content: text,
      created_at: new Date().toISOString(),
      type: 'sent',
      is_read: true
    }

    setMessages(prev => [...prev, newMessage])
    const oldText = text
    setText('')

    try {
      await api.post('/communications/send', {
        recipient_id: activeUser.id,
        content: oldText
      })
    } catch (err) {
      console.error('Failed to send message:', err)
      alert('Message failed to deliver.')
    } finally {
      setSending(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-amber-500'
      default: return 'bg-muted-foreground/30'
    }
  }

  const filteredContacts = contacts.filter(c =>
    c.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full space-y-8 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter">{title}</h1>
          <p className="text-muted-foreground mt-1 font-medium italic">{subtitle}</p>
        </div>
        <div className="flex bg-card border border-border rounded-2xl p-2 shadow-sm gap-4 items-center px-6">
          <div className="text-center">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Threads</p>
            <p className="text-xl font-black text-primary">{inbox.length}</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <button className="relative p-2 hover:bg-muted rounded-xl transition-all">
            <Bell size={20} className="text-muted-foreground" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-card" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[700px]">
        {/* Contact List */}
        <div className="lg:col-span-1 bg-card border border-border rounded-3xl overflow-hidden flex flex-col shadow-xl">
          <div className="p-6 border-b border-border bg-muted/20">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search encrypted channels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-border rounded-1.5xl pl-12 pr-4 py-3 text-sm font-medium focus:ring-2 ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => loadChat(contact)}
                className={`w-full p-4 rounded-2xl transition-all text-left flex items-center gap-4 group ${activeUser?.id === contact.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-muted/50'
                  }`}
              >
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border-2 ${activeUser?.id === contact.id ? 'bg-white/20 border-white/30' : 'bg-primary/5 border-primary/10 text-primary'
                    }`}>
                    {contact.full_name.charAt(0)}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 ${activeUser?.id === contact.id ? 'border-primary' : 'border-card'
                    } ${getStatusColor(contact.status)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-black truncate ${activeUser?.id === contact.id ? 'text-white' : 'text-foreground'}`}>
                    {contact.full_name}
                  </p>
                  <p className={`text-[10px] uppercase font-bold tracking-widest truncate ${activeUser?.id === contact.id ? 'text-white/70' : 'text-muted-foreground'
                    }`}>
                    {contact.role}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3 bg-card border border-border rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
          {activeUser ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-border bg-muted/10 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20">
                    {activeUser.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-foreground">{activeUser.full_name}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getStatusColor(activeUser.status)}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {activeUser.status === 'online' ? 'Secure Node Online' : `Last sync ${activeUser.last_seen || 'recently'}`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="rounded-xl h-11 w-11 hover:bg-primary/5 hover:text-primary"><Phone size={20} /></Button>
                  <Button variant="ghost" size="icon" className="rounded-xl h-11 w-11 hover:bg-primary/5 hover:text-primary"><Video size={20} /></Button>
                  <Button variant="ghost" size="icon" className="rounded-xl h-11 w-11 hover:bg-primary/5 hover:text-primary"><MoreVertical size={20} /></Button>
                </div>
              </div>

              {/* Chat Body */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-transparent to-muted/5">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4">
                    <MessageSquare size={64} />
                    <p className="font-black uppercase tracking-[0.2em] text-sm">Channel Initialized</p>
                  </div>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className={`flex ${m.type === 'sent' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                      <div className={`max-w-[70%] px-6 py-4 rounded-3xl shadow-sm ${m.type === 'sent'
                          ? 'bg-primary text-white rounded-br-none shadow-primary/20'
                          : 'bg-muted/50 text-foreground border border-border rounded-bl-none'
                        }`}>
                        <p className="text-sm font-medium leading-relaxed">{m.content}</p>
                        <p className={`text-[10px] font-bold mt-2 uppercase flex items-center gap-1 ${m.type === 'sent' ? 'text-white/60' : 'text-muted-foreground'
                          }`}>
                          {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • AES-256
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-6 bg-card border-t border-border">
                <div className="flex items-center gap-4 bg-muted/40 rounded-2xl p-2 px-4 border border-border group focus-within:border-primary/50 transition-all">
                  <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-primary"><Paperclip size={20} /></Button>
                  <input
                    type="text"
                    placeholder="Type an encrypted message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-transparent border-none outline-none py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground"
                  />
                  <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-primary"><Smile size={20} /></Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!text.trim() || sending}
                    className="bg-primary hover:bg-primary-darker text-white rounded-xl h-11 px-6 font-black shadow-lg shadow-primary/20 active:scale-95 transition-all"
                  >
                    {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
              <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-8 animate-pulse">
                <MessageSquare size={48} />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-3">Institutional Dispatch</h3>
              <p className="text-muted-foreground max-w-sm font-medium">Select a secure node from the registry to initiate end-to-end encrypted communication.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
