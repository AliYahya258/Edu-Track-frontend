'use client';

import { Book, UserCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import TeacherSidebar from "@/components/teacher/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

const TeacherDashboard = () => {
    const [teacherInfo, setTeacherInfo] = useState(null); // Store teacher info from the API
    const [isLoading, setIsLoading] = useState(true); // Track loading state
    const [isProfileVisible, setIsProfileVisible] = useState(false);
    const [error, setError] = useState(null); // Track error state

    // Fetch teacher data from the API
    useEffect(() => {
        const fetchTeacherInfo = async () => {
            try {
                setIsLoading(true); // Start loading
                const userData = sessionStorage.getItem('userData');

                if (!userData) {
                    setError("No userData found in session storage");
                    setIsLoading(false); // Stop loading
                    return;
                }

                const parsedData = JSON.parse(userData);
                const token = parsedData.accessToken;

                if (!token) {
                    setError("No token found in userData");
                    setIsLoading(false); // Stop loading
                    return;
                }

                const response = await fetch("http://localhost:8081/api/auth/getteacherinfo", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setTeacherInfo(data);
                } else {
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch teacher info: ${errorText}`);
                }
            } catch (error) {
                console.error("Error fetching teacher info:", error);
                setError("Failed to fetch teacher information. Please try again later.");
            } finally {
                setIsLoading(false); // Ensure loading is stopped
            }
        };

        fetchTeacherInfo();
    }, []);

    const toggleProfileVisibility = () => {
        setIsProfileVisible(!isProfileVisible);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="loader">Loading...</div>
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>; // Display error message if the API request fails
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="grid grid-cols-[auto_1fr]">
                <TeacherSidebar /> {/* Sidebar for the teacher */}
                <main className="p-8">
                    <header className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {teacherInfo.username.split(' ')[0]}!</h1>
                            <p className="text-gray-400">Here is what’s happening in your classes today.</p>
                        </div>
                    </header>

                    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-8">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-6">
                                <Avatar className="h-24 w-24 border-2 border-blue-500">
                                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt={teacherInfo.username} />
                                    <AvatarFallback className="text-2xl bg-blue-600">
                                        {teacherInfo.username.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-1">{teacherInfo.username}</h2>
                                            <p className="text-blue-400">Teacher</p>
                                        </div>
                                        <Button className="bg-blue-600 hover:bg-blue-700"
                                                onClick={toggleProfileVisibility}>
                                            {isProfileVisible ? "Hide Full Profile" : "View Full Profile"}
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-3 gap-8">
                                        {[ // Normal profile info (visible always)
                                            {label: 'Email', value: teacherInfo.email, icon: '@'},
                                            {label: 'Department', value: teacherInfo.department, icon: '📚'},
                                            {label: 'Teacher ID', value: teacherInfo.teacherId, icon: '🆔'}
                                        ].map((item, index) => (
                                            <div key={index} className="space-y-1">
                                                <p className="text-sm text-gray-400 flex items-center gap-2">
                                                    <span>{item.icon}</span>
                                                    {item.label}
                                                </p>
                                                <p className="text-gray-100">{item.value}</p>
                                            </div>
                                        ))}

                                        {/* Profile details visible when isProfileVisible is true */}
                                        {isProfileVisible && [
                                            {label: 'Date of Hire', value: teacherInfo.dateOfHire, icon: '📅'},
                                            {label: 'Qualification', value: teacherInfo.qualification, icon: '🎓'},
                                            {label: 'Specialization', value: teacherInfo.specialization, icon: '🔬'},
                                            {label: 'Office Hours', value: teacherInfo.officeHours, icon: '⏰'}
                                        ].map((item, index) => (
                                            <div key={index} className="space-y-1">
                                                <p className="text-sm text-gray-400 flex items-center gap-2">
                                                    <span>{item.icon}</span>
                                                    {item.label}
                                                </p>
                                                <p className="text-gray-100">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
};

export default TeacherDashboard;
