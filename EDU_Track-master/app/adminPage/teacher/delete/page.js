'use client';
import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import AdminSidebar from '@/components/admin/sidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    ToastProvider,
    ToastViewport,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose,
} from "@/components/ui/toast";

const TeacherDeleteFormComponent = () => {
    const [teacherId, setTeacherId] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState("success");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    const showToast = (type, message) => {
        setToastType(type);
        setToastMessage(message);
    };

    const handleDelete = async () => {
        if (!teacherId || isDeleting) return;

        setIsDeleting(true);

        try {
            const url = `http://localhost:8081/api/teachers/delete/${teacherId}`;
            const userData = sessionStorage.getItem('userData');

            let parsedData;
            try {
                parsedData = JSON.parse(userData);
            } catch (error) {
                showToast("error", "Error parsing user data. Please re-login.");
                return;
            }

            const token = parsedData?.accessToken;
            if (!token) {
                showToast("error", "Authorization token missing.");
                return;
            }
            console.log(token);

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.text();
            if (response.ok) {
                showToast("success", "Teacher Deleted Successfully");
                setIsDeleteDialogOpen(false);
                setTeacherId('');
            } else {
                showToast("error", result || 'Failed to delete the teacher. Please check the ID or try again.');
            }
        } catch (error) {
            showToast("error", error.message || 'An error occurred while deleting the teacher. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <ToastProvider swipeDirection="right">
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
                <div className="grid grid-cols-[auto_1fr]">
                    <AdminSidebar />
                    <main className="p-8">
                        <div className="max-w-2xl mx-auto">
                            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-white">Delete Teacher</CardTitle>
                                    <CardDescription className="text-gray-400">Enter the Teacher ID to remove the teacher from the system</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid w-full items-center gap-4">
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="IdInput">Teacher ID</Label>
                                            <Input
                                                id="IdInput"
                                                placeholder="Enter Teacher ID"
                                                value={teacherId}
                                                onChange={(e) => setTeacherId(e.target.value)}
                                                className="bg-gray-700 text-white border-gray-600"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" onClick={() => setTeacherId('')}>Clear</Button>
                                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="destructive" disabled={!teacherId || isDeleting} onClick={() => setIsDeleteDialogOpen(true)}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete Teacher
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Are you sure you want to delete this teacher?</DialogTitle>
                                                <DialogDescription>This action cannot be undone. This will permanently delete the teacher with ID {teacherId} from the system.</DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                                                <Button variant="outline" onClick={handleDelete} disabled={isDeleting}>Confirm</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </CardFooter>
                            </Card>
                        </div>
                    </main>
                </div>

                {/* Toast Display */}
                {toastMessage && (
                    <Toast className={toastType === "error" ? "bg-red-600" : "bg-green-600"}>
                        <ToastTitle>{toastType === "error" ? "Error" : "Success"}</ToastTitle>
                        <ToastDescription>{toastMessage}</ToastDescription>
                        <ToastClose />
                    </Toast>
                )}
                <ToastViewport />
            </div>
        </ToastProvider>
    );
};

export default TeacherDeleteFormComponent;
