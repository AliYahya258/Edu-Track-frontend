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

export default function CreateNewFee() {
    const [studentId, setStudentId] = useState('')
    const [totalAmount, setTotalAmount] = useState('')
    const [period, setPeriod] = useState('')
    const [responseMessage, setResponseMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    // Create or update fee for a student
    const createNewFee = async () => {
        // Reset previous messages before a new request
        setResponseMessage(null)
        setErrorMessage(null)

        // Check if input fields are valid
        if (!studentId || !totalAmount || !period) {
            setErrorMessage("Student ID, Total Amount, and Period are required.")
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

            const response = await fetch(`http://localhost:8081/api/fees/admin/student/${studentId}/create-or-update?totalAmount=${totalAmount}&period=${period}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })

            // Handle response based on the status code
            if (!response.ok) {
                const errorData = await response.json()
                setErrorMessage(errorData.message || "An unexpected error occurred")
                return
            }

            const data = await response.json()
            setResponseMessage(`Fee Created/Updated: Total Amount: ${data.totalAmount}, Period: ${data.period}`) // Display message from the backend response
        } catch (error) {
            // This block will only execute if there's a network error or other non-HTTP-related issues
            console.error("Error during API request:", error) // You can log the error to the console for debugging
            setErrorMessage("An error occurred while creating/updating the fee")
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
                                <h1 className="text-3xl font-bold text-white mb-2">Create or Update Fee</h1>
                                <p className="text-gray-400">Enter student ID, total amount, and period to create or update a fee.</p>
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
                                        <Label htmlFor="studentId" className="text-white">Student ID</Label>
                                        <Input
                                            id="studentId"
                                            value={studentId}
                                            onChange={(e) => setStudentId(e.target.value)}
                                            placeholder="Enter student ID"
                                            className="bg-[#2c3547] text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="totalAmount" className="text-white">Total Amount</Label>
                                        <Input
                                            id="totalAmount"
                                            type="number"
                                            value={totalAmount}
                                            onChange={(e) => setTotalAmount(e.target.value)}
                                            placeholder="Enter total amount"
                                            className="bg-[#2c3547] text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="period" className="text-white">Period</Label>
                                        <Input
                                            id="period"
                                            value={period}
                                            onChange={(e) => setPeriod(e.target.value)}
                                            placeholder="Enter period (e.g., Fall 2024)"
                                            className="bg-[#2c3547] text-white"
                                        />
                                    </div>
                                    <Button onClick={createNewFee} className="mt-4 ml-4">
                                        Create Fee
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
