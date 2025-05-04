'use client'

import React, { useState, useEffect } from 'react'
import TeacherSidebar from '@/components/teacher/sidebar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, Plus, Edit, Trash2, AlertCircle, Save, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AnnouncementsPage() {
    const router = useRouter()
    const [announcements, setAnnouncements] = useState([])
    const [courseId, setCourseId] = useState('')
    const [section, setSection] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState({
        title: '',
        content: ''
    })
    const [updating, setUpdating] = useState(false)

    // Get JWT token from storage
    const getToken = () => {
        const userStr = sessionStorage.getItem("userData");
        if (!userStr) {
            console.error("No authentication token found in sessionStorage");
            return null;
        }
        const user = JSON.parse(userStr);
        return user?.accessToken || null;
    }

    // Fetch announcements from the API
    const fetchAnnouncements = async () => {
        const token = getToken()
        console.log('Token available:', !!token)

        if (!courseId || !section) {
            throw new Error('Please enter both Course ID and Section')
        }

        const url = `http://localhost:8081/api/announcements/course/${courseId}/section/${section}`
        console.log('Fetching announcements from:', url)

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 401) {
            throw new Error('Authentication failed. Please log in again.')
        }

        if (!response.ok) {
            const errorText = await response.text()
            console.error('API Error:', response.status, errorText)
            throw new Error(`Failed to fetch announcements: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log('Retrieved announcements:', data.length)

        return data.map(announcement => ({
            id: announcement.id,
            title: announcement.title,
            content: announcement.content,
            createdAt: announcement.timestamp,
            teacherName: announcement.teacherName,
            className: `${courseId} - ${section}`,
            fileUrls: announcement.fileUrls || []
        }))
    }

    // Delete announcement
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this announcement?')) {
            return
        }

        const token = getToken()
        if (!token) {
            setErrorMessage('Authentication token not found')
            return
        }

        try {
            const response = await fetch(`http://localhost:8081/api/announcements/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error('Failed to delete announcement')
            }

            setAnnouncements(prev => prev.filter(a => a.id !== id))
        } catch (error) {
            console.error('Error deleting announcement:', error)
            setErrorMessage('Error deleting announcement. Please try again.')
        }
    }

    // Start editing an announcement
    const handleEditStart = (announcement) => {
        setEditingId(announcement.id)
        setEditForm({
            title: announcement.title,
            content: announcement.content
        })
    }

    // Cancel editing
    const handleEditCancel = () => {
        setEditingId(null)
        setEditForm({
            title: '',
            content: ''
        })
    }

    // Handle form field changes
    const handleFormChange = (e) => {
        const { name, value } = e.target
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Save updated announcement
    const handleSaveEdit = async () => {
        if (!editingId) return

        const token = getToken()
        if (!token) {
            setErrorMessage('Authentication token not found')
            return
        }

        setUpdating(true)
        try {
            // Prepare the request body
            const requestBody = {
                title: editForm.title,
                content: editForm.content,
                courseId: courseId,
                sectionName: section
            }

            // Make the API call to update the announcement
            const response = await fetch(`http://localhost:8081/api/announcements/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error('API Error:', response.status, errorText)
                throw new Error(`Failed to update announcement: ${response.status} ${response.statusText}`)
            }

            const updatedAnnouncement = await response.json()
            
            // Update the announcement in the local state
            setAnnouncements(prev => prev.map(announcement => 
                announcement.id === editingId ? {
                    ...announcement,
                    title: updatedAnnouncement.title,
                    content: updatedAnnouncement.content,
                    // Keep other fields that might not be returned by the API
                    className: announcement.className,
                    teacherName: updatedAnnouncement.teacherName || announcement.teacherName,
                    fileUrls: updatedAnnouncement.fileUrls || announcement.fileUrls
                } : announcement
            ))

            // Reset editing state
            setEditingId(null)
            setEditForm({
                title: '',
                content: ''
            })
        } catch (error) {
            console.error('Error updating announcement:', error)
            setErrorMessage(`Error updating announcement: ${error.message}`)
        } finally {
            setUpdating(false)
        }
    }

    // Check for token on component load
    useEffect(() => {
        const token = getToken()
        if (!token) {
            setErrorMessage('No authentication token found. You may need to log in again.')
            console.warn('No authentication token found on component load')
        } else {
            console.log('Authentication token is available')
        }
    }, [])

    const loadAnnouncements = async () => {
        setLoading(true)
        setErrorMessage(null)
        try {
            const data = await fetchAnnouncements()
            setAnnouncements(data)
            if (data.length === 0) {
                setErrorMessage('No announcements found for this course and section.')
            }
        } catch (error) {
            console.error('Error loading announcements:', error)
            setErrorMessage(error.message || 'Error fetching announcements. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date'
        const date = new Date(dateString)
        return date.toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: 'numeric', minute: '2-digit', hour12: true
        })
    }

    // Navigate to create page
    const handleCreateNew = () => {
        router.push('/teacherPage/announcements/create')
    }

    return (
        <div className="min-h-screen bg-[#1a1f2e]">
            <div className="grid grid-cols-[auto_1fr]">
                <TeacherSidebar />
                <main className="p-8">
                    <div className="max-w-[1400px] mx-auto">
                        <header className="mb-8 flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">Announcements</h1>
                                <p className="text-gray-400">View and manage your class announcements</p>
                            </div>
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={handleCreateNew}
                            >
                                <Plus className="h-4 w-4 mr-2" /> New Announcement
                            </Button>
                        </header>

                        {errorMessage && (
                            <div className="bg-red-600/10 border border-red-600/20 text-red-500 p-3 rounded-md mb-4 flex items-center">
                                <AlertCircle className="h-5 w-5 mr-2" /> {errorMessage}
                            </div>
                        )}

                        <Card className="bg-[#1c2237] rounded-lg p-6 mb-6">
                            <CardHeader className="p-0">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex-1">
                                        <label htmlFor="courseId" className="block text-sm font-medium text-gray-400 mb-1">Course ID</label>
                                        <Input
                                            id="courseId" placeholder="Enter Course ID (e.g. 3064)"
                                            value={courseId}
                                            onChange={(e) => { setCourseId(e.target.value); setErrorMessage(null) }}
                                            className="w-full bg-gray-700/50 border-gray-600 text-gray-100 py-2 px-4 text-sm"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="section" className="block text-sm font-medium text-gray-400 mb-1">Section</label>
                                        <Input
                                            id="section" placeholder="Enter Section (e.g. A)"
                                            value={section}
                                            onChange={(e) => { setSection(e.target.value); setErrorMessage(null) }}
                                            className="w-full bg-gray-700/50 border-gray-600 text-gray-100 py-2 px-4 text-sm"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <Button
                                            className="bg-blue-600 hover:bg-blue-700 text-white h-10"
                                            onClick={loadAnnouncements}
                                            disabled={loading || !courseId || !section}
                                        >
                                            {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                                            Fetch Announcements
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        <div className="space-y-4">
                            {announcements.length > 0 ? (
                                announcements.map((announcement) => (
                                    <Card key={announcement.id} className="bg-[#1c2237] rounded-lg p-6">
                                        {editingId === announcement.id ? (
                                            // Editing view
                                            <div className="flex flex-col">
                                                <div className="mb-4">
                                                    <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                                    <Input
                                                        id="title"
                                                        name="title"
                                                        value={editForm.title}
                                                        onChange={handleFormChange}
                                                        className="w-full bg-gray-700/50 border-gray-600 text-gray-100 py-2 px-4 text-sm"
                                                    />
                                                </div>
                                                
                                                <div className="mb-4">
                                                    <label htmlFor="content" className="block text-sm font-medium text-gray-400 mb-1">Content</label>
                                                    <Textarea
                                                        id="content"
                                                        name="content"
                                                        value={editForm.content}
                                                        onChange={handleFormChange}
                                                        className="w-full bg-gray-700/50 border-gray-600 text-gray-100 py-2 px-4 text-sm min-h-[150px]"
                                                    />
                                                </div>
                                                
                                                <div className="flex justify-end space-x-3 mt-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={handleEditCancel}
                                                        className="border-gray-600 text-gray-300 hover:text-white"
                                                    >
                                                        <X className="h-4 w-4 mr-2" />
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                        onClick={handleSaveEdit}
                                                        disabled={updating}
                                                    >
                                                        {updating ? (
                                                            <>
                                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Save className="h-4 w-4 mr-2" />
                                                                Save Changes
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            // Normal view
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="mb-2">
                                                        <h3 className="text-lg font-semibold text-white">{announcement.title}</h3>
                                                    </div>
                                                    <p className="text-gray-400 text-sm mb-3">
                                                        Posted by {announcement.teacherName} to {announcement.className} • {formatDate(announcement.createdAt)}
                                                    </p>
                                                    <p className="text-gray-300 whitespace-pre-line">{announcement.content}</p>
                                                    {announcement.fileUrls?.length > 0 && (
                                                        <div className="mt-4">
                                                            <p className="text-gray-400 text-sm mb-2">
                                                                {announcement.fileUrls.length > 1 ? 'Attachments:' : 'Attachment:'}
                                                            </p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {announcement.fileUrls.map((fileUrl, index) => (
                                                                    <a key={index} href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">
                                                                        File {index + 1}
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex space-x-2 ml-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                                                        onClick={() => handleEditStart(announcement)}
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
                                        )}
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
                                            onClick={handleCreateNew}
                                        >
                                            <Plus className="h-4 w-4 mr-2" /> Create Your First Announcement
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