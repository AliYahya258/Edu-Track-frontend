'use client';

import {Calendar, User, Mail, Phone, Home} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import StudentSidebar from "@/components/student/sidebar";
import {useState, useEffect} from "react";

const Dashboard = () => {
    const [studentInfo, setStudentInfo] = useState(null);
    const [isProfileVisible, setIsProfileVisible] = useState(false);
    const [setError] = useState(null);

    useEffect(() => {
        const fetchStudentInfo = async () => {
            try {
                const userData = sessionStorage.getItem('userData');

                if (!userData) {
                    setError("No userData found in session storage");
                    return;
                }

                const parsedData = JSON.parse(userData);
                const token = parsedData.accessToken;

                if (!token) {
                    setError("No token found in userData");
                    return;
                }

                const response = await fetch("http://localhost:8081/api/auth/getstudentinfo", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setStudentInfo(data);
                } else {
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch librarian info: ${errorText}`);
                }
            } catch (error) {
                console.error("Error fetching librarian info:", error);
                setError("Failed to fetch student information. Please try again later.");
            }
        };

        fetchStudentInfo();
    }, []);

    const toggleProfileVisibility = () => {
        setIsProfileVisible(!isProfileVisible);
    };

    if (!studentInfo) {
        return <p className="text-center text-white">Loading...</p>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="grid grid-cols-[auto_1fr]">
                <StudentSidebar/>
                <main className="p-8">
                    <header className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">Welcome
                                back, {studentInfo.username.split(' ')[0]}!</h1>
                            <p className="text-gray-400">Track your academic progress and upcoming activities</p>
                        </div>
                    </header>

                    {/* Student Profile Card */}
                    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-8">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-6">
                                <Avatar className="h-24 w-24 border-2 border-blue-500">
                                    <AvatarImage
                                        src={studentInfo.profilePicture || "/placeholder.svg?height=96&width=96"}
                                        alt={studentInfo.username}/>
                                    <AvatarFallback className="text-2xl bg-blue-600">
                                        {studentInfo.username.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-1">{studentInfo.username}</h2>
                                            <p className="text-blue-400">Student</p>
                                        </div>
                                        <Button className="bg-blue-600 hover:bg-blue-700"
                                                onClick={toggleProfileVisibility}>
                                            {isProfileVisible ? "Hide Full Profile" : "View Full Profile"}
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-8">
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-400 flex items-center gap-2">
                                                <Mail className="h-4 w-4"/>
                                                Email
                                            </p>
                                            <p className="text-gray-100">{studentInfo.email}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-400 flex items-center gap-2">
                                                <User className="h-4 w-4"/>
                                                Student ID
                                            </p>
                                            <p className="text-gray-100">{studentInfo.studentId}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-400 flex items-center gap-2">
                                                <Calendar className="h-4 w-4"/>
                                                Semester
                                            </p>
                                            <p className="text-gray-100">{studentInfo.semester}</p>
                                        </div>
                                    </div>
                                    {isProfileVisible && (
                                        <div className="mt-4 text-gray-200">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="space-y-1">
                                                    <p className="text-sm text-gray-400 flex items-center gap-2">
                                                        <Calendar className="h-4 w-4"/>
                                                        Academic Year
                                                    </p>
                                                    <p className="text-gray-100">{studentInfo.academicYear}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-gray-400 flex items-center gap-2">
                                                        <Phone className="h-4 w-4"/>
                                                        Phone
                                                    </p>
                                                    <p className="text-gray-100">{studentInfo.emergencyContact}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-gray-400 flex items-center gap-2">
                                                        <Home className="h-4 w-4"/>
                                                        Address
                                                    </p>
                                                    <p className="text-gray-100">{studentInfo.address}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Parent Information */}
                    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-8">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-6">
                                <Avatar className="h-24 w-24 border-2 border-blue-500">
                                    <AvatarImage
                                        src={studentInfo.profilePicture || "/placeholder.svg?height=96&width=96"}
                                        alt={studentInfo.parentUsername}
                                    />
                                    <AvatarFallback className="text-2xl bg-blue-600">
                                        {studentInfo.parentUsername.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-1">{studentInfo.parentUsername}</h2>
                                            <p className="text-blue-400">Parent</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-8">
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-400 flex items-center gap-2">
                                                <Mail className="h-4 w-4"/>
                                                Email
                                            </p>
                                            <p className="text-gray-100">{studentInfo.parentEmail}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-400 flex items-center gap-2">
                                                <User className="h-4 w-4"/>
                                                Occupation
                                            </p>
                                            <p className="text-gray-100">{studentInfo.parentOccupation}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-400 flex items-center gap-2">
                                                <Phone className="h-4 w-4"/>
                                                Phone
                                            </p>
                                            <p className="text-gray-100">{studentInfo.parentContactNumber}</p>
                                        </div>
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

export default Dashboard;