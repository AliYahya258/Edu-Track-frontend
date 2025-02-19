'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Clock, MapPin, GraduationCap } from 'lucide-react';
import StudentSidebar from "@/components/student/sidebar";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Helper function to fetch data from an API with token
const fetchWithToken = async (url, token) => {
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return response.json();
};

export default function ExamSchedule() {
    const [activeTab, setActiveTab] = useState('Upcoming');
    const [examData, setExamData] = useState({ Upcoming: [], Course: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [courseId, setCourseId] = useState('');
    const [courseError, setCourseError] = useState(null);

    useEffect(() => {
        const getExamData = async () => {
            setLoading(true);
            setError(null);

            try {
                const userData = JSON.parse(sessionStorage.getItem('userData'));
                const token = userData?.accessToken;
                const studentId = userData?.id;

                if (!token || !studentId) throw new Error('User not authenticated.');

                const studentExams = await fetchWithToken(
                    `http://localhost:8081/api/exams/student/${studentId}/upcoming`,
                    token
                );

                setExamData((prevData) => ({
                    ...prevData,
                    Upcoming: studentExams.map((exam) => ({
                        course: `${exam.courseName} (ID: ${exam.courseId})`,
                        date: exam.examDate,
                        duration: `${exam.duration} mins`,
                        venue: exam.examLocation,
                        type: exam.examType
                    })),
                }));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getExamData();
    }, []);

    const fetchCourseExams = async () => {
        if (!courseId.trim()) {
            setCourseError('Course ID is required.');
            return;
        }

        setCourseError(null);
        setLoading(true);

        try {
            const userData = JSON.parse(sessionStorage.getItem('userData'));
            const token = userData?.accessToken;

            if (!token) throw new Error('User not authenticated.');

            const courseExams = await fetchWithToken(
                `http://localhost:8081/api/exams/course/${courseId}`,
                token
            );

            setExamData((prevData) => ({
                ...prevData,
                Course: courseExams.map((exam) => ({
                    course: `Exam ID: ${exam.examId}`,
                    date: exam.examDate,
                    duration: `${exam.duration} mins`,
                    venue: exam.examLocation,
                    type: exam.examType,
                })),
            }));
        } catch (err) {
            setCourseError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#1a1f2e] grid grid-cols-[auto_1fr]">
            <StudentSidebar />
            <div className="p-8 max-w-[1400px] mx-auto">
                <Card className="bg-[#1c2237] rounded-lg p-6">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-white mb-2">Exam Schedule</CardTitle>
                        <p className="text-gray-400">View your upcoming exams or search by course ID.</p>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <p className="text-center text-gray-400">Loading exams...</p>
                        ) : error ? (
                            <p className="text-center text-red-500">{error}</p>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <label className="block text-gray-300 mb-2">Enter Course ID:</label>
                                    <div className="flex">
                                        <Input
                                            type="text"
                                            value={courseId}
                                            onChange={(e) => setCourseId(e.target.value)}
                                            placeholder="e.g., 3064"
                                            className="flex-grow bg-gray-700/50 border-gray-600 text-gray-100 py-2 px-4 text-sm"
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={fetchCourseExams}
                                            disabled={loading}
                                            className="ml-2 border-gray-600 text-gray-300 hover:text-white"
                                        >
                                            Fetch
                                        </Button>
                                    </div>
                                    {courseError && <p className="text-red-500 mt-2">{courseError}</p>}
                                </div>
                                <Tabs defaultValue="Upcoming" onValueChange={setActiveTab} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 bg-gray-800 mb-4">
                                        {Object.keys(examData).map((tab) => (
                                            <TabsTrigger
                                                key={tab}
                                                value={tab}
                                                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400 py-2"
                                            >
                                                {tab}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                    {Object.entries(examData).map(([tab, exams]) => (
                                        <TabsContent key={tab} value={tab} className="mt-0">
                                            {exams.length ? (
                                                <div className="space-y-4">
                                                    {exams.map((exam, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md"
                                                        >
                                                            <div className="flex-grow">
                                                                <div className="font-bold text-white text-lg">
                                                                    {exam.course}
                                                                </div>
                                                                <div className="text-gray-300">{exam.date}</div>
                                                            </div>
                                                            <div className="flex flex-col text-right space-y-2">

                                                                <div className="flex items-center justify-end">
                                                                    <Clock className="mr-2 h-4 w-4 text-gray-400" />
                                                                    <span>{exam.duration}</span>
                                                                </div>
                                                                <div className="flex items-center justify-end">
                                                                    <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                                                                    <span>{exam.venue}</span>
                                                                </div>
                                                                <div className="flex items-center justify-end">
                                                                    <GraduationCap className="mr-2 h-4 w-4 text-gray-400" />
                                                                    <span>{exam.type}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-center text-gray-400">No exams for {tab}.</p>
                                            )}
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
