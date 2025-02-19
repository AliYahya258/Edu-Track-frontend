'use client'

import { useState } from 'react'
import AdminSidebar from "@/components/admin/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    ToastProvider,
    ToastViewport,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose,
} from "@/components/ui/toast"

export default function AdminRemoveAssignedCourse() {
    const [teacherId, setTeacherId] = useState('')
    const [courseId, setCourseId] = useState('')
    const [sectionId, setSectionId] = useState('')  // Added sectionId state
    const [responseMessage, setResponseMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    // const removeAssignedCourse = async () => {
    //     // Reset previous messages before a new request
    //     setResponseMessage(null)
    //     setErrorMessage(null)
    //
    //     // Check if input fields are valid
    //     if (!teacherId || !courseId || !sectionId) {
    //         setErrorMessage("Teacher ID, Course ID, and Section ID are required.")
    //         return
    //     }
    //
    //     try {
    //         const userData = sessionStorage.getItem('userData')
    //
    //         if (!userData) {
    //             setErrorMessage("No userData found in session storage")
    //             return
    //         }
    //
    //         const parsedData = JSON.parse(userData)
    //         const token = parsedData.accessToken
    //         if (!token) {
    //             setErrorMessage("No token found in userData")
    //             return
    //         }
    //
    //         const response = await fetch(`http://localhost:8081/api/teachers/${teacherId}/course/${courseId}/section/${sectionId}`, {
    //             method: "DELETE",
    //             headers: {
    //                 "Authorization": `Bearer ${token}`,
    //                 "Content-Type": "application/json",
    //             },
    //         })
    //
    //         // Handle response based on the status code
    //         if (!response.ok) {
    //             const errorData = await response.json()
    //             setErrorMessage(errorData.message)
    //             return
    //         }
    //
    //         const data = await response.json()
    //         setResponseMessage(data.message) // Display message from the backend response
    //     } catch (error) {
    //         // This block will only execute if there's a network error or other non-HTTP-related issues
    //         console.error("Error during API request:", error) // You can log the error to the console for debugging
    //         setErrorMessage("An error occurred while removing the course")
    //     }
    // }

    const removeAssignedCourse = async () => {
        // Reset previous messages before a new request
        setResponseMessage(null)
        setErrorMessage(null)

        // Check if input fields are valid
        if (!teacherId || !courseId || !sectionId) {
            setErrorMessage("Teacher ID, Course ID, and Section ID are required.")
            return
        }

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

            const response = await fetch(`http://localhost:8081/api/teachers/${teacherId}/course/${courseId}/section/${sectionId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })

            // Check if the response is not JSON (i.e., it's plain text)
            if (!response.ok) {
                const errorText = await response.text()  // Get the response as text
                setErrorMessage(errorText)  // Set error message as text response
                return
            }

            const data = await response.text()  // Parse response as plain text
            setResponseMessage(data)  // Set success message
        } catch (error) {
            // This block will only execute if there's a network error or other non-HTTP-related issues
            console.error("Error during API request:", error)
            setErrorMessage("An error occurred while removing the course")
        }
    }

    return (
        <ToastProvider>
            <div className="min-h-screen bg-[#1a1f2e]">
                <div className="grid grid-cols-[auto_1fr]">
                    <AdminSidebar />
                    <main className="p-8">
                        <div className="max-w-[1400px] mx-auto">
                            <header className="mb-8">
                                <h1 className="text-3xl font-bold text-white mb-2">Remove Assigned Course</h1>
                                <p className="text-gray-400">Enter teacher ID, course ID, and section ID to remove an assigned course.</p>
                            </header>

                            {/* Toast for error message */}
                            {errorMessage && (
                                <Toast
                                    className="bg-red-600"
                                    onOpenChange={(isOpen) => !isOpen && setErrorMessage(null)}
                                >
                                    <ToastTitle>Error</ToastTitle>
                                    <ToastDescription>{errorMessage}</ToastDescription>
                                    <ToastClose />
                                </Toast>
                            )}

                            {/* Toast for success message */}
                            {responseMessage && (
                                <Toast
                                    className="bg-green-600"
                                    onOpenChange={(isOpen) => !isOpen && setResponseMessage(null)}
                                >
                                    <ToastTitle>Success</ToastTitle>
                                    <ToastDescription>{responseMessage}</ToastDescription>
                                    <ToastClose />
                                </Toast>
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
                                    <div>
                                        <Label htmlFor="courseId" className="text-white">Course ID</Label>
                                        <Input
                                            id="courseId"
                                            value={courseId}
                                            onChange={(e) => setCourseId(e.target.value)}
                                            placeholder="Enter course ID"
                                            className="bg-[#2c3547] text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="sectionId" className="text-white">Section ID</Label>
                                        <Input
                                            id="sectionId"
                                            value={sectionId}
                                            onChange={(e) => setSectionId(e.target.value)}
                                            placeholder="Enter section ID"
                                            className="bg-[#2c3547] text-white"
                                        />
                                    </div>
                                    <Button onClick={removeAssignedCourse} className="mt-4 ml-4">
                                        Remove Assigned Course
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
                {/* Toast Viewport */}
                <ToastViewport />
            </div>
        </ToastProvider>
    )
}
