// 'use client'
//
// import { useState } from 'react'
// import AdminSidebar from "@/components/admin/sidebar"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
//
// export default function AdminTeacherPerformance() {
//     const [teacherId, setTeacherId] = useState('')
//     const [performanceData, setPerformanceData] = useState(null)
//     const [errorMessage, setErrorMessage] = useState(null)
//     const [loading, setLoading] = useState(false)
//
//     // Fetch Teacher Performance
//     const getTeacherPerformance = async () => {
//         setErrorMessage(null)
//         setPerformanceData(null)
//         setLoading(true)
//
//         try {
//             const userData = sessionStorage.getItem('userData')
//             if (!userData) {
//                 setErrorMessage("No user data found in session storage.")
//                 setLoading(false)
//                 return
//             }
//
//             const parsedData = JSON.parse(userData)
//             const token = parsedData.accessToken
//             if (!token) {
//                 setErrorMessage("No token found in user data.")
//                 setLoading(false)
//                 return
//             }
//
//             const response = await fetch(`http://localhost:8081/api/teachers/${teacherId}/performance`, {
//                 method: "GET",
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                     "Content-Type": "application/json",
//                 },
//             })
//
//             if (response.ok) {
//                 const data = await response.json()
//                 setPerformanceData(data)
//             } else {
//                 const errorData = await response.json()
//                 setErrorMessage(errorData.message || "Failed to fetch performance data.")
//             }
//         } catch (error) {
//             console.error("Error fetching performance data:", error)
//             setErrorMessage("An error occurred while fetching performance data.")
//         } finally {
//             setLoading(false)
//         }
//     }
//
//     return (
//         <div className="min-h-screen bg-[#1a1f2e]">
//             <div className="grid grid-cols-[auto_1fr]">
//                 <AdminSidebar />
//                 <main className="p-8">
//                     <div className="max-w-[1400px] mx-auto">
//                         <header className="mb-8">
//                             <h1 className="text-3xl font-bold text-white mb-2">Teacher Performance</h1>
//                             <p className="text-gray-400">Enter a teacher ID to view performance metrics.</p>
//                         </header>
//
//                         {errorMessage && (
//                             <div className="bg-red-600/10 border border-red-600/20 text-red-500 p-3 rounded-md mb-4">
//                                 {errorMessage}
//                             </div>
//                         )}
//
//                         <div className="bg-[#1c2237] rounded-lg p-6">
//                             <div className="grid gap-4">
//                                 <div>
//                                     <Label htmlFor="teacherId" className="text-white">Teacher ID</Label>
//                                     <Input
//                                         id="teacherId"
//                                         value={teacherId}
//                                         onChange={(e) => setTeacherId(e.target.value)}
//                                         placeholder="Enter teacher ID"
//                                         className="bg-[#2c3547] text-white"
//                                     />
//                                 </div>
//                                 <Button onClick={getTeacherPerformance} className="mt-4 ml-4" disabled={loading}>
//                                     {loading ? "Loading..." : "Get Performance Data"}
//                                 </Button>
//                             </div>
//                         </div>
//
//                         {/* Displaying Teacher Data */}
//                         {performanceData && (
//                             <div className="mt-8 bg-[#2c3547] rounded-lg p-6">
//                                 <h2 className="text-white text-lg font-semibold mb-4">Teacher Info</h2>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <Label className="text-gray-400">Teacher ID</Label>
//                                         <p className="text-white">{performanceData.teacher.teacherId}</p>
//                                     </div>
//                                     <div>
//                                         <Label className="text-gray-400">Name</Label>
//                                         <p className="text-white">{performanceData.teacher.username}</p>
//                                     </div>
//                                     <div>
//                                         <Label className="text-gray-400">Email</Label>
//                                         <p className="text-white">{performanceData.teacher.email}</p>
//                                     </div>
//                                     <div>
//                                         <Label className="text-gray-400">Department</Label>
//                                         <p className="text-white">{performanceData.teacher.department}</p>
//                                     </div>
//                                     <div>
//                                         <Label className="text-gray-400">Qualification</Label>
//                                         <p className="text-white">{performanceData.teacher.qualification}</p>
//                                     </div>
//                                     <div>
//                                         <Label className="text-gray-400">Specialization</Label>
//                                         <p className="text-white">{performanceData.teacher.specialization}</p>
//                                     </div>
//                                     <div>
//                                         <Label className="text-gray-400">Office Hours</Label>
//                                         <p className="text-white">{performanceData.teacher.officeHours}</p>
//                                     </div>
//                                     <div>
//                                         <Label className="text-gray-400">Date of Hire</Label>
//                                         <p className="text-white">{performanceData.teacher.dateOfHire}</p>
//                                     </div>
//                                 </div>
//
//                                 {/* Displaying Course and Enrollment Data */}
//                                 <div className="mt-6 border-t border-gray-700 pt-4">
//                                     <div className="grid grid-cols-2 gap-4">
//                                         <div>
//                                             <Label className="text-gray-400">Total Courses</Label>
//                                             <p className="text-white">{performanceData.totalCourses}</p>
//                                         </div>
//                                         <div>
//                                             <Label className="text-gray-400">Total Enrollments</Label>
//                                             <p className="text-white">{performanceData.totalEnrollments}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//
//                         {/* No data message */}
//
//                     </div>
//                 </main>
//             </div>
//         </div>
//     )
// }



'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import TeacherSidebar from "@/components/teacher/sidebar";

export default function AdminTeacherPerformance() {
    const [performanceData, setPerformanceData] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const getTeacherPerformance = async () => {
        setErrorMessage(null);
        setPerformanceData(null);
        setLoading(true);

        try {
            const userData = sessionStorage.getItem('userData');
            if (!userData) {
                setErrorMessage('No user data found in session storage.');
                setLoading(false);
                return;
            }

            const parsedData = JSON.parse(userData);
            const token = parsedData.accessToken;
            const teacherId = parsedData.id;
            if (!token || !teacherId) {
                setErrorMessage('No token or ID found in user data.');
                setLoading(false);
                return;
            }

            const response = await fetch(`http://localhost:8081/api/teachers/${teacherId}/performance`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setPerformanceData(data);
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Failed to fetch performance data.');
            }
        } catch (error) {
            console.error('Error fetching performance data:', error);
            setErrorMessage('An error occurred while fetching performance data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#1a1f2e]">
            <div className="grid grid-cols-[auto_1fr]">
                <TeacherSidebar />
                <main className="p-8">
                    <div className="max-w-[1400px] mx-auto">
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Teacher Performance</h1>
                            <p className="text-gray-400">View performance metrics.</p>
                        </header>

                        {errorMessage && (
                            <div className="bg-red-600/10 border border-red-600/20 text-red-500 p-3 rounded-md mb-4">
                                {errorMessage}
                            </div>
                        )}

                        <div className="bg-[#1c2237] rounded-lg p-6">
                            <Button onClick={getTeacherPerformance} className="mt-4 bg-blue-600" disabled={loading}>
                                {loading ? 'Loading...' : 'Get Performance Data'}
                            </Button>
                        </div>

                        {performanceData && (
                            <div className="mt-8 bg-[#2c3547] rounded-lg p-6">
                                <h2 className="text-white text-lg font-semibold mb-4">Teacher Info</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-gray-400">Teacher ID</Label>
                                        <p className="text-white">{performanceData.teacher.teacherId}</p>
                                    </div>
                                    <div>
                                        <Label className="text-gray-400">Name</Label>
                                        <p className="text-white">{performanceData.teacher.username}</p>
                                    </div>
                                    <div>
                                        <Label className="text-gray-400">Email</Label>
                                        <p className="text-white">{performanceData.teacher.email}</p>
                                    </div>
                                    <div>
                                        <Label className="text-gray-400">Department</Label>
                                        <p className="text-white">{performanceData.teacher.department}</p>
                                    </div>
                                    <div>
                                        <Label className="text-gray-400">Qualification</Label>
                                        <p className="text-white">{performanceData.teacher.qualification}</p>
                                    </div>
                                    <div>
                                        <Label className="text-gray-400">Specialization</Label>
                                        <p className="text-white">{performanceData.teacher.specialization}</p>
                                    </div>
                                    <div>
                                        <Label className="text-gray-400">Office Hours</Label>
                                        <p className="text-white">{performanceData.teacher.officeHours}</p>
                                    </div>
                                    <div>
                                        <Label className="text-gray-400">Date of Hire</Label>
                                        <p className="text-white">{performanceData.teacher.dateOfHire}</p>
                                    </div>
                                </div>

                                <div className="mt-6 border-t border-gray-700 pt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-gray-400">Total Courses</Label>
                                            <p className="text-white">{performanceData.totalCourses}</p>
                                        </div>
                                        <div>
                                            <Label className="text-gray-400">Total Enrollments</Label>
                                            <p className="text-white">{performanceData.totalEnrollments}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
