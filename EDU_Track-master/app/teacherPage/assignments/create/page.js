'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import TeacherSidebar from "@/components/teacher/sidebar";

export default function CreateAssignment() {
    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [description, setDescription] = useState('');
    const [attachment, setAttachment] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [sectionName, setSectionName] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleCreateAssignment = async () => {
        const token = JSON.parse(sessionStorage.getItem('userData')).accessToken;

        if (!assignmentTitle || !description || !attachment || !dueDate || !sectionName || !courseCode) {
            setMessage('Please fill in all fields');
            setIsSuccess(false);
            return;
        }

        setUploading(true);
        setMessage('');

        try {
            const url = `http://localhost:8081/api/assignments/create?assignmentTitle=${assignmentTitle}&description=${description}&attachment=${attachment}&dueDate=${dueDate}&sectionName=${sectionName}&courseCode=${courseCode}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to create assignment');

            const result = await response.json();
            setMessage(result.message);
            setIsSuccess(true); // Mark success
            resetForm();
        } catch (error) {
            console.error('Error creating assignment:', error);
            setMessage('Failed to create assignment. Please check the details.');
            setIsSuccess(false); // Mark failure
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setAssignmentTitle('');
        setDescription('');
        setAttachment('');
        setDueDate('');
        setSectionName('');
        setCourseCode('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="grid grid-cols-[auto_1fr]">
                <TeacherSidebar />
                <main className="p-8">
                    <div className="max-w-2xl mx-auto">
                        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-center text-gray-100">
                                    Create Assignment
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="assignmentTitle" className="text-gray-200 flex items-center gap-2">
                                        Assignment Title
                                    </Label>
                                    <Input
                                        id="assignmentTitle"
                                        value={assignmentTitle}
                                        onChange={(e) => setAssignmentTitle(e.target.value)}
                                        className="bg-gray-700/50 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-gray-200 flex items-center gap-2">
                                        Description
                                    </Label>
                                    <Input
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="bg-gray-700/50 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="attachment" className="text-gray-200 flex items-center gap-2">
                                        Attachment (Cloud Link)
                                    </Label>
                                    <Input
                                        id="attachment"
                                        value={attachment}
                                        onChange={(e) => setAttachment(e.target.value)}
                                        className="bg-gray-700/50 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dueDate" className="text-gray-200 flex items-center gap-2">
                                        Due Date
                                    </Label>
                                    <Input
                                        type="date"
                                        id="dueDate"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="bg-gray-700/50 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sectionName" className="text-gray-200 flex items-center gap-2">
                                        Section Name
                                    </Label>
                                    <Input
                                        id="sectionName"
                                        value={sectionName}
                                        onChange={(e) => setSectionName(e.target.value)}
                                        className="bg-gray-700/50 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="courseCode" className="text-gray-200 flex items-center gap-2">
                                        Course Code
                                    </Label>
                                    <Input
                                        id="courseCode"
                                        value={courseCode}
                                        onChange={(e) => setCourseCode(e.target.value)}
                                        className="bg-gray-700/50 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-center space-x-4">
                                <Button
                                    onClick={handleCreateAssignment}
                                    disabled={uploading}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                >
                                    {uploading ? 'Submitting...' : 'Create Assignment'}
                                </Button>
                            </CardFooter>
                        </Card>
                        {message && (
                            <div className={`mt-4 p-2 rounded ${isSuccess ? "bg-green-600" : "bg-red-600"} text-white`}>
                                {message}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
