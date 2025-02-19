"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminSidebar from "@/components/admin/sidebar";

const ApproveRejectStudent = () => {
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastVariant, setToastVariant] = useState("default");
  const [studentIdInput, setStudentIdInput] = useState(""); // Input for student ID

  const handleAction = async (studentId, action) => {
    setLoading(true);
    setToastMessage(null);

    try {
      const userData = sessionStorage.getItem("userData");

      if (!userData) {
        setToastMessage("No user data found in session storage. Please log in again.");
        setToastVariant("destructive");
        setLoading(false);
        return;
      }

      const parsedData = JSON.parse(userData);
      const token = parsedData.accessToken;

      if (!token) {
        setToastMessage("Authentication token missing. Please log in again.");
        setToastVariant("destructive");
        setLoading(false);
        return;
      }

      const url =
          action === "approve"
              ? `http://localhost:8081/api/auth/approve/${studentId}`
              : `http://localhost:8081/api/auth/reject/${studentId}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setToastMessage(data.message || `Student ${action}d successfully!`);
        setToastVariant("default");
      } else if (response.status === 401) {
        setToastMessage("Session expired or unauthorized access. Please log in again.");
        setToastVariant("destructive");
      } else {
        const errorData = await response.json();
        setToastMessage(errorData.message || `Failed to ${action} student.`);
        setToastVariant("destructive");
      }
    } catch (error) {
      console.error(`Error ${action}ing student:`, error);
      setToastMessage(`Failed to ${action} student. Please try again later.`);
      setToastVariant("destructive");
    } finally {
      setLoading(false);
    }
  };

  return (
      <ToastProvider>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
          <div className="grid grid-cols-[auto_1fr]">
            <AdminSidebar />
            <main className="overflow-auto p-6">
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
              >
                <Card className="bg-gray-800 border-gray-700 max-w-2xl mx-auto shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold text-white flex items-center gap-2">
                      Approve or Reject Student
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Approve or reject student requests by entering their ID.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Input
                          type="number"
                          value={studentIdInput}
                          onChange={(e) => setStudentIdInput(e.target.value)}
                          placeholder="Enter Student ID"
                          className="w-full mb-4"
                      />
                      <div className="flex gap-2">
                        <Button
                            onClick={() => handleAction(studentIdInput, "approve")}
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={loading || !studentIdInput}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                            onClick={() => handleAction(studentIdInput, "reject")}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={loading || !studentIdInput}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </main>
          </div>
          <ToastViewport />

          {/* Toast */}
          {toastMessage && (
              <Toast
                  className={toastVariant === "destructive" ? "bg-red-600" : "bg-green-600"}
                  onOpenChange={(isOpen) => !isOpen && setToastMessage(null)}
              >
                <ToastTitle>{toastVariant === "destructive" ? "Error" : "Success"}</ToastTitle>
                <ToastDescription>{toastMessage}</ToastDescription>
                <ToastClose />
              </Toast>
          )}
        </div>
      </ToastProvider>
  );
};

export default ApproveRejectStudent;
