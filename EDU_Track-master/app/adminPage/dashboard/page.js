'use client';

import { useEffect, useState } from 'react';
import { Users, UserPlus, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import AdminSidebar from "@/components/admin/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Dashboard = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const userData = sessionStorage.getItem('userData'); // Retrieve token from session storage

        if (!userData) {
          setErrorMessage("No userData found in session storage");
          return;
        }

        const parsedData = JSON.parse(userData);
        const token = parsedData.accessToken; // Access the token from parsed data

        if (!token) {
          setErrorMessage("No token found in userData");
          return;
        }

        const response = await fetch("http://localhost:8081/api/auth/getadmininfo", {
          method: 'GET', // Ensuring the method is GET
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAdminInfo(data); // Store fetched data in state
        } else {
          const errorText = await response.text();
          throw new Error(`Failed to fetch admin info: ${errorText}`);
        }
      } catch (error) {
        console.error("Error fetching admin info:", error);
        setError("Failed to fetch admin information. Please try again later.");
      }
    };

    fetchAdminInfo();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!adminInfo) {
    return <div>Loading...</div>;
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="grid grid-cols-[auto_1fr]">
          <AdminSidebar />
          <main className="p-8">
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {adminInfo.username}!</h1>
                <p className="text-gray-400">Here is what&#39;s happening in your dashboard today.</p>
              </div>
            </header>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-8">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24 border-2 border-blue-500">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt={adminInfo.username} />
                    <AvatarFallback className="text-2xl bg-blue-600">
                      {adminInfo.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{adminInfo.username}</h2>
                        <p className="text-blue-400">System Administrator</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-8">
                      {[
                        { label: 'Email', value: adminInfo.email, icon: '@' },
                        { label: 'Admin ID', value: adminInfo.adminId, icon: '🆔' },
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
}

export default Dashboard;
