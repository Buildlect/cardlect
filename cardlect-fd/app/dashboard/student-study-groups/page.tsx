'use client'

import { useState } from 'react'
import DashboardLayout from "@/components/DashboardLayout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Users, BookOpen, Plus } from 'lucide-react'
import { CARDLECT_COLORS } from '@/lib/cardlect-colors'

interface StudyGroup {
  id: string
  name: string
  subject: string
  leader: string
  members: number
  schedule: string
  status: 'active' | 'inactive'
}

const mockGroups: StudyGroup[] = [
  { id: '1', name: 'Math Wizards', subject: 'Mathematics', leader: 'Chioma Okonkwo', members: 5, schedule: 'Mon, Wed, Fri - 4:00 PM', status: 'active' },
  { id: '2', name: 'Science Club', subject: 'Physics & Chemistry', leader: 'Jamal Hassan', members: 8, schedule: 'Tue, Thu - 3:30 PM', status: 'active' },
  { id: '3', name: 'English Speakers', subject: 'English Language', leader: 'Amara Obi', members: 6, schedule: 'Mon, Wed - 4:30 PM', status: 'active' },
  { id: '4', name: 'History Buffs', subject: 'History', leader: 'Efe Okoro', members: 4, schedule: 'Sat - 2:00 PM', status: 'inactive' },
]

export default function StudyGroupsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)

  const filteredGroups = mockGroups.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeGroups = mockGroups.filter(g => g.status === 'active').length
  const totalMembers = mockGroups.reduce((sum, g) => sum + g.members, 0)

  return (
    <DashboardLayout currentPage="study-groups" role="students">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Study Groups</h1>
        <p className="text-muted-foreground">Join or create study groups to collaborate with peers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Active Groups</p>
                <p className="text-3xl font-bold text-foreground">{activeGroups}</p>
              </div>
              <BookOpen size={24} style={{ color: CARDLECT_COLORS.primary.darker }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Members</p>
                <p className="text-3xl font-bold text-foreground">{totalMembers}</p>
              </div>
              <Users size={24} style={{ color: CARDLECT_COLORS.success.main }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <button
              className="w-full px-4 py-2 text-white font-medium rounded-lg flex items-center justify-center gap-2"
              style={{ backgroundColor: CARDLECT_COLORS.primary.darker }}
            >
              <Plus size={18} />
              Create Group
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Groups List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Study Groups</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
                className="border border-border rounded-lg p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{group.name}</h3>
                    <p className="text-sm text-muted-foreground">{group.subject}</p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: group.status === 'active' ? CARDLECT_COLORS.success.main : CARDLECT_COLORS.danger.main }}
                  >
                    {group.status}
                  </span>
                </div>

                {expandedGroup === group.id && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Leader</p>
                        <p className="font-semibold text-foreground">{group.leader}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Members</p>
                        <p className="font-semibold text-foreground">{group.members}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs text-muted-foreground">Schedule</p>
                        <p className="font-semibold text-foreground">{group.schedule}</p>
                      </div>
                    </div>
                    <button
                      className="w-full px-4 py-2 text-white font-medium rounded-lg"
                      style={{ backgroundColor: CARDLECT_COLORS.primary.darker }}
                    >
                      Join Group
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
