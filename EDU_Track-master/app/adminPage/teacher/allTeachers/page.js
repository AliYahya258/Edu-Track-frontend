'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from "@/components/admin/sidebar"

export default function AdminTeacherList() {
    const [teachers, setTeachers] = useState([])
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        const fetchTeachers = async () => {
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

                const response = await fetch("http://localhost:8081/api/teachers/getinfoofall", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                })

                if (response.ok) {
                    const data = await response.json()
                    setTeachers(data)
                } else {
                    const errorData = await response.json()
                    setErrorMessage(errorData.message || "Failed to fetch teachers")
                }
            } catch (error) {
                setErrorMessage("An error occurred while fetching teachers.")
                console.error("Error:", error)
            }
        }

        fetchTeachers()
    }, [])

    return (
        <div className="min-h-screen bg-[#1a1f2e]">
            <div className="grid grid-cols-[auto_1fr]">
                <AdminSidebar />
                <main className="p-8">
                    <div className="max-w-[1400px] mx-auto">
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Teachers List</h1>
                            <p className="text-gray-400">Below is the list of all registered teachers.</p>
                        </header>

                        {errorMessage && (
                            <div className="bg-red-600/10 border border-red-600/20 text-red-500 p-3 rounded-md mb-4">
                                {errorMessage}
                            </div>
                        )}

                        <div className="bg-[#1c2237] rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                    <tr className="border-b border-gray-700/50">
                                        <th className="py-4 px-6 text-sm font-semibold text-gray-300">Username</th>
                                        <th className="py-4 px-6 text-sm font-semibold text-gray-300">Email</th>
                                        <th className="py-4 px-6 text-sm font-semibold text-gray-300">Department</th>
                                        <th className="py-4 px-6 text-sm font-semibold text-gray-300">Office Hours</th>
                                        <th className="py-4 px-6 text-sm font-semibold text-gray-300">Qualification</th>
                                        <th className="py-4 px-6 text-sm font-semibold text-gray-300">Specialization</th>
                                        <th className="py-4 px-6 text-sm font-semibold text-gray-300">Sections</th>
                                        <th className="py-4 px-6 text-sm font-semibold text-gray-300">Courses</th>
                                    </tr>
                                    </thead>
                                    <tbody className="text-gray-300">
                                    {teachers.length > 0 ? (
                                        teachers.map(({ teacherInfo, sections }) => (
                                            <tr
                                                key={teacherInfo.id}
                                                className="border-b border-gray-700/50 hover:bg-gray-700/10 transition-colors"
                                            >
                                                <td className="py-4 px-2 text-sm">{teacherInfo.username}</td>
                                                <td className="py-4 px-2 text-sm">{teacherInfo.email}</td>
                                                <td className="py-4 px-2 text-sm">{teacherInfo.department}</td>
                                                <td className="py-4 px-2 text-sm">{teacherInfo.officeHours}</td>
                                                <td className="py-4 px-2 text-sm">{teacherInfo.qualification}</td>
                                                <td className="py-4 px-2 text-sm">
                                                    {teacherInfo.specialization || "N/A"}
                                                </td>
                                                <td className="py-4 px-6 text-sm">
                                                    {sections.length > 0 ? (
                                                        <ul className="space-y-1">
                                                            {sections.map((section) => (
                                                                <li key={section.sectionId}>
                                                                    {section.sectionName} ({section.sectionId})
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        "No sections assigned"
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-sm">
                                                    {sections.length > 0 ? (
                                                        <ul className="space-y-1">
                                                            {sections.map((section) => (
                                                                <li key={section.sectionId}>
                                                                    {section.courseName} ({section.courseId})
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        "No courses assigned"
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="text-center py-8 text-gray-400"
                                            >
                                                No teachers found.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
