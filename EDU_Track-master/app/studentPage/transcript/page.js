"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StudentSidebar from "@/components/student/sidebar";

export default function Transcript() {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTranscript = async () => {
            try {
                const userData = sessionStorage.getItem("userData");

                if (!userData) {
                    setError("No userData found in session storage");
                    return;
                }

                const parsedData = JSON.parse(userData);
                const { accessToken: token } = parsedData;

                if (!token) {
                    setError("Token not found in session storage");
                    return;
                }

                const response = await fetch("http://localhost:8081/api/exam_result/transcript", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch transcript data");
                }

                const contentType = response.headers.get("Content-Type");

                if (contentType.includes("application/pdf")) {
                    // Handle PDF response
                    const blob = await response.blob();
                    const pdfBlobUrl = URL.createObjectURL(blob); // Generate a URL for the PDF blob
                    setPdfUrl(pdfBlobUrl);
                } else {
                    throw new Error("Unexpected response type. Expected a PDF.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTranscript();
    }, []);

    if (loading) {
        return <div className="text-center text-gray-200">Loading transcript...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-[#121212] text-gray-200 grid grid-cols-[auto_1fr]">
            <StudentSidebar />
            <main className="container mx-auto p-6 space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center text-gray-100">
                            Official Transcript
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Display the PDF using an iframe */}
                        {pdfUrl && (
                            <iframe
                                src={pdfUrl}
                                width="100%"
                                height="600px"
                                className="border border-gray-700 rounded-lg"
                                title="Transcript PDF"
                            ></iframe>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
