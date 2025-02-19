'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ParentSidebar from "@/components/parent/sidebar";

const ChildGrades = () => {
    const [childId, setChildId] = useState('');
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchGrades = async (id) => {
        setLoading(true);
        setError(null);
        setGrades([]);

        try {
            const userData = sessionStorage.getItem('userData');
            if (userData) {
                const parsedData = JSON.parse(userData);
                const token = parsedData.accessToken;

                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch(`http://localhost:8081/api/parent/child/${id}/progress`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch grades');
                }

                const data = await response.json();
                setGrades(data);
            } else {
                throw new Error('No userData found in sessionStorage.');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const getGradeColor = (grade) => {
        switch (grade) {
            case 'A':
            case 'B':
                return 'bg-green-500';
            case 'C':
            case 'D':
            case 'E':
                return 'bg-yellow-500';
            case 'F':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 grid grid-cols-[auto_1fr]">
            <ParentSidebar/>
            <main className="p-6">
                <h1 className="text-4xl font-bold mb-2">Academic Progress</h1>
                <p className="text-gray-400 mb-8">Enter your child id to view academic progress</p>
                <Card className="bg-[#1f2937] border-0 text-white">
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold">Grade Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <label htmlFor="childId" className="block text-gray-300 font-medium mb-2">
                                Enter Child ID:
                            </label>
                            <input
                                id="childId"
                                type="text"
                                value={childId}
                                onChange={(e) => setChildId(e.target.value)}
                                className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                                placeholder="Enter Child ID"
                            />
                            <button
                                onClick={() => fetchGrades(childId)}
                                disabled={!childId || loading}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-500"
                            >
                                {loading ? 'Loading...' : 'Get Grades'}
                            </button>
                        </div>
                        {error && (
                            <p className="text-red-500 mb-4">Error: {error}</p>
                        )}
                        {loading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full bg-gray-700"/>
                                <Skeleton className="h-4 w-full bg-gray-700"/>
                                <Skeleton className="h-4 w-full bg-gray-700"/>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-gray-300">Exam Type</TableHead>
                                        <TableHead className="text-gray-300">Grade</TableHead>
                                        <TableHead className="text-gray-300">Marks</TableHead>
                                        <TableHead className="text-gray-300">Feedback</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {grades.map((grade) => (
                                        <TableRow key={grade.id}>
                                            <TableCell className="font-medium">{grade.examType}</TableCell>
                                            <TableCell>
                                                <Badge className={`${getGradeColor(grade.value)} text-white`}>
                                                    {grade.value}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{grade.marks}</TableCell>
                                            <TableCell>{grade.feedback || 'No feedback provided'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default ChildGrades;