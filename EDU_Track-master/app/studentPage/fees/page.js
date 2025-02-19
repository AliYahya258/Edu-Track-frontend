'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Printer, Check } from 'lucide-react';
import Sidebar from "@/components/student/sidebar"; // Import your Sidebar component

export default function Fees() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [feeData, setFeeData] = useState(null);
  const [period, setPeriod] = useState('');
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Get token and student info from session storage
  const sessionData = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const token = sessionData.accessToken;
  const studentName = sessionData.username;

  // Fetch data by student ID initially
  useEffect(() => {
    if (token) {
      fetchFeeDataByStudentID();
    }
  }, [token]);

  const fetchFeeDataByStudentID = async () => {
    try {
      setError(null);
      const response = await fetch(`http://localhost:8081/api/fees/student`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch fee data. Status: ${response.status}`);
      }

      const data = await response.json();
      setFeeData(data[0]);
    } catch (error) {
      console.error("Error fetching fee data:", error);
      setError("Failed to fetch fee data. Please try again later.");
    }
  };

  const fetchFeeDataByPeriod = async () => {
    try {
      setError(null);
      const response = await fetch(`http://localhost:8081/api/fees/student/period?period=${encodeURIComponent(period)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch fee data for period. Status: ${response.status}`);
      }

      const data = await response.json();
      setFeeData(data);
    } catch (error) {
      console.error("Error fetching fee data:", error);
      setError("Failed to fetch fee data for specified period. Please try again.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const totalAmount = feeData?.totalAmount || 0;
  const paidAmount = feeData?.paidAmount || 0;
  const dueAmount = feeData?.dueAmount || 0;

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200 grid grid-cols-[auto_1fr]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="p-6 w-full">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Period Search Input */}
            <div className="space-y-2">
              <Label htmlFor="period-search" className="text-gray-400">Search by Period</Label>
              <div className="flex items-center space-x-2">
                <Input
                    id="period-search"
                    type="text"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    placeholder="e.g., Fall 2024"
                    className="bg-gray-700/50 border-gray-600 text-gray-100"
                />
                <Button onClick={fetchFeeDataByPeriod} className="bg-blue-600 text-white hover:bg-blue-700">
                  Search
                </Button>
              </div>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {/* Fee Challan Card */}
            {feeData && (
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-gray-100">Fee Challan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Student Info */}
                    <div className="grid grid-cols-2 gap-4 text-gray-200">
                      <div><span className="font-semibold">Student Name:</span> {studentName}</div>
                      <div><span className="font-semibold">Period:</span> {feeData.period}</div>
                      <div><span className="font-semibold">Status:</span> {feeData.status}</div>
                    </div>

                    {/* Fee Table */}
                    <Table className="rounded-lg overflow-hidden border border-gray-700">
                      <TableHeader>
                        <TableRow className="bg-gray-800/50 hover:bg-gray-800/50">
                          <TableHead className="text-gray-300">Description</TableHead>
                          <TableHead className="text-right text-gray-300">Amount (PKR)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="hover:bg-gray-800/30">
                          <TableCell className="font-medium text-gray-200">Total Amount</TableCell>
                          <TableCell className="text-right text-gray-200">{totalAmount.toLocaleString()}</TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-gray-800/30">
                          <TableCell className="font-medium text-gray-200">Paid Amount</TableCell>
                          <TableCell className="text-right text-gray-200">{paidAmount.toLocaleString()}</TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-gray-800/30">
                          <TableCell className="font-medium text-gray-200">Due Amount</TableCell>
                          <TableCell className="text-right text-gray-200">{dueAmount.toLocaleString()}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex justify-between print:hidden">
                    <Button onClick={handlePrint} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Printer className="mr-2 h-4 w-4" /> Print Challan
                    </Button>
                  </CardFooter>
                </Card>
            )}
          </div>
        </div>
      </div>
  );
}
