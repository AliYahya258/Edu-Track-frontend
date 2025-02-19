'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileIcon, Upload } from "lucide-react"; // Use Upload icon for the button
import StudentSidebar from "@/components/student/sidebar";
import { useRouter } from "next/navigation";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast"; // Import Toast components

const Assignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [fullName, setFullName] = useState("");
  const [file, setFile] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [isError, setIsError] = useState(false); // State to determine toast color
  const router = useRouter();

  const userData = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("userData")) : null;
  const token = userData?.accessToken;
  const studentId = userData?.id;

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/assignments/course/3064/student/${studentId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error("Failed to fetch feedback");

        const data = await response.json();
        setAssignments(data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    if (studentId && token) {
      fetchAssignments();
    }
  }, [studentId, token]);

  const handleSubmit = async (event, assignmentId) => {
    event.preventDefault();

    if (!file) {
      alert("Please upload a file");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("studentId", studentId);
    formData.append("file", file);

    try {
      const response = await fetch(`http://localhost:8081/api/assignments/submit?assignmentId=${assignmentId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        setIsError(true); // Set to error for toast color
        setShowToast(true);
        throw new Error(`Failed to submit assignment: ${errorMessage}`);
      }

      setIsError(false); // Success state
      setShowToast(true);
      router.refresh();
    } catch (error) {
      console.error("Error submitting assignment:", error.message);
      setIsError(true); // Set error for toast color
      setShowToast(true);
    }
  };

  return (
      <ToastProvider>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200 grid grid-cols-[auto_1fr]">
          <div className="bg-[#1C2C4A]">
            <StudentSidebar />
          </div>

          <div className="flex flex-col p-6 w-full">
            <nav className="bg-[#1C2C4A] text-white p-4 flex justify-between items-center">
              <h2 className="text-lg">Assignments</h2>
            </nav>

            <main className="space-y-6">
              {assignments.length > 0 ? (
                  assignments.map((assignment) => (
                      <Card key={assignment.assignment_id} className="bg-gray-800/50 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-2xl font-bold text-center text-gray-100">{assignment.assignmentTitle}</CardTitle>
                          <CardDescription className="text-gray-300 text-center">{assignment.description || "No description available"}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-gray-300 space-y-2">
                            <p>Upload Date: {assignment.uploadDate}</p>
                            <p>Due Date: {assignment.dueDate}</p>
                            <p>Status: {assignment.submitted ? "Submitted" : "Not Submitted"}</p>
                            <p>Graded: {assignment.graded ? "Yes" : "No"}</p>
                            {assignment.feedback && <p>Feedback: {assignment.feedback}</p>}
                            {assignment.marks > 0 && <p>Marks: {assignment.marks}</p>}
                          </div>
                        </CardContent>

                        {!assignment.submitted && (
                            <CardFooter>
                              <form className="space-y-4" onSubmit={(e) => handleSubmit(e, assignment.assignment_id)}>
                                <div className="space-y-2">
                                  <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                                  <Input
                                      id="name"
                                      placeholder="Enter your full name"
                                      className="bg-gray-700 border-gray-600 text-gray-200"
                                      value={fullName}
                                      onChange={(e) => setFullName(e.target.value)}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="file" className="text-gray-300">Upload Assignment</Label>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                        type="button"
                                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md"
                                        onClick={() => document.getElementById("file").click()}
                                    >
                                      <Upload className="h-5 w-5 text-gray-400" />
                                    </Button>
                                    <Input
                                        id="file"
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                    {file && <p className="text-gray-300">{file.name}</p>}
                                  </div>
                                </div>
                                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">Submit Assignment</Button>
                              </form>
                            </CardFooter>
                        )}
                      </Card>
                  ))
              ) : (
                  <p className="text-gray-400 text-center">No assignments found for this course and student.</p>
              )}
            </main>
          </div>
          <ToastViewport />

          {showToast && (
              <Toast onOpenChange={() => setShowToast(false)} className={isError ? "bg-red-600" : "bg-green-600"}>
                <div className="flex">
                  <ToastTitle>{isError ? "Error!" : "Success!"}</ToastTitle>
                  <ToastClose />
                </div>
                <ToastDescription>{isError ? "Failed to submit the assignment." : "Your assignment has been submitted successfully."}</ToastDescription>
              </Toast>
          )}
        </div>
      </ToastProvider>
  );
};

export default Assignment;
