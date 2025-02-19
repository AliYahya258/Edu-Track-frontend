'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, User, Briefcase, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ParentSidebar from "@/components/parent/sidebar";

function ParentDashboard() {
    const [parent, setParent] = useState(null); // State for parent info
    const [loading, setLoading] = useState(true); // State for loading
    const [error, setError] = useState(null); // State for error
    const [visibleProfile, setVisibleProfile] = useState(null); // State to track the expanded child profile
    const router = useRouter();

    // Fetch Parent Info
    useEffect(() => {
        const fetchParentInfo = async () => {
            try {
                const token = JSON.parse(sessionStorage.getItem("userData"))?.accessToken; // Retrieve token
                if (!token) {
                    setError("Authentication token not found.");
                    setLoading(false);
                    return;
                }

                const response = await fetch("http://localhost:8081/api/auth/getparentinfo", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass token in the header
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch parent information.");
                }

                const data = await response.json();
                setParent({
                    name: data.username,
                    email: data.email,
                    phone: data.contactNumber,
                    address: data.address,
                    occupation: data.occupation,
                    children: data.children.map((child) => ({
                        id: child.id,
                        name: child.username,
                        email: child.email,
                        studentId: child.studentId,
                    })),
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchParentInfo();
    }, []);

    const toggleProfileVisibility = (id) => {
        setVisibleProfile((prev) => (prev === id ? null : id));
    };

    if (loading) {
        return <div className="text-center text-gray-400">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 grid grid-cols-[auto_1fr]">
            <ParentSidebar />
            <main className="p-6">
                <h1 className="text-4xl font-bold mb-2">Welcome back, {parent.name}!</h1>
                <p className="text-gray-400 mb-8">Track your children's academic progress and activities</p>

                {/* Parent Profile Card */}
                <Card className="bg-[#1f2937] border-0 p-6 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl">
                            {parent.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold">{parent.name}</h2>
                            <p className="text-blue-400">Parent</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                            <Mail className="text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-400">Email</p>
                                <p>{parent.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-400">Phone</p>
                                <p>{parent.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Briefcase className="text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-400">Occupation</p>
                                <p>{parent.occupation}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Home className="text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-400">Address</p>
                                <p>{parent.address}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Children Section */}
                <h2 className="text-3xl font-bold mb-4">Children Record</h2>
                {parent.children.map((child) => (
                    <Card key={child.id} className="bg-[#1f2937] border-0 p-6 mb-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl">
                                {child.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold">{child.name}</h2>
                                <p className="text-blue-400">Student</p>
                            </div>
                            <Button
                                className="ml-auto bg-blue-600 hover:bg-blue-700"
                                onClick={() => toggleProfileVisibility(child.id)}
                            >
                                {visibleProfile === child.id ? "Hide Full Profile" : "View Full Profile"}
                            </Button>
                        </div>
                        {visibleProfile === child.id && (
                            <div className="mt-4 text-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-400">Email</p>
                                        <p>{child.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Student ID</p>
                                        <p>{child.studentId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Search ID</p>
                                        <p>{child.id}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                ))}
            </main>
        </div>
    );
}

export default ParentDashboard;