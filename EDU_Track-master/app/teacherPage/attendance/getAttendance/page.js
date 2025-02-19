'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TeacherSidebar from "@/components/teacher/sidebar";

export default function GetAttendance() {
    const [courseName, setCourseName] = useState('');
    const [courseId, setCourseId] = useState('');
    const [studentId, setStudentId] = useState('');
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    const fetchAttendanceByCourse = async () => {
        setLoading(true);
        setError('');
        setAttendance([]);

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

            const attendanceResponse = await fetch(`http://localhost:8081/api/attendance/course/${courseName}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!attendanceResponse.ok) {
                throw new Error('Failed to fetch attendance');
            }

            const attendanceData = await attendanceResponse.json();
            setAttendance(attendanceData);
        } catch (err) {
            setError('Error fetching data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendanceByStudent = async () => {
        setLoading(true);
        setError('');
        setAttendance([]);

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

            const attendanceResponse = await fetch(`http://localhost:8081/api/attendance/student/${studentId}/course/${courseId}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!attendanceResponse.ok) {
                throw new Error('Failed to fetch attendance');
            }

            const attendanceData = await attendanceResponse.json();
            setAttendance(attendanceData);
        } catch (err) {
            setError('Error fetching data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCourseSubmit = (e) => {
        e.preventDefault();
        fetchAttendanceByCourse();
    };

    const handleStudentSubmit = (e) => {
        e.preventDefault();
        fetchAttendanceByStudent();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="grid grid-cols-[auto_1fr]">
                <TeacherSidebar />
                <main className="overflow-auto">
                    <Card className="bg-gray-800 border-gray-700 max-w-5xl mx-auto">
                        <CardContent className="p-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Get Attendance</h1>
                            <p className="text-gray-400 mb-6">Below is the attendance for the selected course and/or student.</p>

                            {/* Form for Course Attendance */}
                            <form onSubmit={handleCourseSubmit} className="space-y-6 mb-8">
                                    <div>
                                        <Label htmlFor="courseName" className="text-white mb-2 block">Course Name</Label>
                                        <Input
                                            id="courseName"
                                            value={courseName}
                                            onChange={(e) => setCourseName(e.target.value)}
                                            className="bg-gray-700 text-white border-gray-600"
                                            required
                                        />
                                    </div>
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2">
                                    {courseName ? 'Show Course Attendance' : 'Enter Course Name'}
                                </Button>
                            </form>

                            {/* Form for Student Attendance */}
                            <h1 className="text-gray-400 mb-6 text-center">OR</h1>
                            <form onSubmit={handleStudentSubmit} className="space-y-6 mb-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="courseId" className="text-white mb-2 block">Course Id</Label>
                                        <Input
                                            id="courseId"
                                            value={courseId}
                                            onChange={(e) => setCourseId(e.target.value)}
                                            className="bg-gray-700 text-white border-gray-600"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="studentId" className="text-white mb-2 block">Student ID</Label>
                                        <Input
                                            id="studentId"
                                            value={studentId}
                                            onChange={(e) => setStudentId(e.target.value)}
                                            className="bg-gray-700 text-white border-gray-600"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2">
                                    {courseId && studentId ? 'Show Student Attendance' : 'Enter Course ID & Student ID'}
                                </Button>
                            </form>

                            {loading && <p className="text-white">Loading...</p>}
                            {error && <p className="text-red-500">{error}</p>}
                            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                            {/* Display Attendance Data */}
                            {attendance.length > 0 && (
                                <div className="mb-10 overflow-x-auto">
                                    <h2 className="text-2xl font-bold text-white mb-4">Attendance</h2>
                                    <Table className="w-full">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-white">Attendance Date</TableHead>
                                                <TableHead className="text-white">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {attendance.map((record) => (
                                                <TableRow key={record.id}>
                                                    <TableCell className="text-white">{record.attendanceDate}</TableCell>
                                                    <TableCell className="text-white">{record.present ? 'Present' : 'Absent'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}
