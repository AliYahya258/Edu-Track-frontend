"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LibrarianSidebar from "@/components/librarian/sidebar";
import {
    ToastProvider,
    ToastViewport,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose,
} from "@/components/ui/toast";

export default function ReturnBook() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            bookId: "",
            studentId: "",
        },
    });

    const [bookDetails, setBookDetails] = useState(null);
    const [isLate, setIsLate] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastType, setToastType] = useState("success");
    const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false);

    const showToast = (type, message) => {
        setToastType(type);
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000); // Hide toast after 3 seconds
    };

    const fetchBookDetails = async (bookId) => {
        const userData = sessionStorage.getItem('userData');

        if (!userData) {
            showToast("error", "No userData found in session storage");
            return;
        }

        const parsedData = JSON.parse(userData);
        const token = parsedData.accessToken;

        if (!token) {
            showToast("error", "Authorization token missing.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8081/api/library/search?query=${bookId}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const contentType = response.headers.get("content-type");
            const responseData = contentType && contentType.includes("application/json")
                ? await response.json()
                : await response.text();

            console.log("Fetched book details:", responseData); // Debug log

            if (response.ok) {
                setBookDetails(responseData);

                // Check if the book is overdue
                const dueDate = new Date(responseData.dueDate);
                const today = new Date();
                if (today > dueDate) {
                    setIsLate(true);
                } else {
                    setIsLate(false);
                }
            } else {
                showToast("error", responseData.message || "Book not found.");
            }
        } catch (error) {
            showToast("error", "An error occurred while fetching book details.");
        }
    };

    const handleReturn = async (data) => {
        const userData = sessionStorage.getItem('userData');

        if (!userData) {
            showToast("error", "No userData found in session storage");
            return;
        }

        const parsedData = JSON.parse(userData);
        const token = parsedData.accessToken;

        if (!token) {
            showToast("error", "Authorization token missing.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8081/api/library/return?bookId=${data.bookId}&studentId=${data.studentId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const contentType = response.headers.get("content-type");
            const responseData = contentType && contentType.includes("application/json")
                ? await response.json()
                : await response.text();

            if (response.ok) {
                showToast("success", responseData.message || "Book returned successfully!");
            } else {
                showToast("error", responseData.message || "Something went wrong.");
            }
        } catch (error) {
            showToast("error", "An error occurred while returning the book.");
        }

        reset();
    };

    const handleApplyPenalty = async () => {
        const userData = sessionStorage.getItem('userData');

        if (!userData) {
            showToast("error", "No userData found in session storage");
            return;
        }

        const parsedData = JSON.parse(userData);
        const token = parsedData.accessToken;

        if (!token) {
            showToast("error", "Authorization token missing.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8081/api/library/apply-penalties?studentId=${bookDetails.studentId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const contentType = response.headers.get("content-type");
            const responseData = contentType && contentType.includes("application/json")
                ? await response.json()
                : await response.text();

            if (response.ok) {
                showToast("success", responseData.message || "Penalty applied successfully.");
            } else {
                showToast("error", responseData.message || "Something went wrong.");
            }
        } catch (error) {
            showToast("error", "An error occurred while applying penalties.");
        }
    };

    const onSubmit = (data) => {
        handleReturn(data);
        fetchBookDetails(data.bookId);
    };

    return (
        <ToastProvider>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
                <div className="grid grid-cols-[auto_1fr]">
                    <LibrarianSidebar />

                    <main className="p-8">
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Return Book</h1>
                            <p className="text-gray-400">Enter the book and student details to return a book.</p>
                        </header>

                        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                            <CardHeader className="p-6">
                                <h2 className="text-2xl font-bold text-white">Return Book Information</h2>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    {/* Book ID */}
                                    <div className="space-y-2">
                                        <Label htmlFor="bookId" className="text-white">Book ID</Label>
                                        <Input
                                            id="bookId"
                                            {...register("bookId", { required: "Book ID is required" })}
                                            className="bg-gray-700 text-white border-gray-600"
                                        />
                                        {errors.bookId && <p className="text-sm text-red-500">{errors.bookId.message}</p>}
                                    </div>

                                    {/* Student ID */}
                                    <div className="space-y-2">
                                        <Label htmlFor="studentId" className="text-white">Student ID</Label>
                                        <Input
                                            id="studentId"
                                            {...register("studentId", { required: "Student ID is required" })}
                                            className="bg-gray-700 text-white border-gray-600"
                                        />
                                        {errors.studentId && <p className="text-sm text-red-500">{errors.studentId.message}</p>}
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 transition-colors duration-200"
                                    >
                                        <span className="flex items-center justify-center">
                                            Return Book
                                        </span>
                                    </Button>
                                </form>

                                {/* Book Details Display */}
                                {bookDetails && (
                                    <div className="mt-8">
                                        <h3 className="text-lg text-white">Book Status:</h3>
                                        <ul className="text-gray-300">
                                            <li>{isLate ? "Overdue" : "On Time"}</li>
                                        </ul>

                                        {/* Apply Penalty Button */}
                                        <Button
                                            onClick={() => setIsPenaltyModalOpen(true)}
                                            disabled={!isLate}
                                            className={`mt-4 w-full ${isLate ? "bg-red-600 hover:bg-red-700" : "bg-gray-500 cursor-not-allowed"}`}
                                        >
                                            Apply Penalty
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </main>
                </div>

                {/* Toast */}
                {toastMessage && (
                    <Toast className={`bg-${toastType === "success" ? "green" : "red"}-500`}>
                        <ToastTitle>{toastType === "success" ? "Success!" : "Error!"}</ToastTitle>
                        <ToastDescription>{toastMessage}</ToastDescription>
                        <ToastClose />
                    </Toast>
                )}

                {/* Penalty Modal */}
                {isPenaltyModalOpen && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg w-1/3">
                            <h2 className="text-2xl font-bold mb-4">Apply Penalty</h2>
                            <p className="mb-4">The book is overdue. Do you want to apply a penalty?</p>
                            <Button
                                onClick={handleApplyPenalty}
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 transition-colors duration-200"
                            >
                                Apply Penalty
                            </Button>
                            <Button
                                onClick={() => setIsPenaltyModalOpen(false)}
                                className="w-full mt-2 bg-gray-500 hover:bg-gray-600 text-white py-2 transition-colors duration-200"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
                <ToastViewport />
            </div>
        </ToastProvider>
    );
}
