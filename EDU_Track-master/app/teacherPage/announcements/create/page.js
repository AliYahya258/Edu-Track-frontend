'use client'

import React, { useState } from 'react'
import TeacherSidebar from '@/components/teacher/sidebar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Send, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CreateAnnouncementPage() {
    const router = useRouter()
    const [submitLoading, setSubmitLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        courseId: '',
        sectionName: '',
    })

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

    const postAnnouncement = async (announcementData) => {
        const userData = sessionStorage.getItem('userData')
        if (!userData) {
            throw new Error("Not logged in")
        }

        const parsedData = JSON.parse(userData)
        const token = parsedData.accessToken

        if (!token) {
            throw new Error("Invalid user session")
        }

        // Using the corrected API endpoint structure
        const response = await fetch(`http://localhost:8081/api/announcements/courseId/sectionName`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            // The request body is simplified to match the API structure
            body: JSON.stringify({
                title: formData.title,
                content: formData.content,
                sectionName: formData.sectionName,
                courseId: parseInt(formData.courseId) // Convert to number as API expects
            })
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Failed to create announcement')
        }

        return await response.json()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!formData.title || !formData.content || !formData.courseId || !formData.sectionName) {
            setErrorMessage('Please fill all required fields')
            return
        }

        setSubmitLoading(true)
        setErrorMessage(null)
        setSuccessMessage(null)

        try {
            // Simplified announcement data structure to match API expectations
            const announcementData = {
                title: formData.title,
                content: formData.content,
                sectionName: formData.sectionName,
                courseId: parseInt(formData.courseId) // Convert to number as the API expects
            }

            await postAnnouncement(announcementData)
            setSuccessMessage('Announcement created successfully!')

            // Reset form after successful submission
            setFormData({
                title: '',
                content: '',
                courseId: '',
                sectionName: '',
            })

            // Redirect to view announcements after 2 seconds
            setTimeout(() => {
                router.push('/teacherPage/announcements/view')
            }, 2000)

        } catch (error) {
            setErrorMessage(`Error creating announcement: ${error.message}`)
        } finally {
            setSubmitLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#1a1f2e]">
            <div className="grid grid-cols-[auto_1fr]">
                <TeacherSidebar />
                <main className="p-8">
                    <div className="max-w-[1000px] mx-auto">
                        {/* Page Header */}
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Create Announcement</h1>
                            <p className="text-gray-400">Create and post announcements to your classes</p>
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

                        {/* Create Announcement Form */}
                        <Card className="bg-[#1c2237] rounded-lg p-6 mb-6">
                            <CardHeader className="pb-4 pt-0">
                                <h2 className="text-xl font-semibold text-white">New Announcement</h2>
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

                                        {/* Course and Section IDs */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Course ID */}
                                            <div>
                                                <label htmlFor="courseId" className="block text-sm font-medium text-gray-300 mb-1">
                                                    Course ID *
                                                </label>
                                                <Input
                                                    id="courseId"
                                                    name="courseId"
                                                    placeholder="Enter course ID (numeric)"
                                                    value={formData.courseId}
                                                    onChange={handleInputChange}
                                                    type="number"
                                                    className="w-full bg-gray-700/50 border-gray-600 text-gray-100 py-2 px-4 text-sm"
                                                    required
                                                />
                                            </div>

                                            {/* Section Name */}
                                            <div>
                                                <label htmlFor="sectionName" className="block text-sm font-medium text-gray-300 mb-1">
                                                    Section Name *
                                                </label>
                                                <Input
                                                    id="sectionName"
                                                    name="sectionName"
                                                    placeholder="Enter section name"
                                                    value={formData.sectionName}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-gray-700/50 border-gray-600 text-gray-100 py-2 px-4 text-sm"
                                                    required
                                                />
                                            </div>
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

                                        {/* Importance field removed since it's not required by the API */}

                                        {/* Submit Button */}
                                        <div className="pt-4">
                                            <Button
                                                type="submit"
                                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6"
                                                disabled={submitLoading}
                                            >
                                                {submitLoading ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                        Posting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="h-4 w-4 mr-2" />
                                                        Post Announcement
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Guidelines Card */}
                        <Card className="bg-[#1c2237] rounded-lg p-6">
                            <CardHeader className="pb-2 pt-0">
                                <h2 className="text-lg font-semibold text-white">Announcement Guidelines</h2>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-gray-300 text-sm space-y-2 list-disc pl-5">
                                    <li>Keep announcement titles concise and clear</li>
                                    <li>Provide all necessary details in the content</li>
                                    <li>Set the appropriate importance level</li>
                                    <li>For urgent announcements, consider sending an additional email</li>
                                    <li>Students will receive notifications based on their preference settings</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}