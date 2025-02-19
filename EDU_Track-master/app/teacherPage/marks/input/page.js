'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import TeacherSidebar from "@/components/teacher/sidebar";

export default function GradeComponent() {
    const [studentID, setStudentID] = useState('');
    const [courseId, setCourseId] = useState('');
    const [sectionName, setSectionName] = useState('');
    const [marks, setMarks] = useState('');
    const [gradeId, setGradeId] = useState('');
    const [feedback, setFeedback] = useState('');  // Optional field
    const [examType, setExamType] = useState('');
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false); // Toggle between upload and update grade

    const handleUploadGrade = async () => {
        const token = JSON.parse(sessionStorage.getItem('userData')).accessToken;

        if (!studentID || !courseId || !sectionName || !marks || !examType) {
            setMessage('Please fill in all required fields');
            return;
        }

        setUploading(true);
        setMessage('');

        try {
            const url = `http://localhost:8081/api/exam_result/inputGrades?studentID=${studentID}&courseId=${courseId}&sectionName=${sectionName}&marks=${marks}&examType=${examType}`;

            // Conditionally include feedback if it's not empty
            const requestBody = {
                studentID,
                courseId,
                sectionName,
                marks,
                examType,
                ...(feedback && { feedback })  // Only include feedback if it's not empty
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),  // Send data as JSON
            });

            if (!response.ok) throw new Error('Failed to upload grade');

            const result = await response.json();
            setMessage(result.message);
            resetForm();
        } catch (error) {
            console.error('Error uploading grade:', error);
            setMessage('Failed to upload grade. Please check the details.');
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateGrade = async () => {
        const token = JSON.parse(sessionStorage.getItem('userData')).accessToken;

        if (!gradeId || !marks) {
            setMessage('Please fill in all required fields');
            return;
        }

        setUploading(true);
        setMessage('');

        try {
            const url = `http://localhost:8081/api/exam_result/updateGrades?gradeId=${gradeId}&marks=${marks}`;

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to update grade');

            const result = await response.json();
            setMessage(result.message);
            resetForm();
        } catch (error) {
            console.error('Error updating grade:', error);
            setMessage('Failed to update grade. Please check the details.');
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setStudentID('');
        setCourseId('');
        setSectionName('');
        setMarks('');
        setGradeId('');
        setFeedback('');  // Reset feedback field
        setExamType('');
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
                                    {isUpdate ? 'Update Grade' : 'Upload Grade'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {!isUpdate && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="studentID" className="text-gray-200 flex items-center gap-2">
                                                Student ID
                                            </Label>
                                            <Input
                                                id="studentID"
                                                value={studentID}
                                                onChange={(e) => setStudentID(e.target.value)}
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
                                    </>
                                )}
                                {isUpdate && (
                                    <div className="space-y-2">
                                        <Label htmlFor="gradeId" className="text-gray-200 flex items-center gap-2">
                                            Grade ID
                                        </Label>
                                        <Input
                                            id="gradeId"
                                            value={gradeId}
                                            onChange={(e) => setGradeId(e.target.value)}
                                            className="bg-gray-700/50 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="marks" className="text-gray-200 flex items-center gap-2">
                                        Marks
                                    </Label>
                                    <Input
                                        id="marks"
                                        value={marks}
                                        onChange={(e) => setMarks(e.target.value)}
                                        className="bg-gray-700/50 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                {!isUpdate && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="feedback" className="text-gray-200 flex items-center gap-2">
                                                Feedback (Optional)
                                            </Label>
                                            <Input
                                                id="feedback"
                                                value={feedback || ''}
                                                onChange={(e) => setFeedback(e.target.value)}
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
                                    </>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-center space-x-4">
                                <Button
                                    onClick={isUpdate ? handleUpdateGrade : handleUploadGrade}
                                    disabled={uploading}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                >
                                    {uploading ? 'Submitting...' : isUpdate ? 'Update Grade' : 'Upload Grade'}
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
                                {isUpdate ? 'Switch to Upload Mode' : 'Switch to Update Mode'}
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
