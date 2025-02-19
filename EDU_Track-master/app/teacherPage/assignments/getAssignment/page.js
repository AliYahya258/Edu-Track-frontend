// 'use client';
//
// import React, { useState } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Button } from '@/components/ui/button';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import TeacherSidebar from "@/components/teacher/sidebar";
//
// export default function GetAssignments() {
//     const [courseId, setCourseId] = useState('');
//     const [section, setSection] = useState('');
//     const [assignments, setAssignments] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [errorMessage, setErrorMessage] = useState(null);
//
//     const fetchAssignments = async () => {
//         setLoading(true);
//         setError('');
//         setAssignments([]);
//
//         try {
//             const userData = sessionStorage.getItem('userData');
//
//             if (!userData) {
//                 setErrorMessage("No userData found in session storage");
//                 return;
//             }
//
//             const parsedData = JSON.parse(userData);
//             const token = parsedData.accessToken;
//
//             if (!token) {
//                 setErrorMessage("No token found in userData");
//                 return;
//             }
//
//             let assignmentsResponse;
//
//             // Fetch assignments by course and section if both are provided
//             if (courseId && section) {
//                 assignmentsResponse = await fetch(`http://localhost:8081/api/assignments/course/${courseId}/section/${section}`, {
//                     method: "GET",
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     }
//                 });
//             }
//             // Otherwise, fetch assignments by course ID
//             else if (courseId) {
//                 assignmentsResponse = await fetch(`http://localhost:8081/api/assignments/course/${courseId}`, {
//                     method: "GET",
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     }
//                 });
//             } else {
//                 setError('Please provide at least a Course ID');
//                 return;
//             }
//
//             if (!assignmentsResponse.ok) {
//                 throw new Error('Failed to fetch assignments');
//             }
//
//             const assignmentsData = await assignmentsResponse.json();
//             setAssignments(assignmentsData);
//         } catch (err) {
//             setError('Error fetching data');
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         fetchAssignments();
//     };
//
//     return (
//         <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
//             <div className="grid grid-cols-[auto_1fr]">
//                 <TeacherSidebar />
//                 <main className="overflow-auto">
//                     <Card className="bg-gray-800 border-gray-700 max-w-5xl mx-auto">
//                         <CardContent className="p-8">
//                             <h1 className="text-3xl font-bold text-white mb-2">Get Assignments</h1>
//                             <p className="text-gray-400 mb-6">Below is the list of assignments for the selected course and section.</p>
//                             <form onSubmit={handleSubmit} className="space-y-6 mb-8">
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                     <div>
//                                         <Label htmlFor="courseId" className="text-white mb-2 block">Course ID</Label>
//                                         <Input
//                                             id="courseId"
//                                             value={courseId}
//                                             onChange={(e) => setCourseId(e.target.value)}
//                                             className="bg-gray-700 text-white border-gray-600"
//                                             required
//                                         />
//                                     </div>
//                                     <div>
//                                         <Label htmlFor="section" className="text-white mb-2 block">Section (Optional)</Label>
//                                         <Input
//                                             id="section"
//                                             value={section}
//                                             onChange={(e) => setSection(e.target.value)}
//                                             className="bg-gray-700 text-white border-gray-600"
//                                         />
//                                     </div>
//                                 </div>
//                                 <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2">
//                                     {courseId && section ? 'Show Assignments' : 'Show Assignments by Course'}
//                                 </Button>
//                             </form>
//
//                             {loading && <p className="text-white">Loading...</p>}
//                             {error && <p className="text-red-500">{error}</p>}
//                             {errorMessage && <p className="text-red-500">{errorMessage}</p>}
//
//                             {assignments.length > 0 && (
//                                 <div className="mb-10 overflow-x-auto">
//                                     <h2 className="text-2xl font-bold text-white mb-4">Assignments</h2>
//                                     <Table className="w-full">
//                                         <TableHeader>
//                                             <TableRow>
//                                                 <TableHead className="text-white">Assignment Title</TableHead>
//                                                 <TableHead className="text-white">Description</TableHead>
//                                                 <TableHead className="text-white">Upload Date</TableHead>
//                                                 <TableHead className="text-white">Due Date</TableHead>
//                                                 <TableHead className="text-white">Submitted</TableHead>
//                                                 <TableHead className="text-white">Graded</TableHead>
//                                                 <TableHead className="text-white">Attachment</TableHead>
//                                                 <TableHead className="text-white">Feedback</TableHead>
//                                                 <TableHead className="text-white">Marks</TableHead>
//                                                 <TableHead className="text-white">Student Username</TableHead>
//                                                 <TableHead className="text-white">Emergency Contact</TableHead>
//                                             </TableRow>
//                                         </TableHeader>
//                                         <TableBody>
//                                             {assignments.map((assignment) => (
//                                                 <TableRow key={assignment.assignment_id}>
//                                                     <TableCell className="text-white">{assignment.assignmentTitle}</TableCell>
//                                                     <TableCell className="text-white">{assignment.description}</TableCell>
//                                                     <TableCell className="text-white">{assignment.uploadDate}</TableCell>
//                                                     <TableCell className="text-white">{assignment.dueDate}</TableCell>
//                                                     <TableCell className="text-white">{assignment.submitted ? 'Yes' : 'No'}</TableCell>
//                                                     <TableCell className="text-white">{assignment.graded ? 'Yes' : 'No'}</TableCell>
//                                                     <TableCell className="text-white">{assignment.attachment}</TableCell>
//                                                     <TableCell className="text-white">{assignment.feedback || 'N/A'}</TableCell>
//                                                     <TableCell className="text-white">{assignment.marks}</TableCell>
//                                                     <TableCell className="text-white">{assignment.student?.username || 'N/A'}</TableCell>
//                                                     <TableCell className="text-white">{assignment.student?.emergencyContact || 'N/A'}</TableCell>
//                                                 </TableRow>
//                                             ))}
//                                         </TableBody>
//                                     </Table>
//                                 </div>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </main>
//             </div>
//         </div>
//     );
// }


'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TeacherSidebar from "@/components/teacher/sidebar";

export default function GetAssignments() {
    const [courseId, setCourseId] = useState('');
    const [section, setSection] = useState('');
    const [studentId, setStudentId] = useState('');  // New state for student ID
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    const fetchAssignments = async () => {
        setLoading(true);
        setError('');
        setAssignments([]);

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

            let assignmentsResponse;

            // Fetch assignments by student ID if provided
            if (studentId) {
                assignmentsResponse = await fetch(`http://localhost:8081/api/assignments/course/${courseId}/student/${studentId}`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            }
            // Fetch assignments by course and section if both are provided
            else if (courseId && section) {
                assignmentsResponse = await fetch(`http://localhost:8081/api/assignments/course/${courseId}/section/${section}`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            }
            // Otherwise, fetch assignments by course ID
            else if (courseId) {
                assignmentsResponse = await fetch(`http://localhost:8081/api/assignments/course/${courseId}`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            } else {
                setError('Please provide at least a Course ID or Student ID');
                return;
            }

            if (!assignmentsResponse.ok) {
                throw new Error('Failed to fetch assignments');
            }

            const assignmentsData = await assignmentsResponse.json();
            setAssignments(assignmentsData);
        } catch (err) {
            setError('Error fetching data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchAssignments();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="grid grid-cols-[auto_1fr]">
                <TeacherSidebar />
                <main className="overflow-auto">
                    <Card className="bg-gray-800 border-gray-700 max-w-5xl mx-auto">
                        <CardContent className="p-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Get Assignments</h1>
                            <p className="text-gray-400 mb-6">Below is the list of assignments for the selected course, section, or student.</p>
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
                                    <div>
                                        <Label htmlFor="studentId" className="text-white mb-2 block">Student ID (Optional)</Label>
                                        <Input
                                            id="studentId"
                                            value={studentId}
                                            onChange={(e) => setStudentId(e.target.value)}
                                            className="bg-gray-700 text-white border-gray-600"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2">
                                    {studentId ? 'Show Assignments by Student' : (courseId && section ? 'Show Assignments' : 'Show Assignments by Course')}
                                </Button>
                            </form>

                            {loading && <p className="text-white">Loading...</p>}
                            {error && <p className="text-red-500">{error}</p>}
                            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                            {assignments.length > 0 && (
                                <div className="mb-10 overflow-x-auto">
                                    <h2 className="text-2xl font-bold text-white mb-4">Assignments</h2>
                                    <Table className="w-full">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-white">Assignment Title</TableHead>
                                                <TableHead className="text-white">Description</TableHead>
                                                <TableHead className="text-white">Upload Date</TableHead>
                                                <TableHead className="text-white">Due Date</TableHead>
                                                <TableHead className="text-white">Submitted</TableHead>
                                                <TableHead className="text-white">Graded</TableHead>
                                                <TableHead className="text-white">Attachment</TableHead>
                                                <TableHead className="text-white">Feedback</TableHead>
                                                <TableHead className="text-white">Marks</TableHead>
                                                <TableHead className="text-white">Student Username</TableHead>
                                                <TableHead className="text-white">Emergency Contact</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {assignments.map((assignment) => (
                                                <TableRow key={assignment.assignment_id}>
                                                    <TableCell className="text-white">{assignment.assignmentTitle}</TableCell>
                                                    <TableCell className="text-white">{assignment.description}</TableCell>
                                                    <TableCell className="text-white">{assignment.uploadDate}</TableCell>
                                                    <TableCell className="text-white">{assignment.dueDate}</TableCell>
                                                    <TableCell className="text-white">{assignment.submitted ? 'Yes' : 'No'}</TableCell>
                                                    <TableCell className="text-white">{assignment.graded ? 'Yes' : 'No'}</TableCell>
                                                    <TableCell className="text-white">{assignment.attachment}</TableCell>
                                                    <TableCell className="text-white">{assignment.feedback || 'N/A'}</TableCell>
                                                    <TableCell className="text-white">{assignment.marks}</TableCell>
                                                    <TableCell className="text-white">{assignment.student?.username || 'N/A'}</TableCell>
                                                    <TableCell className="text-white">{assignment.student?.emergencyContact || 'N/A'}</TableCell>
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
