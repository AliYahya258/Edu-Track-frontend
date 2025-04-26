'use client'

import React, { useState, useEffect } from 'react'
import TeacherSidebar from '@/components/teacher/sidebar'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, Plus, Edit, Trash2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ViewAnnouncementsPage() {
    const router = useRouter()
    const [announcements, setAnnouncements] = useState([])
    const [classes, setClasses] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [classFilter, setClassFilter] = useState('all')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    const loadAnnouncements = async (classId) => {
        setLoading(true)
        setErrorMessage(null)
        try {
            const data = await fetchAnnouncements(classId)
            setAnnouncements(data)
        } catch (error) {
            setErrorMessage('Error fetching announcements. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // Load classes and announcements
        const fetchData = async () => {
            setLoading(true)
            try {
                const classData = await fetchTeacherClasses()
                setClasses(classData)
                await loadAnnouncements('all')
            } catch (error) {
                setErrorMessage('Error fetching data. Please try again.')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // Handle class filter change
    const handleClassFilterChange = (value) => {
        setClassFilter(value)
        loadAnnouncements(value)
    }

    const filteredAnnouncements = announcements.filter((announcement) => {
        return announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    })

    // Navigate to edit page
    const handleEdit = (id) => {
        router.push(`/teacherPage/announcements/edit?id=${id}`)
    }

    // Delete announcement
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this announcement?')) {
            return
        }

        const token = getToken()
        try {
            const response = await fetch(`http://localhost:8081/api/announcements/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error('Failed to delete announcement')
            }

            // Remove from state
            setAnnouncements(announcements.filter(announcement => announcement.id !== id))
        } catch (error) {
            setErrorMessage('Error deleting announcement. Please try again.')
        }
    }

    return (
        <div className="min-h-screen bg-[#1a1f2e]">
            <div className="grid grid-cols-[auto_1fr]">
                <TeacherSidebar />
                <main className="p-8">
                    <div className="max-w-[1400px] mx-auto">
                        {/* Page Header */}
                        <header className="mb-8 flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">Announcements</h1>
                                <p className="text-gray-400">View and manage your class announcements</p>
                            </div>
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => router.push('/teacherPage/announcements/create')}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                New Announcement
                            </Button>
                        </header>

                        {/* Error Message */}
                        {errorMessage && (
                            <div className="bg-red-600/10 border border-red-600/20 text-red-500 p-3 rounded-md mb-4 flex items-center">
                                <AlertCircle className="h-5 w-5 mr-2" />
                                {errorMessage}
                            </div>
                        )}

                        {/* Search and Filter Card */}
                        <Card className="bg-[#1c2237] rounded-lg p-6 mb-6">
                            <CardHeader className="p-0">
                                <div className="flex items-center gap-4 mb-6">
                                    {/* Search Input */}
                                    <Input
                                        placeholder="Search announcements..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="flex-1 bg-gray-700/50 border-gray-600 text-gray-100 py-2 px-4 text-sm"
                                    />
                                    {/* Class Filter */}
                                    <Select value={classFilter} onValueChange={handleClassFilterChange}>
                                        <SelectTrigger className="w-40 bg-gray-700/50 border-gray-600 text-gray-100 py-2 px-4 text-sm">
                                            <SelectValue placeholder="Filter by class" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-800 border-gray-700">
                                            <SelectItem value="all">All Classes</SelectItem>
                                            {classes.map((classItem) => (
                                                <SelectItem key={classItem.id} value={classItem.id}>
                                                    {classItem.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {/* Refresh Button */}
                                    <Button
                                        variant="outline"
                                        className="border-gray-600 text-gray-300 hover:text-white"
                                        onClick={() => loadAnnouncements(classFilter)}
                                        disabled={loading}
                                    >
                                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                        Refresh
                                    </Button>
                                </div>
                            </CardHeader>
                        </Card>

                        {/* Announcements List */}
                        <div className="space-y-4">
                            {filteredAnnouncements.length > 0 ? (
                                filteredAnnouncements.map((announcement) => (
                                    <Card key={announcement.id} className="bg-[#1c2237] rounded-lg p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center mb-2">
                                                    <h3 className="text-lg font-semibold text-white">{announcement.title}</h3>
                                                    <span className={`ml-3 text-sm font-medium ${getImportanceColor(announcement.importance)}`}>
                            {announcement.importance.charAt(0).toUpperCase() + announcement.importance.slice(1)}
                          </span>
                                                </div>

                                                <p className="text-gray-400 text-sm mb-3">
                                                    Posted to {announcement.className} • {formatDate(announcement.createdAt)}
                                                </p>

                                                <p className="text-gray-300 whitespace-pre-line">{announcement.content}</p>
                                            </div>

                                            <div className="flex space-x-2 ml-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                                                    onClick={() => handleEdit(announcement.id)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 border-gray-600 text-red-400 hover:text-white hover:bg-red-600 hover:border-red-600"
                                                    onClick={() => handleDelete(announcement.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className="bg-[#1c2237] rounded-lg p-12 text-center">
                                    <p className="text-gray-400">
                                        {loading ? 'Loading announcements...' : 'No announcements found.'}
                                    </p>
                                    {!loading && (
                                        <Button
                                            className="bg-blue-600 hover:bg-blue-700 text-white mt-4"
                                            onClick={() => router.push('/teacherPage/announcements/create')}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create Your First Announcement
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}