'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StudentSidebar from "@/components/student/sidebar";

const Marks = () => {
  const [marksData, setMarksData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarksData = async () => {
      try {
        const userData = sessionStorage.getItem('userData');

        if (!userData) {
          setError("No userData found in session storage");
          return;
        }

        const parsedData = JSON.parse(userData);
        const { accessToken: token} = parsedData;

        if (!token) {
          setError("Required data (token or studentId) not found in session storage");
          return;
        }

        // Fetch Marks Data using studentId
        const marksResponse = await fetch(`http://localhost:8081/api/exam_result/student`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (marksResponse.ok) {
          const marksData = await marksResponse.json();
          setMarksData(marksData);
        } else {
          const errorText = await marksResponse.text();
          throw new Error(`Failed to fetch marks data: ${errorText}`);
        }
      } catch (error) {
        console.error("Error fetching marks data:", error);
        setError("Failed to fetch marks data. Please try again later.");
      }
    };

    fetchMarksData();
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
            <h2 className="text-lg">Marks</h2>
          </nav>

          <main className="space-y-6">
            {/* Marks Table */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-center text-gray-100">Marks Details</CardTitle>
              </CardHeader>
              <CardContent>
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <Table className="rounded-lg overflow-hidden border border-gray-700">
                      <TableHeader>
                        <TableRow className="bg-gray-800/50 hover:bg-gray-800/50">
                          <TableHead className="text-gray-300">Course Name</TableHead>
                          <TableHead className="text-gray-300">Exam Type</TableHead>
                          <TableHead className="text-gray-300">Marks</TableHead>
                          <TableHead className="text-gray-300">Grade</TableHead>
                          <TableHead className="text-gray-300">Feedback</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {marksData.map((row, index) => (
                            <TableRow key={index} className="hover:bg-gray-800/30">
                              <TableCell className="text-gray-300">{row.courseName}</TableCell>
                              <TableCell className="text-gray-300">{row.examType}</TableCell>
                              <TableCell className="text-gray-300">{row.marks}</TableCell>
                              <TableCell className={`text-${row.grade === 'F' ? 'red' : 'green'}-500`}>{row.grade}</TableCell>
                              <TableCell className="text-gray-300">{row.feedback || "No feedback"}</TableCell>
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
};

export default Marks;
