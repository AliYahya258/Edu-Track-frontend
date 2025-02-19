// 'use client';
//
// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import ParentSidebar from "@/components/parent/sidebar";
//
// const ChildFeedback = () => {
//     const [childId, setChildId] = useState('');
//     const [grades, setGrades] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//
//     const fetchFeedbacks = async (id) => {
//         setLoading(true);
//         setError(null);
//         setGrades([]);
//
//         try {
//             const userData = sessionStorage.getItem('userData');
//             if (userData) {
//                 const parsedData = JSON.parse(userData);
//                 const token = parsedData.accessToken;
//
//                 if (!token) {
//                     throw new Error('No authentication token found');
//                 }
//
//                 const response = await fetch(`http://localhost:8081/api/parent/child/${id}/feedback/assignments`, {
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                     },
//                 });
//
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch grades');
//                 }
//
//                 const data = await response.json();
//                 setGrades(data);
//             } else {
//                 throw new Error('No userData found in sessionStorage.');
//             }
//         } catch (err) {
//             setError(err.message || 'An error occurred');
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const getGradeColor = (grade) => {
//         switch (grade) {
//             case 'A':
//             case 'B':
//                 return 'bg-green-500';
//             case 'C':
//             case 'D':
//             case 'E':
//                 return 'bg-yellow-500';
//             case 'F':
//                 return 'bg-red-500';
//             default:
//                 return 'bg-gray-500';
//         }
//     };
//
//     return (
//         <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 grid grid-cols-[auto_1fr]">
//             <ParentSidebar/>
//             <main className="p-6">
//                 <h1 className="text-4xl font-bold mb-2">Assignment Feedback</h1>
//                 <p className="text-gray-400 mb-8">Enter your child id to view assignment's feedback</p>
//                 <Card className="bg-[#1f2937] border-0 text-white">
//                     <CardHeader>
//                         <CardTitle className="text-2xl font-semibold">Assignment Report</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="mb-4">
//                             <label htmlFor="childId" className="block text-gray-300 font-medium mb-2">
//                                 Enter Child ID:
//                             </label>
//                             <input
//                                 id="childId"
//                                 type="text"
//                                 value={childId}
//                                 onChange={(e) => setChildId(e.target.value)}
//                                 className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
//                                 placeholder="Enter Child ID"
//                             />
//                             <button
//                                 onClick={() => fetchFeedbacks(childId)}
//                                 disabled={!childId || loading}
//                                 className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-500"
//                             >
//                                 {loading ? 'Loading...' : 'Get Feedback'}
//                             </button>
//                         </div>
//                         {error && (
//                             <p className="text-red-500 mb-4">Error: {error}</p>
//                         )}
//                         {loading ? (
//                             <div className="space-y-2">
//                                 <Skeleton className="h-4 w-full bg-gray-700"/>
//                                 <Skeleton className="h-4 w-full bg-gray-700"/>
//                                 <Skeleton className="h-4 w-full bg-gray-700"/>
//                             </div>
//                         ) : (
//                             <Table>
//                                 <TableHeader>
//                                     <TableRow>
//                                         <TableHead className="text-gray-300">Assignment Title</TableHead>
//                                         {/*<TableHead className="text-gray-300">Grade</TableHead>*/}
//                                         <TableHead className="text-gray-300">Marks</TableHead>
//                                         <TableHead className="text-gray-300">Feedback</TableHead>
//                                     </TableRow>
//                                 </TableHeader>
//                                 <TableBody>
//                                     {grades.map((grade) => (
//                                         <TableRow key={grade.id}>
//                                             <TableCell className="font-medium">{grade.assignmentTitle}</TableCell>
//                                             {/*<TableCell>*/}
//                                             {/*    <Badge className={`${getGradeColor(grade.value)} text-white`}>*/}
//                                             {/*        {grade.value}*/}
//                                             {/*    </Badge>*/}
//                                             {/*</TableCell>*/}
//                                             <TableCell>{grade.marks}</TableCell>
//                                             <TableCell>{grade.feedback || 'No feedback provided'}</TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         )}
//                     </CardContent>
//                 </Card>
//             </main>
//         </div>
//     );
// };
//
// export default ChildFeedback;

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ParentSidebar from "@/components/parent/sidebar";

const ChildFeedback = () => {
    const [childId, setChildId] = useState('');
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFeedbacks = async (id) => {
        setLoading(true);
        setError(null);
        setGrades([]);

        try {
            const userData = sessionStorage.getItem('userData');
            if (!userData) {
                throw new Error('You are not logged in. Please log in and try again.');
            }

            const parsedData = JSON.parse(userData);
            const token = parsedData.accessToken;

            if (!token) {
                throw new Error('No authentication token found. Please log in again.');
            }

            const response = await fetch(`http://localhost:8081/api/parent/child/${id}/feedback/assignments`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch grades.');
            }

            const data = await response.json();
            setGrades(data);
        } catch (err) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const getGradeColor = (grade) => {
        const gradeColors = {
            A: 'bg-green-500',
            B: 'bg-green-500',
            C: 'bg-yellow-500',
            D: 'bg-yellow-500',
            E: 'bg-yellow-500',
            F: 'bg-red-500',
        };
        return gradeColors[grade] || 'bg-gray-500';
    };

    const isChildIdValid = (id) => /^[0-9]+$/.test(id);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 grid grid-cols-[auto_1fr]">
            <ParentSidebar />
            <main className="p-6">
                <h1 className="text-4xl font-bold mb-2">Assignment Feedback</h1>
                <p className="text-gray-400 mb-8">Enter your child ID to view assignment feedback</p>
                <Card className="bg-[#1f2937] border-0 text-white">
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold">Assignment Report</CardTitle>
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
                                onClick={() => isChildIdValid(childId) && fetchFeedbacks(childId)}
                                disabled={!isChildIdValid(childId) || loading}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-500"
                            >
                                {loading ? 'Loading...' : 'Get Feedback'}
                            </button>
                            {!isChildIdValid(childId) && childId && (
                                <p className="text-yellow-400 mt-2">Child ID must be numeric.</p>
                            )}
                        </div>
                        {error && (
                            <p className="text-red-500 mb-4">Error: {error}</p>
                        )}
                        {loading ? (
                            <div className="space-y-2 h-32">
                                <Skeleton className="h-4 w-full bg-gray-700" />
                                <Skeleton className="h-4 w-full bg-gray-700" />
                                <Skeleton className="h-4 w-full bg-gray-700" />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-gray-300">Assignment Title</TableHead>
                                        <TableHead className="text-gray-300">Marks</TableHead>
                                        <TableHead className="text-gray-300">Feedback</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {grades.map((grade) => (
                                        <TableRow key={grade.id}>
                                            <TableCell className="font-medium">{grade.assignmentTitle}</TableCell>
                                            <TableCell>
                                                <Badge className={`${getGradeColor(grade.value)} text-white`}>
                                                    {grade.value || grade.marks}
                                                </Badge>
                                            </TableCell>
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

export default ChildFeedback;
