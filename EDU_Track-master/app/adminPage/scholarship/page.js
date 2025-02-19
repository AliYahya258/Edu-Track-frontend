'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminSidebar from "@/components/admin/sidebar";

export default function Scholarship() {
    const [approvedScholarships, setApprovedScholarships] = useState([]);
    const [pendingScholarships, setPendingScholarships] = useState([]);
    const [scholarshipId, setScholarshipId] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchApprovedScholarships();
        fetchPendingScholarships();
    }, []);

    const fetchApprovedScholarships = async () => {
        setLoading(true);
        try {
            const token = getToken();
            const response = await fetch('http://localhost:8081/api/scholarships/approved', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (!response.ok) throw new Error('Failed to fetch approved scholarships');
            const data = await response.json();
            setApprovedScholarships(data);
        } catch (err) {
            setError('Error fetching approved scholarships');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingScholarships = async () => {
        setLoading(true);
        try {
            const token = getToken();
            const response = await fetch('http://localhost:8081/api/scholarships/pending', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (!response.ok) throw new Error('Failed to fetch pending scholarships');
            const data = await response.json();
            setPendingScholarships(data);
        } catch (err) {
            setError('Error fetching pending scholarships');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const reviewScholarship = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = getToken();
            const response = await fetch(`http://localhost:8081/api/scholarships/review?scholarshipId=${scholarshipId}&status=${status}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (!response.ok) throw new Error('Failed to review scholarship');
            const data = await response.json();
            console.log('Scholarship reviewed:', data);
            // Refresh the scholarship lists
            fetchApprovedScholarships();
            fetchPendingScholarships();
        } catch (err) {
            setError('Error reviewing scholarship');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getToken = () => {
        const userData = sessionStorage.getItem('userData');
        if (!userData) throw new Error('No user data found');
        const { accessToken } = JSON.parse(userData);
        if (!accessToken) throw new Error('No token found');
        return accessToken;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="grid grid-cols-[auto_1fr]">
                <AdminSidebar />
                <main className="overflow-auto">
                    <Card className="bg-gray-800 border-gray-700 max-w-5xl mx-auto">
                        <CardContent className="p-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Scholarships Management</h1>
                            <p className="text-gray-400 mb-6">Review and manage scholarship applications.</p>

                            {loading && <p className="text-white">Loading...</p>}
                            {error && <p className="text-red-500">{error}</p>}

                            <div className="mb-10">
                                <h2 className="text-2xl font-bold text-white mb-4">Approved Scholarships</h2>
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-white">ID</TableHead>
                                            <TableHead className="text-white">Name</TableHead>
                                            <TableHead className="text-white">Amount</TableHead>
                                            <TableHead className="text-white">Application Date</TableHead>
                                            <TableHead className="text-white">Decision Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {approvedScholarships.map((scholarship) => (
                                            <TableRow key={scholarship.id}>
                                                <TableCell className="text-white">{scholarship.id}</TableCell>
                                                <TableCell className="text-white">{scholarship.name}</TableCell>
                                                <TableCell className="text-white">${scholarship.amount.toFixed(2)}</TableCell>
                                                <TableCell className="text-white">{scholarship.applicationDate}</TableCell>
                                                <TableCell className="text-white">{scholarship.decisionDate}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="mb-10">
                                <h2 className="text-2xl font-bold text-white mb-4">Pending Scholarships</h2>
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-white">ID</TableHead>
                                            <TableHead className="text-white">Name</TableHead>
                                            <TableHead className="text-white">Amount</TableHead>
                                            <TableHead className="text-white">Application Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pendingScholarships.map((scholarship) => (
                                            <TableRow key={scholarship.id}>
                                                <TableCell className="text-white">{scholarship.id}</TableCell>
                                                <TableCell className="text-white">{scholarship.name}</TableCell>
                                                <TableCell className="text-white">${scholarship.amount.toFixed(2)}</TableCell>
                                                <TableCell className="text-white">{scholarship.applicationDate}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-white mb-4">Approve OR Reject Scholarship</h2>
                                <form onSubmit={reviewScholarship} className="space-y-4">
                                    <div>
                                        <Label htmlFor="scholarshipId" className="text-white mb-2 block">Scholarship ID</Label>
                                        <Input
                                            id="scholarshipId"
                                            value={scholarshipId}
                                            onChange={(e) => setScholarshipId(e.target.value)}
                                            className="bg-gray-700 text-white border-gray-600"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="status" className="text-white mb-2 block">Status</Label>
                                        <Select onValueChange={setStatus} required>
                                            <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-800 text-white border-gray-600">
                                                <SelectItem value="APPROVED">Approved</SelectItem>
                                                <SelectItem value="REJECTED">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2">
                                        Review Scholarship
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}
