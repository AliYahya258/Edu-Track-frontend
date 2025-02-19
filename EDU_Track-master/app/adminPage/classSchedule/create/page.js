"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { PlusCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AdminSidebar from "@/components/admin/sidebar"
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from "@/components/ui/toast"

const CreateSchedule = () => {
    const [formData, setFormData] = useState({
        courseName: "",
        sectionName: "",
        teacherName: "",
        startTime: "",
        endTime: "",
        classroom: "",
        day: "",
        semester: "",
    })
    const [loading, setLoading] = useState(false)
    const [toastMessage, setToastMessage] = useState(null)
    const [toastVariant, setToastVariant] = useState("default")

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const formatTime = (time) => {
        const [hours, minutes] = time.split(":")
        return `${hours}:${minutes}:00`
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setToastMessage(null)

        try {
            const userData = sessionStorage.getItem("userData")

            if (!userData) {
                setToastMessage("No user data found in session storage. Please log in again.")
                setToastVariant("destructive")
                setLoading(false)
                return
            }

            const parsedData = JSON.parse(userData)
            const token = parsedData.accessToken

            if (!token) {
                setToastMessage("Authentication token missing. Please log in again.")
                setToastVariant("destructive")
                setLoading(false)
                return
            }

            const requestData = {
                ...formData,
                startTime: formatTime(formData.startTime),
                endTime: formatTime(formData.endTime),
            }

            const response = await fetch("http://localhost:8081/api/schedules/save", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            })

            if (response.ok) {
                const data = await response.json()
                setToastMessage(data.message || "Schedule created successfully!")
                setToastVariant("default")
                setFormData({
                    courseName: "",
                    sectionName: "",
                    teacherName: "",
                    startTime: "",
                    endTime: "",
                    classroom: "",
                    day: "",
                    semester: "",
                })
            } else if (response.status === 401) {
                setToastMessage("Session expired or unauthorized access. Please log in again.")
                setToastVariant("destructive")
            } else {
                const errorData = await response.json()
                setToastMessage(errorData.message || "Failed to create new schedule.")
                setToastVariant("destructive")
            }
        } catch (error) {
            console.error("Error creating new schedule:", error)
            setToastMessage("Failed to create new schedule. Please try again later.")
            setToastVariant("destructive")
        } finally {
            setLoading(false)
        }
    }

    return (
        <ToastProvider>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
                <div className="grid grid-cols-[auto_1fr]">
                    <AdminSidebar />
                    <main className="overflow-auto p-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="bg-gray-800 border-gray-700 max-w-2xl mx-auto shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-3xl font-bold text-white flex items-center gap-2">
                                        <PlusCircle className="w-8 h-8 text-blue-500" />
                                        Create New Schedule
                                    </CardTitle>
                                    <CardDescription className="text-gray-400">
                                        Enter the details to create a new class schedule.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.keys(formData).map((field) => (
                                                <div key={field}>
                                                    <Label htmlFor={field} className="text-white mb-2 block">
                                                        {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                                                    </Label>
                                                    {field === "day" ? (
                                                        <Select onValueChange={(value) => handleInputChange({ target: { name: field, value } })}>
                                                            <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600">
                                                                <SelectValue placeholder="Select a day" />
                                                            </SelectTrigger>
                                                            <SelectContent className="w-full bg-gray-800 text-white border-gray-600">
                                                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                                                                    <SelectItem key={day} value={day.toLowerCase()}>
                                                                        {day}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    ) : field === "semester" ? (
                                                        <Input
                                                            id={field}
                                                            name={field}
                                                            type="number"
                                                            min="1"
                                                            max="8"
                                                            value={formData[field]}
                                                            onChange={handleInputChange}
                                                            className="w-full bg-gray-700 text-white border-gray-600"
                                                            required
                                                        />
                                                    ) : (
                                                        <Input
                                                            id={field}
                                                            name={field}
                                                            value={formData[field]}
                                                            onChange={handleInputChange}
                                                            className="w-full bg-gray-700 text-white border-gray-600"
                                                            required
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 transition-colors duration-200"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <span className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Creating...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center">
                                                    <PlusCircle className="mr-2 h-5 w-5" />
                                                    Create Schedule
                                                </span>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </main>
                </div>
                <ToastViewport />

                {/* Toast */}
                {toastMessage && (
                    <Toast
                        className={toastVariant === "destructive" ? "bg-red-600" : "bg-green-600"}
                        onOpenChange={(isOpen) => !isOpen && setToastMessage(null)}
                    >
                        <ToastTitle>{toastVariant === "destructive" ? "Error" : "Success"}</ToastTitle>
                        <ToastDescription>{toastMessage}</ToastDescription>
                        <ToastClose />
                    </Toast>
                )}
            </div>
        </ToastProvider>
    )
}

export default CreateSchedule
