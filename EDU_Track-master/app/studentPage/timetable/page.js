"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {  Clock, User, MapPin } from "lucide-react";
import StudentSidebar from "@/components/student/sidebar";

const validDays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const fetchTimetableData = async (studentId, day, token) => {
  try {
    const response = await fetch(
        `http://localhost:8081/api/schedules/student?studentId=${studentId}&day=${day.toLowerCase()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch timetable. Please check your input.");
    }

    const data = await response.json();
    const formattedData = {};

    data.forEach((entry) => {
      const dayUpper = entry.day.toUpperCase();
      if (!formattedData[dayUpper]) {
        formattedData[dayUpper] = [];
      }
      formattedData[dayUpper].push({
        code: entry.courseCode,
        id: entry.courseId,
        name: entry.courseName,
        s_name: entry.sectionName,
        instructor: entry.teacherName,
        startTime: entry.startTime,
        endTime: entry.endTime,
        classroom: entry.classroom,
      });
    });

    return formattedData;
  } catch (error) {
    console.error("Error fetching timetable data:", error);
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
  const [activeDay, setActiveDay] = useState("MONDAY");
  const [timetableData, setTimetableData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [toast, setToast] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Access sessionStorage only in the client-side
    const storedData = sessionStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
    } else {
      setToast({ message: "You must be logged in to view your timetable.", variant: "destructive" });
    }
  }, []);

  const token = userData?.accessToken;
  const studentId = userData?.id;

  useEffect(() => {
    if (!token || !studentId) return;

    const fetchData = async () => {
      setIsFetching(true);
      try {
        const data = await fetchTimetableData(studentId, activeDay, token);
        setTimetableData(data);
      } catch (error) {
        setToast({ message: "Failed to fetch timetable. Please try again.", variant: "destructive" });
      } finally {
        setIsFetching(false);
      }
    };

    const debounceFetch = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [activeDay, token, studentId]);

  const handleDayClick = (day) => {
    setActiveDay(day);
  };

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
        <div className="grid grid-cols-[auto_1fr]">
          <StudentSidebar />
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
                    Your Timetable
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl text-white font-semibold">Active Day: {activeDay}</h2>
                    <div className="flex items-center space-x-2">
                      {validDays.slice(0, 5).map((day) => (
                          <button
                              key={day}
                              className={`px-4 py-2 rounded-md text-white ${activeDay === day ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
                              onClick={() => handleDayClick(day)}
                          >
                            {day.slice(0, 3)}
                          </button>
                      ))}
                    </div>
                  </div>
                  {isFetching ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                  ) : timetableData ? (
                      <Tabs defaultValue={activeDay} onValueChange={setActiveDay} className="w-full">
                        {Object.entries(timetableData).map(([day, schedule]) => (
                            <TabsContent key={day} value={day} className="mt-0">
                              <div className="space-y-4">
                                {schedule.length === 0 ? (
                                    <p className="text-gray-400 text-center py-8">
                                      No classes scheduled for this day.
                                    </p>
                                ) : (
                                    schedule.map((class_, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="bg-gray-700 rounded-lg overflow-hidden shadow-md"
                                        >
                                          <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                              <div>
                                                <h3 className="font-bold text-white text-lg">
                                                  {class_.code}
                                                </h3>
                                                <p className="text-blue-300">{class_.name} ( {class_.id} )</p>
                                                <p className="text-blue-300">Section {class_.s_name}</p>
                                              </div>
                                              <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                {class_.startTime} - {class_.endTime}
                                              </div>
                                            </div>
                                            <div className="flex items-center text-gray-300 text-sm mt-2">
                                              <User className="w-4 h-4 mr-2" />
                                              <span>{class_.instructor}</span>
                                            </div>
                                            <div className="flex items-center text-gray-300 text-sm mt-1">
                                              <MapPin className="w-4 h-4 mr-2" />
                                              <span>{class_.classroom}</span>
                                            </div>
                                          </div>
                                        </motion.div>
                                    ))
                                )}
                              </div>
                            </TabsContent>
                        ))}
                      </Tabs>
                  ) : (
                      <Card className="bg-gray-700 border-gray-600 p-6 text-center">
                        <CardContent>
                          <h3 className="mt-2 text-lg font-semibold text-white">
                            No timetable available
                          </h3>
                          <p className="mt-1 text-gray-300">
                            Please select a day to fetch your timetable.
                          </p>
                        </CardContent>
                      </Card>
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
