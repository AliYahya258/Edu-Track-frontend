'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminSidebar from "@/components/admin/sidebar"; // Admin Sidebar import

const Attendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [studentId, setStudentId] = useState(""); // Student ID input field
    const [error, setError] = useState(null);

    const fetchAttendanceData = async () => {
        try {
            const userData = sessionStorage.getItem('userData');

            if (!userData) {
                setError("No userData found in session storage");
                return;
            }

            const parsedData = JSON.parse(userData);
            const { accessToken: token } = parsedData;

            if (!token) {
                setError("Required data (token) not found in session storage");
                return;
            }

            // Fetch Attendance Data using studentId
            if (studentId) {
                const attendanceResponse = await fetch(`http://localhost:8081/api/attendance/student/${studentId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Token passed here
                        'Content-Type': 'application/json',
                    },
                });

                if (attendanceResponse.ok) {
                    const attendanceData = await attendanceResponse.json();
                    setAttendanceData(attendanceData);
                } else {
                    const errorText = await attendanceResponse.text();
                    throw new Error(`Failed to fetch attendance data: ${errorText}`);
                }
            } else {
                setError("Student ID is required.");
            }
        } catch (error) {
            console.error("Error fetching attendance data:", error);
            setError("Failed to fetch attendance data. Please try again later.");
        }
    };

    useEffect(() => {
        if (studentId) {
            fetchAttendanceData();
        }
    }, [studentId]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="grid grid-cols-[auto_1fr]">
                <AdminSidebar />
                <main className="overflow-auto">
                    <Card className="bg-gray-800 border-gray-700 max-w-5xl mx-auto">
                        <CardContent className="p-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Attendance Details</h1>
                            <p className="text-gray-400 mb-6">View attendance data for students.</p>

                            {/* Error handling */}
                            {error && <p className="text-red-500">{error}</p>}

                            {/* Input for Student ID */}
                            <div className="mb-6">
                                <input
                                    type="text"
                                    placeholder="Enter Student ID"
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                    className="bg-gray-700 text-white border-gray-600 w-full p-2 rounded-lg"
                                />
                                <button
                                    onClick={fetchAttendanceData}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 mt-4 rounded-lg"
                                >
                                    Get Attendance
                                </button>
                            </div>

                            {/* Attendance Table */}
                            <Card className="bg-gray-800/50 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-semibold text-center text-gray-100">Attendance Table</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table className="w-full">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-white">Date</TableHead>
                                                <TableHead className="text-white">Course Name</TableHead>
                                                <TableHead className="text-white">Section</TableHead>
                                                <TableHead className="text-white">Presence</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {attendanceData.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="text-white">{row.attendanceDate}</TableCell>
                                                    <TableCell className="text-white">{row.courseName}</TableCell>
                                                    <TableCell className="text-white">{row.sectionName}</TableCell>
                                                    <TableCell className={row.present ? 'text-green-500' : 'text-red-500'}>
                                                        {row.present ? 'Present' : 'Absent'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
};

export default Attendance;
