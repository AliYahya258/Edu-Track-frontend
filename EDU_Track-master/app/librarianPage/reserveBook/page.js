"use client";

import { useState } from "react";
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

export default function ReserveBook() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            bookId: "",
            studentId: "",
        },
    });

    const [toastMessage, setToastMessage] = useState(null);
    const [toastType, setToastType] = useState("success");

    const showToast = (type, message) => {
        setToastType(type);
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000); // Hide toast after 3 seconds
    };

    const onSubmit = async (data) => {
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
            const response = await fetch(`http://localhost:8081/api/library/reserve?bookId=${data.bookId}&studentId=${data.studentId}`, {
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
                showToast("success", responseData.message || "Book reserved successfully!");
            } else {
                showToast("error", responseData.message || "Something went wrong.");
            }
        } catch (error) {
            showToast("error", "An error occurred while reserving the book.");
        }

        reset();
    };

    return (
        <ToastProvider>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
                <div className="grid grid-cols-[auto_1fr]">
                    <LibrarianSidebar />

                    <main className="p-8">
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Reserve Book</h1>
                            <p className="text-gray-400">Enter the book and student details to reserve a book.</p>
                        </header>

                        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                            <CardHeader className="p-6">
                                <h2 className="text-2xl font-bold text-white">Reserve Book Information</h2>
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
                                            Reserve Book
                                        </span>
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </main>
                </div>

                <ToastViewport />

                {/* Toast */}
                {toastMessage && (
                    <Toast
                        className={toastType === "error" ? "bg-red-600" : "bg-green-600"}
                        onOpenChange={(isOpen) => !isOpen && setToastMessage(null)}
                    >
                        <ToastTitle>{toastType === "error" ? "Error" : "Success"}</ToastTitle>
                        <ToastDescription>{toastMessage}</ToastDescription>
                        <ToastClose />
                    </Toast>
                )}
            </div>
        </ToastProvider>
    );
}
