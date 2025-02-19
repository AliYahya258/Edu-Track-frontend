"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from "lucide-react";
import TeacherSidebar from "@/components/teacher/sidebar";

const fetchScheduleByTeacher = async (token) => {
    try {
        const response = await fetch(`http://localhost:8081/api/schedules/teacher`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch teacher schedule.");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching teacher schedule:", error);
        throw error;
    }
};

const fetchScheduleByCourse = async (courseId, token) => {
    try {
        const response = await fetch(
            `http://localhost:8081/api/schedules/course/${courseId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch course-specific schedule.");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching course-specific schedule:", error);
        throw error;
    }
};

const Toast = ({ message, variant, onClose }) => (
    <div
        className={`fixed bottom-4 right-4 bg-${
            variant === "destructive" ? "red-600" : "green-600"
        } text-white px-4 py-2 rounded-md shadow-md`}
        onClick={onClose}
    >
        {message}
    </div>
);

export default function Timetable() {
    const [teacherSchedule, setTeacherSchedule] = useState([]);
    const [courseSchedule, setCourseSchedule] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [toast, setToast] = useState(null);
    const [userData, setUserData] = useState(null);
    const [courseId, setCourseId] = useState(""); // State for course ID input

    useEffect(() => {
        if (!sessionStorage.getItem("userData")) {
            setToast({
                message: "You must be logged in to view your timetable.",
                variant: "destructive",
            });
            setTimeout(() => {
                window.location.href = "/login"; // Replace with your login route
            }, 2000);
        } else {
            const storedData = JSON.parse(sessionStorage.getItem("userData"));
            setUserData(storedData);
        }
    }, []);

    const token = userData?.accessToken;

    useEffect(() => {
        if (!token) return;

        const fetchTeacherData = async () => {
            setIsFetching(true);
            try {
                const teacherData = await fetchScheduleByTeacher(token);
                setTeacherSchedule(teacherData);
            } catch (error) {
                setToast({
                    message: "Failed to fetch teacher schedule. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setIsFetching(false);
            }
        };

        fetchTeacherData();
    }, [token]);

    const handleFetchCourseSchedule = async () => {
        if (!courseId.trim()) {
            setToast({
                message: "Please enter a valid course ID.",
                variant: "destructive",
            });
            return;
        }

        setIsFetching(true);
        try {
            const courseData = await fetchScheduleByCourse(courseId, token);
            setCourseSchedule(courseData);
        } catch (error) {
            setToast({
                message: "Failed to fetch course-specific schedule. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
            <div className="grid grid-cols-[auto_1fr]">
                <TeacherSidebar />
                <main className="overflow-auto p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="bg-gray-800 border-gray-700 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                                    <Clock className="w-8 h-8 text-blue-500" />
                                    Timetable
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isFetching ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : (
                                    <Tabs defaultValue="Teacher">
                                        <TabsList className="mb-4">
                                            <TabsTrigger value="Teacher">Teacher Schedule</TabsTrigger>
                                            <TabsTrigger value="Course">Course Schedule</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="Teacher" className="mt-0">
                                            <h2 className="text-lg font-semibold mb-4 text-white">
                                                Teacher Schedule
                                            </h2>
                                            {teacherSchedule.length === 0 ? (
                                                <p className="text-gray-400 text-center py-8">
                                                    No schedule found for the teacher.
                                                </p>
                                            ) : (
                                                teacherSchedule.map((class_, index) => (
                                                    <motion.div
                                                        key={class_.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{
                                                            duration: 0.3,
                                                            delay: index * 0.1,
                                                        }}
                                                        className="bg-gray-700 rounded-lg p-4 shadow-md mb-4"
                                                    >
                                                        <h3 className="text-lg font-bold text-white">
                                                            {class_.courseName}
                                                        </h3>
                                                        <p className="text-blue-300">
                                                            Section: {class_.sectionName}
                                                        </p>
                                                        <p className="text-gray-300">
                                                            Day: {class_.day.trim()}
                                                        </p>
                                                        <p className="text-gray-300">
                                                            Time: {class_.startTime} -{" "}
                                                            {class_.endTime}
                                                        </p>
                                                        <p className="text-gray-300">
                                                            Classroom: {class_.classroom}
                                                        </p>
                                                    </motion.div>
                                                ))
                                            )}
                                        </TabsContent>
                                        <TabsContent value="Course" className="mt-0 ">
                                            <div className="flex items-center mb-4">
                                                <input
                                                    type="text"
                                                    value={courseId}
                                                    onChange={(e) =>
                                                        setCourseId(e.target.value)
                                                    }
                                                    placeholder="Enter Course ID"
                                                    className="px-4 py-2 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <button
                                                    onClick={handleFetchCourseSchedule}
                                                    className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                                >
                                                    Get Schedule
                                                </button>
                                            </div>
                                            <h2 className="text-lg font-semibold mb-4 text-white">
                                                Course-Specific Schedule
                                            </h2>
                                            {courseSchedule.length === 0 ? (
                                                <p className="text-gray-400 text-center py-8">
                                                    No schedule found for the course.
                                                </p>
                                            ) : (
                                                courseSchedule.map((class_, index) => (
                                                    <motion.div
                                                        key={class_.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{
                                                            duration: 0.3,
                                                            delay: index * 0.1,
                                                        }}
                                                        className="bg-gray-700 rounded-lg p-4 shadow-md mb-4"
                                                    >
                                                        <h3 className="text-lg font-bold text-white">
                                                            {class_.courseName}
                                                        </h3>
                                                        <p className="text-blue-300">
                                                            Section: {class_.sectionName}
                                                        </p>
                                                        <p className="text-gray-300">
                                                            Day: {class_.day.trim()}
                                                        </p>
                                                        <p className="text-gray-300">
                                                            Time: {class_.startTime} -{" "}
                                                            {class_.endTime}
                                                        </p>
                                                        <p className="text-gray-300">
                                                            Classroom: {class_.classroom}
                                                        </p>
                                                    </motion.div>
                                                ))
                                            )}
                                        </TabsContent>
                                    </Tabs>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </main>
            </div>
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
}
