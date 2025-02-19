'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import AdminSidebar from "@/components/admin/sidebar";

export default function UploadExamSchedule() {
    const [examId, setExamId] = useState('');
    const [examType, setExamType] = useState('');
    const [examDate, setExamDate] = useState('');
    const [examLocation, setExamLocation] = useState('');
    const [duration, setDuration] = useState('');
    const [courseId, setCourseId] = useState('');
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false); // Toggle between create and update

    const handleCreateExam = async () => {
        const token = JSON.parse(sessionStorage.getItem('userData')).accessToken;

        if (!examId || !examType || !examDate || !examLocation || !duration || !courseId) {
            setMessage('Please fill in all fields');
            return;
        }

        setUploading(true);
        setMessage('');

        try {
            const url = `http://localhost:8081/api/exams/schedule?examId=${examId}&examType=${examType}&examDate=${examDate}&examLocation=${examLocation}&duration=${duration}&courseId=${courseId}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });


            if (!response.ok) throw new Error('Failed to schedule exam');

            const result = await response.text();
            setMessage(result);
            resetForm();
        } catch (error) {
            console.error('Error scheduling exam:', error);
            setMessage('Failed to schedule exam. Please check the details.');
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateExam = async () => {
        const token = JSON.parse(sessionStorage.getItem('userData')).accessToken;

        if (!examId || !examType || !examDate || !examLocation || !duration || !courseId) {
            setMessage('Please fill in all fields');
            return;
        }

        setUploading(true);
        setMessage('');

        try {
            const url = `http://localhost:8081/api/exams/update/${examId}`;

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    examId,
                    examType,
                    examDate,
                    examLocation,
                    duration,
                    courseId,
                }),
            });

            if (!response.ok) throw new Error('Failed to update exam schedule');

            const result = await response.text();
            setMessage(result);
            resetForm();
        } catch (error) {
            console.error('Error updating exam:', error);
            setMessage('Failed to update exam. Please check the details.');
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setExamId('');
        setExamType('');
        setExamDate('');
        setExamLocation('');
        setDuration('');
        setCourseId('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="grid grid-cols-[auto_1fr]">
                <AdminSidebar />
                <main className="p-8">
                    <div className="max-w-2xl mx-auto">
                        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-center text-gray-100">
                                    {isUpdate ? 'Update Exam Schedule' : 'Create Exam Schedule'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="examId" className="text-gray-200 flex items-center gap-2">
                                        Exam ID
                                    </Label>
                                    <Input
                                        id="examId"
                                        value={examId}
                                        onChange={(e) => setExamId(e.target.value)}
                                        className="bg-gray-700/50 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="examType" className="text-gray-200 flex items-center gap-2">
                                        Exam Type
                                    </Label>
                                    <Input
                                        id="examType"
                                        value={examType}
                                        onChange={(e) => setExamType(e.target.value)}
                                        className="bg-gray-700/50 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="examDate" className="text-gray-200 flex items-center gap-2">
                                        Exam Date
                                    </Label>
                                    <Input
                                        type="date"
                                        id="examDate"
                                        value={examDate}
                                        onChange={(e) => setExamDate(e.target.value)}
                                        className="bg-gray-700/50 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="examLocation" className="text-gray-200 flex items-center gap-2">
                                        Location
                                    </Label>
                                    <Input
                                        id="examLocation"
                                        value={examLocation}
                                        onChange={(e) => setExamLocation(e.target.value)}
                                        className="bg-gray-700/50 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="duration" className="text-gray-200 flex items-center gap-2">
                                        Duration (minutes)
                                    </Label>
                                    <Input
                                        id="duration"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="bg-gray-700/50 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="courseId" className="text-gray-200 flex items-center gap-2">
                                        Course ID
                                    </Label>
                                    <Input
                                        id="courseId"
                                        value={courseId}
                                        onChange={(e) => setCourseId(e.target.value)}
                                        className="bg-gray-700/50 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-center space-x-4">
                                <Button
                                    onClick={isUpdate ? handleUpdateExam : handleCreateExam}
                                    disabled={uploading}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                >
                                    {uploading ? 'Submitting...' : isUpdate ? 'Update Schedule' : 'Create Schedule'}
                                </Button>
                            </CardFooter>
                        </Card>
                        {message && (
                            <div className={`mt-4 p-2 rounded ${message.includes("successfully") ? "bg-green-600" : "bg-red-600"} text-white`}>
                                {message}
                            </div>
                        )}
                        <div className="mt-4 text-center">
                            <Button variant="outline" onClick={() => setIsUpdate(!isUpdate)}>
                                {isUpdate ? 'Switch to Create Mode' : 'Switch to Update Mode'}
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
