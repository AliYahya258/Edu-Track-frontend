'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from "@/components/admin/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    ToastProvider,
    ToastViewport,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose,
} from "@/components/ui/toast";

// Reusable form field component
function FormField({ id, label, value, onChange, placeholder }) {
    return (
        <div>
            <Label htmlFor={id} className="text-white">{label}</Label>
            <Input
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="bg-[#2c3547] text-white"
            />
        </div>
    );
}

export default function AdminTeacherInfo() {
    const [teacherId, setTeacherId] = useState('');
    const [courseId, setCourseId] = useState('');
    const [sectionId, setSectionId] = useState('');
    const [teacherData, setTeacherData] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastVariant, setToastVariant] = useState('default');

    // Assign Course to Teacher
    const assignCourseToTeacher = async () => {
        if (!teacherId || !courseId || !sectionId) {
            showToast("Please fill out all fields.", "destructive");
            return;
        }

        try {
            const userData = sessionStorage.getItem('userData');
            if (!userData) {
                showToast("No user data found in session storage.", "destructive");
                return;
            }

            const parsedData = JSON.parse(userData);
            const token = parsedData.accessToken;

            if (!token) {
                showToast("No token found in user data.", "destructive");
                return;
            }

            setIsLoading(true);

            const response = await fetch(`http://localhost:8081/api/teachers/assigncourse/${teacherId}/course/${courseId}/section/${sectionId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTeacherData(data);
                setIsDialogOpen(true);
                showToast(data.message || "Course assigned successfully!", "default");
            } else {
                const errorData = await response.json();
                showToast(errorData.message || "Failed to assign course.", "destructive");
            }
        } catch (error) {
            showToast("An error occurred while assigning the course.", "destructive");
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to show toast
    const showToast = (message, variant = 'default') => {
        setToastMessage(message);
        setToastVariant(variant);
    };

    return (
        <ToastProvider>
            <div className="min-h-screen bg-[#1a1f2e]">
                <div className="grid grid-cols-[auto_1fr]">
                    <AdminSidebar />
                    <main className="p-8">
                        <div className="max-w-[1400px] mx-auto">
                            <header className="mb-8">
                                <h1 className="text-3xl font-bold text-white mb-2">Assign Course</h1>
                                <p className="text-gray-400">Enter teacher ID, course ID, and section ID to assign a course.</p>
                            </header>

                            <div className="bg-[#1c2237] rounded-lg overflow-hidden p-6">
                                <div className="grid gap-4">
                                    <FormField
                                        id="teacherId"
                                        label="Teacher ID"
                                        value={teacherId}
                                        onChange={(e) => setTeacherId(e.target.value)}
                                        placeholder="Enter teacher ID"
                                    />
                                    <FormField
                                        id="courseId"
                                        label="Course ID"
                                        value={courseId}
                                        onChange={(e) => setCourseId(e.target.value)}
                                        placeholder="Enter course ID"
                                    />
                                    <FormField
                                        id="sectionId"
                                        label="Section ID"
                                        value={sectionId}
                                        onChange={(e) => setSectionId(e.target.value)}
                                        placeholder="Enter section ID"
                                    />
                                    <Button onClick={assignCourseToTeacher} className="mt-4 ml-4" disabled={isLoading}>
                                        {isLoading ? "Assigning..." : "Assign Course to Teacher"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Toast Viewport */}
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
        </ToastProvider>
    );
}
