// 'use client';
//
// import { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import TeacherSidebar from "@/components/teacher/sidebar";
//
// export default function GradeAssignment() {
//     const [assignmentId, setAssignmentId] = useState('');
//     const [marks, setMarks] = useState('');
//     const [feedback, setFeedback] = useState('');
//     const [message, setMessage] = useState('');
//     const [uploading, setUploading] = useState(false);
//
//     const handleGradeAssignment = async () => {
//         const token = JSON.parse(sessionStorage.getItem('userData')).accessToken;
//
//         if (!assignmentId || !marks || !feedback) {
//             setMessage('Please fill in all fields');
//             return;
//         }
//
//         setUploading(true);
//         setMessage('');
//
//         try {
//             const url = `http://localhost:8081/api/assignments/grade?assignmentId=${assignmentId}&marks=${marks}&feedback=${feedback}`;
//
//             const response = await fetch(url, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });
//
//             if (!response.ok) throw new Error('Failed to grade assignment');
//
//             const result = await response.json();
//             setMessage(result.message);
//             resetForm();
//         } catch (error) {
//             console.error('Error grading assignment:', error);
//             setMessage('Failed to grade assignment. Please check the details.');
//         } finally {
//             setUploading(false);
//         }
//     };
//
//     const resetForm = () => {
//         setAssignmentId('');
//         setMarks('');
//         setFeedback('');
//     };
//
//     return (
//         <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
//             <div className="grid grid-cols-[auto_1fr]">
//                 <TeacherSidebar />
//                 <main className="p-8">
//                     <div className="max-w-2xl mx-auto">
//                         <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
//                             <CardHeader>
//                                 <CardTitle className="text-2xl font-bold text-center text-gray-100">
//                                     Grade Assignment
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent className="space-y-4">
//                                 <div className="space-y-2">
//                                     <Label htmlFor="assignmentId" className="text-gray-200 flex items-center gap-2">
//                                         Assignment ID
//                                     </Label>
//                                     <Input
//                                         id="assignmentId"
//                                         value={assignmentId}
//                                         onChange={(e) => setAssignmentId(e.target.value)}
//                                         className="bg-gray-700/50 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
//                                     />
//                                 </div>
//                                 <div className="space-y-2">
//                                     <Label htmlFor="marks" className="text-gray-200 flex items-center gap-2">
//                                         Marks
//                                     </Label>
//                                     <Input
//                                         id="marks"
//                                         value={marks}
//                                         onChange={(e) => setMarks(e.target.value)}
//                                         type="number"
//                                         className="bg-gray-700/50 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
//                                     />
//                                 </div>
//                                 <div className="space-y-2">
//                                     <Label htmlFor="feedback" className="text-gray-200 flex items-center gap-2">
//                                         Feedback
//                                     </Label>
//                                     <Input
//                                         id="feedback"
//                                         value={feedback}
//                                         onChange={(e) => setFeedback(e.target.value)}
//                                         className="bg-gray-700/50 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
//                                     />
//                                 </div>
//                             </CardContent>
//                             <CardFooter className="flex justify-center space-x-4">
//                                 <Button
//                                     onClick={handleGradeAssignment}
//                                     disabled={uploading}
//                                     className="w-full bg-blue-600 hover:bg-blue-700"
//                                 >
//                                     {uploading ? 'Submitting...' : 'Grade Assignment'}
//                                 </Button>
//                             </CardFooter>
//                         </Card>
//                         {message && (
//                             <div className={`mt-4 p-2 rounded ${message.includes("successfully") ? "bg-green-600" : "bg-red-600"} text-white`}>
//                                 {message}
//                             </div>
//                         )}
//                     </div>
//                 </main>
//             </div>
//         </div>
//     );
// }


'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import TeacherSidebar from "@/components/teacher/sidebar";

export default function GradeAssignment() {
    const [assignmentId, setAssignmentId] = useState('');
    const [marks, setMarks] = useState('');
    const [feedback, setFeedback] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false); // Track success or failure
    const [uploading, setUploading] = useState(false);

    const handleGradeAssignment = async () => {
        const token = JSON.parse(sessionStorage.getItem('userData')).accessToken;

        if (!assignmentId || !marks || !feedback) {
            setMessage('Please fill in all fields');
            setIsSuccess(false);
            return;
        }

        setUploading(true);
        setMessage('');

        try {
            const url = `http://localhost:8081/api/assignments/grade?assignmentId=${assignmentId}&marks=${marks}&feedback=${feedback}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to grade assignment');

            const result = await response.json();
            setMessage(result.message);
            setIsSuccess(true); // Mark success
            resetForm();
        } catch (error) {
            console.error('Error grading assignment:', error);
            setMessage('Failed to grade assignment. Please check the details.');
            setIsSuccess(false); // Mark failure
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setAssignmentId('');
        setMarks('');
        setFeedback('');
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
                                    Grade Assignment
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="assignmentId" className="text-gray-200 flex items-center gap-2">
                                        Assignment ID
                                    </Label>
                                    <Input
                                        id="assignmentId"
                                        value={assignmentId}
                                        onChange={(e) => setAssignmentId(e.target.value)}
                                        className="bg-gray-700/50 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="marks" className="text-gray-200 flex items-center gap-2">
                                        Marks
                                    </Label>
                                    <Input
                                        id="marks"
                                        value={marks}
                                        onChange={(e) => setMarks(e.target.value)}
                                        type="number"
                                        className="bg-gray-700/50 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="feedback" className="text-gray-200 flex items-center gap-2">
                                        Feedback
                                    </Label>
                                    <Input
                                        id="feedback"
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        className="bg-gray-700/50 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-center space-x-4">
                                <Button
                                    onClick={handleGradeAssignment}
                                    disabled={uploading}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                >
                                    {uploading ? 'Submitting...' : 'Grade Assignment'}
                                </Button>
                            </CardFooter>
                        </Card>
                        {message && (
                            <div
                                className={`mt-4 p-2 rounded ${
                                    isSuccess ? "bg-green-600" : "bg-red-600"
                                } text-white`}
                            >
                                {message}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
