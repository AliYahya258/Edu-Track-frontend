'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TeacherSidebar from "@/components/teacher/sidebar";

export default function GetGrades() {
    const [courseId, setCourseId] = useState('');
    const [section, setSection] = useState('');
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    const fetchGrades = async () => {
        setLoading(true);
        setError('');
        setGrades([]);

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

            let gradesResponse;

            // Fetch grades by course and section if both are provided
            if (courseId && section) {
                gradesResponse = await fetch(`http://localhost:8081/api/exam_result/course/${courseId}/section/${section}`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            }
            // Otherwise, fetch grades by course ID
            else if (courseId) {
                gradesResponse = await fetch(`http://localhost:8081/api/exam_result/course/${courseId}`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            } else {
                setError('Please provide at least a Course ID');
                return;
            }

            if (!gradesResponse.ok) {
                throw new Error('Failed to fetch grades');
            }

            const gradesData = await gradesResponse.json();
            setGrades(gradesData);
        } catch (err) {
            setError('Error fetching data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchGrades();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="grid grid-cols-[auto_1fr]">
                <TeacherSidebar />
                <main className="overflow-auto">
                    <Card className="bg-gray-800 border-gray-700 max-w-5xl mx-auto">
                        <CardContent className="p-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Get Grades</h1>
                            <p className="text-gray-400 mb-6">Below is the list of exam results for the selected course and section.</p>
                            <form onSubmit={handleSubmit} className="space-y-6 mb-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="courseId" className="text-white mb-2 block">Course ID</Label>
                                        <Input
                                            id="courseId"
                                            value={courseId}
                                            onChange={(e) => setCourseId(e.target.value)}
                                            className="bg-gray-700 text-white border-gray-600"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="section" className="text-white mb-2 block">Section (Optional)</Label>
                                        <Input
                                            id="section"
                                            value={section}
                                            onChange={(e) => setSection(e.target.value)}
                                            className="bg-gray-700 text-white border-gray-600"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2">
                                    {courseId && section ? 'Show Exam Results' : 'Show Grades'}
                                </Button>
                            </form>

                            {loading && <p className="text-white">Loading...</p>}
                            {error && <p className="text-red-500">{error}</p>}
                            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                            {grades.length > 0 && (
                                <div className="mb-10 overflow-x-auto">
                                    <h2 className="text-2xl font-bold text-white mb-4">Grades</h2>
                                    <Table className="w-full">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-white">Student</TableHead>
                                                <TableHead className="text-white">Course</TableHead>
                                                <TableHead className="text-white">Section</TableHead>
                                                <TableHead className="text-white">Exam Type</TableHead>
                                                <TableHead className="text-white">Marks</TableHead>
                                                <TableHead className="text-white">Grade</TableHead>
                                                <TableHead className="text-white">Feedback</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {grades.map((grade) => (
                                                <TableRow key={grade.id}>
                                                    <TableCell className="text-white">{grade.studentName}</TableCell>
                                                    <TableCell className="text-white">{grade.courseName}</TableCell>
                                                    <TableCell className="text-white">{grade.sectionName}</TableCell>
                                                    <TableCell className="text-white">{grade.examType}</TableCell>
                                                    <TableCell className="text-white">{grade.marks}</TableCell>
                                                    <TableCell className="text-white">{grade.grade}</TableCell>
                                                    <TableCell className="text-white">{grade.feedback || 'N/A'}</TableCell>
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
