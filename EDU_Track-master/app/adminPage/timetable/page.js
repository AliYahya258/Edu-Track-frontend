'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, FileUp, Check } from 'lucide-react';
import AdminSidebar from "@/components/admin/sidebar";
import {
    ToastProvider,
    ToastViewport,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose,
} from "@/components/ui/toast";

export default function AdminTimetableUpload() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('default'); // 'default' for success, 'destructive' for errors

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setToastType('destructive');
            setToastMessage('Please select a file to upload.');
            return;
        }

        setUploading(true);
        setToastMessage('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = JSON.parse(sessionStorage.getItem('userData')).accessToken; // Replace with actual token retrieval logic
            const response = await fetch('http://localhost:8081/api/timetable/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.text();

            if (response.ok) {
                setToastType('default');
                setToastMessage(result); // Success message from the server
                setFile(null);
            } else {
                setToastType('destructive');
                setToastMessage(result || 'Failed to upload timetable. Please try again.');
            }
        } catch (error) {
            console.error('Error during upload:', error);
            setToastType('destructive');
            setToastMessage('An error occurred. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <ToastProvider>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
                <div className="grid grid-cols-[auto_1fr]">
                    <AdminSidebar />
                    <main className="p-8">
                        <div className="max-w-2xl mx-auto">
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-center text-gray-100">Upload Timetable</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-center w-full">
                                            <Label htmlFor="timetable-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                                    <p className="mb-2 text-sm text-gray-400">
                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-400">Excel file (MAX. 10MB)</p>
                                                </div>
                                                <Input
                                                    id="timetable-upload"
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                    accept=".xlsx,.xls"
                                                />
                                            </Label>
                                        </div>
                                        {file && (
                                            <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                                                <div className="flex items-center">
                                                    <FileUp className="w-5 h-5 mr-2 text-gray-400" />
                                                    <span className="text-sm text-gray-200">{file.name}</span>
                                                </div>
                                                <Check className="w-5 h-5 text-green-500" />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        onClick={handleUpload}
                                        disabled={!file || uploading}
                                        className="w-full"
                                    >
                                        {uploading ? 'Uploading...' : 'Upload Timetable'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </main>
                </div>
                <ToastViewport />
                {toastMessage && (
                    <Toast
                        variant={toastType}
                        className={`w-full ${
                            toastType === 'default'
                                ? 'bg-green-500 text-white' // Green background for success
                                : 'bg-red-500 text-white'   // Red background for failure
                        }`}
                    >
                        <ToastTitle>{toastType === 'default' ? 'Success' : 'Error'}</ToastTitle>
                        <ToastDescription>{toastMessage}</ToastDescription>
                        <ToastClose />
                    </Toast>
                )}
            </div>
        </ToastProvider>
    );
}
