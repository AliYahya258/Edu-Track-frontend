'use client'

import React, { useState, useEffect } from 'react'
import TeacherSidebar from '@/components/teacher/sidebar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Save, Loader2, ArrowLeft } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function EditAnnouncementPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const announcementId = searchParams.get('id')

    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        classId: '',
        importance: 'normal',
    })

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                // Fetch classes and announcement data in parallel
                const [classData, announcementData] = await Promise.all([
                    fetchTeacherClasses(),
                    fetchAnnouncementById(announcementId)
                ])

                setClasses(classData)

                // Set form data from fetched announcement
                setFormData({
                    title: announcementData.title,
                    content: announcementData.content,
                    classId: announcementData.classId,
                    importance: announcementData.importance,
                })
            } catch (error) {
                setErrorMessage('Error fetching announcement data. Please try again.')
            } finally {
                setLoading(false)
            }
        }

        if (announcementId) {
            fetchData()
        } else {
            setErrorMessage('No announcement ID provided')
            setLoading(false)
        }
    }, [announcementId])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSelectChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!formData.title || !formData.content || !formData.classId) {
            setErrorMessage('Please fill all required fields')
            return
        }

        setSubmitLoading(true)
        setErrorMessage(null)
        setSuccessMessage(null)

        try {
            await updateAnnouncement(announcementId, formData)
            setSuccessMessage('Announcement updated successfully!')

            // Redirect to view announcements after 2 seconds
            setTimeout(() => {
                router.push('/teacherPage/announcements/view')
            }, 2000)

        } catch (error) {
            setErrorMessage('Error updating announcement. Please try again.')
        } finally {
            setSubmitLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1a1f2e]">
                <div className="grid grid-cols-[auto_1fr]">
                    <TeacherSidebar />
                    <main className="p-8 flex items-center justify-center">
                        <div className="flex flex-col items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                            <p className="text-gray-300">Loading announcement data...</p>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#1a1f2e]">
            <div className="grid grid-cols-[auto_1fr]">
                <TeacherSidebar />
                <main className="p-8">
                    <div className="max-w-[1000px] mx-auto">
                        {/* Page Header */}
                        <header className="mb-8">
                            <Button
                                variant="ghost"
                                className="text-gray-400 hover:text-white mb-4 -ml-2 flex items-center"
                                onClick={() => router.push('/teacherPage/announcements/view')}
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back to Announcements
                            </Button>

                            <h1 className="text-3xl font-bold text-white mb-2">Edit Announcement</h1>
                            <p className="text-gray-400">Update your announcement details</p>
                        </header>

                        {/* Error Message */}
                        {errorMessage && (
                            <div className="bg-red-600/10 border border-red-600/20 text-red-500 p-3 rounded-md mb-4 flex items-center">
                                <AlertCircle className="h-5 w-5 mr-2" />
                                {errorMessage}
                            </div>
                        )}

                        {/* Success Message */}
                        {successMessage && (
                            <div className="bg-green-600/10 border border-green-600/20 text-green-500 p-3 rounded-md mb-4 flex items-center">
                                <AlertCircle className="h-5 w-5 mr-2" />
                                {successMessage}
                            </div>
                        )}

                        {/* Edit Announcement Form */}
                        <Card className="bg-[#1c2237] rounded-lg p-6 mb-6">
                            <CardHeader className="pb-4 pt-0">
                                <h2 className="text-xl font-semibold text-white">Edit Announcement</h2>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-4">
                                        {/* Title */}
                                        <div>
                                            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                                                Title *
                                            </label>
                                            <Input
                                                id="title"
                                                name="title"
                                                placeholder="Enter announcement title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-700/50 border-gray-600 text-gray-100 py-2 px-4 text-sm"
                                                required
                                            />
                                        </div>

                                        {/* Content */}
                                        <div>
                                            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                                                Content *
                                            </label>
                                            <Textarea
                                                id="content"
                                                name="content"
                                                placeholder="Enter announcement content..."
                                                value={formData.content}
                                                onChange={handleInputChange}
                                                className="w-full min-h-[150px] bg-gray-700/50 border-gray-600 text-gray-100 py-2 px-4 text-sm"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Class Selection */}
                                            <div>
                                                <label htmlFor="classId" className="block text-sm font-medium text-gray-300 mb-1">
                                                    Class *
                                                </label>
                                                <Select
                                                    value={formData.classId}
                                                    onValueChange={(value) => handleSelectChange('classId', value)}
                                                >
                                                    <SelectTrigger className="w-full bg-gray-700/50 border-gray-600 text-gray-100 py-2 px-4 text-sm">
                                                        <SelectValue placeholder="Select a class" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-gray-800 border-gray-700">
                                                        {classes.map((classItem) => (
                                                            <SelectItem key={classItem.id} value={classItem.id}>
                                                                {classItem.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Importance */}
                                            <div>
                                                <label htmlFor="importance" className="block text-sm font-medium text-gray-300 mb-1">
                                                    Importance
                                                </label>
                                                <Select
                                                    value={formData.importance}
                                                    onValueChange={(value) => handleSelectChange('importance', value)}
                                                >
                                                    <SelectTrigger className="w-full bg-gray-700/50 border-gray-600 text-gray-100 py-2 px-4 text-sm">
                                                        <SelectValue placeholder="Select importance" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-gray-800 border-gray-700">
                                                        <SelectItem value="low">Low</SelectItem>
                                                        <SelectItem value="normal">Normal</SelectItem>
                                                        <SelectItem value="high">High</SelectItem>
                                                        <SelectItem value="urgent">Urgent</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="pt-4 flex justify-between">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="border-gray-600 text-gray-300 hover:text-white"
                                                onClick={() => router.push('/teacherPage/announcements/view')}
                                            >
                                                Cancel
                                            </Button>

                                            <Button
                                                type="submit"
                                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6"
                                                disabled={submitLoading}
                                            >
                                                {submitLoading ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
                                </form>
                            </CardContent>
                        </Card>

                        {/* Announcement Preview Card */}
                        <Card className="bg-[#1c2237] rounded-lg p-6">
                            <CardHeader className="pb-2 pt-0">
                                <h2 className="text-lg font-semibold text-white">Preview</h2>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-[#232a40] rounded-lg p-4 border border-gray-700/50">
                                    <div className="mb-2">
                                        <h3 className="text-lg font-semibold text-white">{formData.title || 'Announcement Title'}</h3>
                                        <p className="text-gray-400 text-sm">
                                            {formData.importance.charAt(0).toUpperCase() + formData.importance.slice(1)} Priority
                                        </p>
                                    </div>
                                    <div className="border-t border-gray-700/50 pt-3 mt-3">
                                        <p className="text-gray-300 whitespace-pre-line">
                                            {formData.content || 'Announcement content will appear here...'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}