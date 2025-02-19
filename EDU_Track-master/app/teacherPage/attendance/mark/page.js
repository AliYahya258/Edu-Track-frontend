'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import TeacherSidebar from '@/components/teacher/sidebar';
import {
    ToastProvider,
    ToastViewport,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose,
} from '@/components/ui/toast';

const AttendanceComponent = () => {
    const [studentId, setStudentId] = useState('');
    const [courseName, setCourseName] = useState('');
    const [attendanceDate, setAttendanceDate] = useState('');
    const [isPresent, setIsPresent] = useState(false);

    const [sectionId, setSectionId] = useState('');
    const [courseId, setCourseId] = useState('');
    const [bulkAttendanceDate, setBulkAttendanceDate] = useState('');
    const [students, setStudents] = useState([
        { id: 24, name: 'Ali Yahya' },
        { id: 1602, name: 'abc' },
    ]);
    const [attendanceStatus, setAttendanceStatus] = useState({});
    const [toasts, setToasts] = useState([]);

    const addToast = (title, description, variant = 'default') => {
        const newToast = { id: Date.now(), title, description, variant };
        setToasts((prev) => [...prev, newToast]);
    };

    const handleIndividualAttendance = async (e) => {
        e.preventDefault();
        try {
            const userData = sessionStorage.getItem('userData');
            if (!userData) {
                setErrorMessage("No userData found in session storage");
                return;
            }

            const parsedData = JSON.parse(userData);
            const token = parsedData.accessToken;

            if (!token) {
                setErrorMessage("No token found in userData");
                return;
            }
            const response = await fetch(`http://localhost:8081/api/attendance/mark?studentId=${studentId}&courseName=${courseName}&attendanceDate=${attendanceDate}&isPresent=${isPresent}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId,
                    courseName,
                    attendanceDate,
                    isPresent: isPresent ? 1 : 0,
                }),
            });
            const data = await response.json();
            addToast('Success', data.message);
        } catch (error) {
            addToast('Error', 'Failed to mark attendance', 'destructive');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="grid grid-cols-[auto_1fr]">
                <TeacherSidebar />
                <main className="overflow-auto">
                    <Card className="bg-gray-800 border-gray-700 max-w-5xl mx-auto mt-10">
                        <CardContent className="p-8">
                            <h1 className="text-3xl font-bold text-white mb-6">Attendance System</h1>

                            {/* Individual Attendance */}
                            <form onSubmit={handleIndividualAttendance} className="space-y-6 mb-10">
                                <h2 className="text-xl font-semibold text-white mb-4">
                                    Individual Attendance
                                </h2>
                                <div>
                                    <Label htmlFor="studentId" className="text-white mb-2 block">
                                        Student ID
                                    </Label>
                                    <Input
                                        id="studentId"
                                        value={studentId}
                                        onChange={(e) => setStudentId(e.target.value)}
                                        className="bg-gray-700 text-white border-gray-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="courseName" className="text-white mb-2 block">
                                        Course Name
                                    </Label>
                                    <Input
                                        id="courseName"
                                        value={courseName}
                                        onChange={(e) => setCourseName(e.target.value)}
                                        className="bg-gray-700 text-white border-gray-600"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="attendanceDate" className="text-white mb-2 block">
                                        Attendance Date
                                    </Label>
                                    <Input
                                        id="attendanceDate"
                                        type="date"
                                        value={attendanceDate}
                                        onChange={(e) => setAttendanceDate(e.target.value)}
                                        className="bg-gray-700 text-white border-gray-600"
                                        required
                                    />
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Checkbox
                                        id="isPresent"
                                        checked={isPresent}
                                        onCheckedChange={(checked) => setIsPresent(checked)}
                                    />
                                    <Label htmlFor="isPresent" className="text-white">
                                        Present
                                    </Label>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2"
                                >
                                    Mark Attendance
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </main>
            </div>

            {/* Toast Notifications */}
            <ToastProvider>
                <ToastViewport />
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        variant={toast.variant}
                        className="bg-green-700 text-white"
                    >
                        <div>
                            <ToastTitle>{toast.title}</ToastTitle>
                            <ToastDescription>{toast.description}</ToastDescription>
                        </div>
                        <ToastClose />
                    </Toast>
                ))}
            </ToastProvider>
        </div>
    );
};

export default AttendanceComponent;
