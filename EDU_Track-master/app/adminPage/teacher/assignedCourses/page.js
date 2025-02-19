'use client'

import { useState } from 'react'
import AdminSidebar from "@/components/admin/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function AdminTeacherAssignedCourses() {
    const [teacherId, setTeacherId] = useState('')
    const [assignedCourses, setAssignedCourses] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    // Get Assigned Courses by Teacher ID
    const getAssignedCourses = async () => {
        try {
            const userData = sessionStorage.getItem('userData')

            if (!userData) {
                setErrorMessage("No userData found in session storage")
                return
            }

            const parsedData = JSON.parse(userData)
            const token = parsedData.accessToken

            if (!token) {
                setErrorMessage("No token found in userData")
                return
            }

            const response = await fetch(`http://localhost:8081/api/teachers/${teacherId}/getassignedcourses`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })

            if (response.ok) {
                const data = await response.json()
                setAssignedCourses(data)
            } else {
                const errorData = await response.json()
                setErrorMessage(errorData.message || "Failed to fetch assigned courses")
            }
        } catch (error) {
            setErrorMessage("An error occurred while fetching assigned courses")
            console.error("Error:", error)
        }
    }

    return (
        <div className="min-h-screen bg-[#1a1f2e]">
            <div className="grid grid-cols-[auto_1fr]">
                <AdminSidebar />
                <main className="p-8">
                    <div className="max-w-[1400px] mx-auto">
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Assigned Courses</h1>
                            <p className="text-gray-400">Enter teacher ID to view assigned courses.</p>
                        </header>

                        {errorMessage && (
                            <div className="bg-red-600/10 border border-red-600/20 text-red-500 p-3 rounded-md mb-4">
                                {errorMessage}
                            </div>
                        )}

                        <div className="bg-[#1c2237] rounded-lg overflow-hidden p-6">
                            <div className="grid gap-4">
                                <div>
                                    <Label htmlFor="teacherId" className="text-white">Teacher ID</Label>
                                    <Input
                                        id="teacherId"
                                        value={teacherId}
                                        onChange={(e) => setTeacherId(e.target.value)}
                                        placeholder="Enter teacher ID"
                                        className="bg-[#2c3547] text-white"
                                    />
                                </div>
                                <Button onClick={getAssignedCourses} className="mt-4 ml-4">
                                    Get Assigned Courses
                                </Button>
                            </div>
                        </div>

                        {assignedCourses && (
                            <div className="mt-8 bg-[#2c3547] rounded-lg p-6">
                                {assignedCourses.length === 0 ? (
                                    <p className="text-white">No assigned courses found.</p>
                                ) : (
                                    assignedCourses.map((course) => (
                                        <div key={course.courseId} className="mb-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Course Name</Label>
                                                    <p>{course.courseName}</p>
                                                </div>
                                                <div>
                                                    <Label>Course Code</Label>
                                                    <p>{course.courseCode}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                                <div>
                                                    <Label>Description</Label>
                                                    <p>{course.description}</p>
                                                </div>
                                                <div>
                                                    <Label>Credit Hours</Label>
                                                    <p>{course.creditHours}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                                <div>
                                                    <Label>Semester</Label>
                                                    <p>{course.semester}</p>
                                                </div>
                                                <div>
                                                    <Label>Field of Study</Label>
                                                    <p>{course.fieldOfStudy}</p>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <Label>Examinations</Label>
                                                <ul className="space-y-2">
                                                    {course.examinations.map((exam) => (
                                                        <li key={exam.id}>
                                                            <p><strong>Exam Type:</strong> {exam.examType}</p>
                                                            <p><strong>Exam Date:</strong> {exam.examDate}</p>
                                                            <p><strong>Location:</strong> {exam.examLocation}</p>
                                                            <p><strong>Duration:</strong> {exam.duration} minutes</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="mt-4">
                                                <Label>Sections</Label>
                                                <ul className="space-y-2">
                                                    {course.sections.map((section) => (
                                                        <li key={section.id}>
                                                            <p><strong>Section Name:</strong> {section.sectionName}</p>
                                                            <p><strong>Student Count:</strong> {section.studentCount}</p>
                                                            <div>
                                                                <Label>Enrollments</Label>
                                                                <ul className="space-y-1">
                                                                    {section.enrollments.map((enrollment) => (
                                                                        <li key={enrollment.id}>
                                                                            <p><strong>Semester:</strong> {enrollment.semester}</p>
                                                                            <p><strong>Backlog:</strong> {enrollment.isBacklog ? 'Yes' : 'No'}</p>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}
