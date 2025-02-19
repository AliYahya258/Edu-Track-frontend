'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StudentSidebar from "@/components/student/sidebar";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const userData = sessionStorage.getItem('userData');

        if (!userData) {
          setError("No userData found in session storage");
          return;
        }

        const parsedData = JSON.parse(userData);
        const { accessToken: token, id: studentId } = parsedData;

        if (!token || !studentId) {
          setError("Required data (token or studentId) not found in session storage");
          return;
        }

        // Fetch Attendance Data using studentId
        const attendanceResponse = await fetch(`http://localhost:8081/api/attendance/student/${studentId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (attendanceResponse.ok) {
          const attendanceData = await attendanceResponse.json();
          setAttendanceData(attendanceData);
        } else {
          const errorText = await attendanceResponse.text();
          throw new Error(`Failed to fetch attendance data: ${errorText}`);
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setError("Failed to fetch attendance data. Please try again later.");
      }
    };

    fetchAttendanceData();
  }, []);

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200 grid grid-cols-[auto_1fr]">
        {/* Sidebar */}
        <div className="bg-[#1C2C4A]">
          <StudentSidebar />
        </div>

        {/* Main Content */}
        <div className="flex flex-col p-6 w-full">
          <nav className="bg-[#1C2C4A] text-white p-4 flex justify-between items-center">
            <h2 className="text-lg">Attendance</h2>
          </nav>

          <main className="space-y-6">
            {/* Attendance Table */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-center text-gray-100">Attendance Details</CardTitle>
              </CardHeader>
              <CardContent>
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <Table className="rounded-lg overflow-hidden border border-gray-700">
                      <TableHeader>
                        <TableRow className="bg-gray-800/50 hover:bg-gray-800/50">
                          <TableHead className="text-gray-300">Date</TableHead>
                          <TableHead className="text-gray-300">Course Name</TableHead>
                          <TableHead className="text-gray-300">Section</TableHead>
                          <TableHead className="text-gray-300">Presence</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendanceData.map((row, index) => (
                            <TableRow key={index} className="hover:bg-gray-800/30">
                              <TableCell className="text-gray-300">{row.attendanceDate}</TableCell>
                              <TableCell className="text-gray-300">{row.courseName}</TableCell>
                              <TableCell className="text-gray-300">{row.sectionName}</TableCell>
                              <TableCell className={row.present ? 'text-green-500' : 'text-red-500'}>
                                {row.present ? 'Present' : 'Absent'}
                              </TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
  );
}

export default Attendance;
