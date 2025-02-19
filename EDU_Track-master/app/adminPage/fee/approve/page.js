'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminSidebar from "@/components/admin/sidebar";
import { ToastProvider, Toast, ToastViewport, ToastTitle, ToastDescription, ToastClose } from "@/components/ui/toast";

const fetchAllFees = async () => {
    const token = JSON.parse(sessionStorage.getItem('userData')).accessToken;
    const response = await fetch('http://localhost:8081/api/fees/admin/all', {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch fee submissions');
    }
    return await response.json();
};

const approveFee = async (id, amount) => {
    const token = JSON.parse(sessionStorage.getItem('userData')).accessToken;
    const response = await fetch(`http://localhost:8081/api/fees/payment/${id}?amount=${amount}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
        throw new Error('Failed to approve payment');
    }
    return await response.text();
};

export default function FeesApprovalComponent() {
    const [submissions, setSubmissions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [amount, setAmount] = useState('');
    const [toastMessage, setToastMessage] = useState(null);

    useEffect(() => {
        const loadSubmissions = async () => {
            try {
                const data = await fetchAllFees();
                setSubmissions(data);
            } catch (error) {
                setToastMessage('Error fetching fee submissions');
            }
        };
        loadSubmissions();
    }, []);

    const handleApprove = async (id) => {
        try {
            const message = await approveFee(id, amount);
            setSubmissions(submissions.map(sub =>
                sub.id === id ? { ...sub, status: 'Paid', dueAmount: 0.0 } : sub
            ));
            setToastMessage(message);
        } catch (error) {
            setToastMessage('Error approving payment');
        }
    };

    const handleReject = (id) => {
        setSubmissions(submissions.map(sub =>
            sub.id === id ? { ...sub, status: 'Rejected' } : sub
        ));
        setToastMessage('Fee submission rejected');
    };

    const currentSubmission = submissions[currentIndex];
    const goToPrevious = () => setCurrentIndex(prev => (prev > 0 ? prev - 1 : submissions.length - 1));
    const goToNext = () => setCurrentIndex(prev => (prev < submissions.length - 1 ? prev + 1 : 0));

    const stats = {
        total: submissions.length,
        pending: submissions.filter(sub => sub.status === 'Partially Paid').length,
        approved: submissions.filter(sub => sub.status === 'Paid').length,
        rejected: submissions.filter(sub => sub.status === 'Rejected').length,
    };

    if (submissions.length === 0) {
        return (
            <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                    <p className="text-center text-gray-400">No fee submissions available</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <ToastProvider>
            <ToastViewport />
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 grid grid-cols-[auto_1fr]">
                <AdminSidebar />

                <div className="p-8">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center text-gray-100">Fee Submission Approval</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Button variant="outline" onClick={goToPrevious} aria-label="Previous submission">
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-gray-400">
                                    {currentIndex + 1} of {submissions.length}
                                </span>
                                <Button variant="outline" onClick={goToNext} aria-label="Next submission">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-200">Total Amount: {currentSubmission.totalAmount}</p>
                                <p className="text-gray-200">Paid Amount: {currentSubmission.paidAmount}</p>
                                <p className="text-gray-200">Due Amount: {currentSubmission.dueAmount}</p>
                                <p className="text-gray-400">Status: {currentSubmission.status}</p>
                            </div>
                            <div className="mt-4">
                                <input
                                    type="number"
                                    placeholder="Enter payment amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="p-2 w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center space-x-4">
                            <Button
                                onClick={() => handleApprove(currentSubmission.id)}
                                disabled={currentSubmission.status === 'Paid' || !amount}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <Check className="mr-2 h-4 w-4" /> Approve
                            </Button>
                            <Button
                                onClick={() => handleReject(currentSubmission.id)}
                                disabled={currentSubmission.status === 'Paid'}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                <X className="mr-2 h-4 w-4" /> Reject
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {toastMessage && (
                <Toast onOpenChange={() => setToastMessage(null)}>
                    <ToastTitle>Notification</ToastTitle>
                    <ToastDescription>{toastMessage}</ToastDescription>
                    <ToastClose />
                </Toast>
            )}
        </ToastProvider>
    );
}
