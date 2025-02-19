'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminSidebar from '@/components/admin/sidebar';

const CourseSchedule = () => {
    const [courseId, setCourseId] = useState('');
    const [schedule, setSchedule] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchSchedule = async () => {
        setErrorMessage(null);
        setLoading(true);

        try {
            const userData = sessionStorage.getItem('userData');

            if (!userData) {
                setErrorMessage("No user data found in session storage. Please log in again.");
                setLoading(false);
                return;
            }

            const parsedData = JSON.parse(userData);
            const token = parsedData.accessToken;

            if (!token) {
                setErrorMessage("Authentication token missing. Please log in again.");
                setLoading(false);
                return;
            }

            const response = await fetch(`http://localhost:8081/api/schedules/course/${courseId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                setErrorMessage("Unauthorized access. Please log in again.");
                setLoading(false);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch course schedule');
            }

            const data = await response.json();
            setSchedule(data);
        } catch (error) {
            console.error('Error fetching course schedule:', error);
            setErrorMessage("Failed to fetch course schedule. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (courseId.trim()) {
            fetchSchedule();
        } else {
            setErrorMessage("Please enter a valid Course ID.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="grid grid-cols-[auto_1fr]">
                <AdminSidebar />
                <main className="overflow-auto p-6">
                    <Card className="bg-gray-800 border-gray-700 max-w-5xl mx-auto">
                        <CardContent className="p-8">
                            <h1 className="text-3xl font-bold text-white mb-4">Course Schedule</h1>
                            <p className="text-gray-400 mb-6">Enter a Course ID to view the schedule.</p>
                            <form onSubmit={handleSubmit} className="space-y-6 mb-8">
                                <div className="w-full grid grid-cols-1 gap-4">
                                    <div>
                                        <Label htmlFor="courseId" className="text-white mb-2 block">Course ID</Label>
                                        <Input
                                            id="courseId"
                                            value={courseId}
                                            placeholder={"Enter a Course ID"}
                                            onChange={(e) => setCourseId(e.target.value)}
                                            className="w-full bg-gray-700 text-white border-gray-600" // Full width for the input field
                                            required
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2">
                                    Get Schedule
                                </Button>
                            </form>

                            {loading && <p className="text-white">Loading...</p>}
                            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                            {!loading && schedule.length === 0 && !errorMessage && (
                                <p className="text-gray-400">No schedule found for this course.</p>
                            )}

                            {schedule.length > 0 && (
                                <div className="overflow-x-auto mt-6">
                                    <h2 className="text-2xl font-bold text-white mb-4">Course Schedule</h2>
                                    <Table className="w-full">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-white">Section</TableHead>
                                                <TableHead className="text-white">Teacher</TableHead>
                                                <TableHead className="text-white">Day</TableHead>
                                                <TableHead className="text-white">Time</TableHead>
                                                <TableHead className="text-white">Classroom</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {schedule.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="text-white">{item.sectionName}</TableCell>
                                                    <TableCell className="text-white">{item.teacherName}</TableCell>
                                                    <TableCell className="text-white">{item.day}</TableCell>
                                                    <TableCell className="text-white">{`${item.startTime} - ${item.endTime}`}</TableCell>
                                                    <TableCell className="text-white">{item.classroom}</TableCell>
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
};

export default CourseSchedule;
