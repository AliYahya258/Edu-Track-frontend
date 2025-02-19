'use client'

import { useState } from 'react'
import AdminSidebar from "@/components/admin/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminTeacherDetails() {
    const [teacherId, setTeacherId] = useState('')
    const [teacherInfo, setTeacherInfo] = useState(null)
    const [sections, setSections] = useState([])
    const [errorMessage, setErrorMessage] = useState(null)
    const [loading, setLoading] = useState(false)

    const fetchTeacherDetails = async () => {
        if (!teacherId.trim()) {
            setErrorMessage("Teacher ID cannot be empty.")
            return
        }

        setLoading(true)
        setErrorMessage(null)
        try {
            const userData = sessionStorage.getItem('userData')

            if (!userData) {
                setErrorMessage("No userData found in session storage.")
                return
            }

            const parsedData = JSON.parse(userData)
            const token = parsedData.accessToken

            if (!token) {
                setErrorMessage("No token found in userData.")
                return
            }

            const response = await fetch(`http://localhost:8081/api/teachers/info/${teacherId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                setTeacherInfo(data.teacherInfo)
                setSections(data.sections)
                setErrorMessage(null)
            } else {
                const errorData = await response.json()
                setErrorMessage(errorData.message || "Failed to fetch teacher details.")
                setTeacherInfo(null)
                setSections([])
            }
        } catch (error) {
            setErrorMessage("An error occurred while fetching teacher details.")
            console.error("Error:", error)
            setTeacherInfo(null)
            setSections([])
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        setTeacherId(e.target.value)
    }

    return (
        <div className="min-h-screen bg-[#1a1f2e]">
            <div className="grid grid-cols-[auto_1fr]">
                <AdminSidebar />
                <main className="p-8">
                    <div className="max-w-[1400px] mx-auto">
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Get Teacher Info</h1>
                            <p className="text-gray-400">Enter a teacher ID to get their details.</p>
                        </header>

                        {errorMessage && (
                            <div className="bg-red-600/10 border border-red-600/20 text-red-500 p-3 rounded-md mb-4">
                                {errorMessage}
                            </div>
                        )}

                        <div className="bg-[#1c2237] rounded-lg overflow-hidden p-6 mb-8">
                            <div className="grid gap-4">
                                <Label htmlFor="teacherId" className="text-white">Teacher ID</Label>
                                <Input
                                    id="teacherId"
                                    value={teacherId}
                                    onChange={handleInputChange}
                                    placeholder="Enter teacher ID"
                                    className="bg-[#2c3547] text-white"
                                />
                                <Button onClick={fetchTeacherDetails} className="mt-4" disabled={loading}>
                                    {loading ? "Loading..." : "Search Teacher"}
                                </Button>
                            </div>
                        </div>

                        {teacherInfo && (
                            <div className="bg-[#1c2237] rounded-lg overflow-hidden p-6 text-white">
                                <h2 className="text-2xl font-bold mb-4">Teacher Details</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Username</Label>
                                        <p>{teacherInfo.username}</p>
                                    </div>
                                    <div>
                                        <Label>Email</Label>
                                        <p>{teacherInfo.email}</p>
                                    </div>
                                    <div>
                                        <Label>Department</Label>
                                        <p>{teacherInfo.department}</p>
                                    </div>
                                    <div>
                                        <Label>Office Hours</Label>
                                        <p>{teacherInfo.officeHours}</p>
                                    </div>
                                    <div>
                                        <Label>Qualification</Label>
                                        <p>{teacherInfo.qualification}</p>
                                    </div>
                                    <div>
                                        <Label>Specialization</Label>
                                        <p>{teacherInfo.specialization || "N/A"}</p>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold mb-4">Sections and Courses</h2>
                                        <div className="mb-6">
                                            <Label>Sections</Label>
                                            {sections.length > 0 ? (
                                                <ul className="list-disc ml-6">
                                                    {sections.map((section) => (
                                                        <li key={section.sectionId}>
                                                            <strong>Section: </strong> {section.sectionName} ( {section.sectionId} )
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>No sections available.</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label>Courses</Label>
                                            {sections.length > 0 ? (
                                                <ul className="list-disc ml-6">
                                                    {sections.map((section) => (
                                                        <li key={section.sectionId}>
                                                            <strong>Course: </strong> {section.courseName} ( {section.courseId} )
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>No courses available.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}
