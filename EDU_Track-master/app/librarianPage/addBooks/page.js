// "use client";
//
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import LibrarianSidebar from "@/components/librarian/sidebar";
// import {
//     ToastProvider,
//     ToastViewport,
//     Toast,
//     ToastTitle,
//     ToastDescription,
//     ToastClose,
// } from "@/components/ui/toast";
//
// export default function AddBook() {
//     const { register, handleSubmit, formState: { errors }, reset } = useForm({
//         defaultValues: {
//             title: "",
//             author: "",
//             isbn: "",
//             publisher: "",
//         },
//     });
//
//     const [toastMessage, setToastMessage] = useState(null);
//     const [toastType, setToastType] = useState("success");
//
//     const showToast = (type, message) => {
//         setToastType(type);
//         setToastMessage(message);
//         setTimeout(() => setToastMessage(null), 3000); // Hide toast after 3 seconds
//     };
//
//     const onSubmit = async (data) => {
//         const userData = sessionStorage.getItem('userData');
//
//         if (!userData) {
//             showToast("error", "No userData found in session storage");
//             return;
//         }
//
//         const parsedData = JSON.parse(userData);
//         const token = parsedData.accessToken;
//
//         if (!token) {
//             showToast("error", "Authorization token missing.");
//             return;
//         }
//
//         try {
//             const response = await fetch(`http://localhost:8081/api/books/addBook?title=${data.title}&author=${data.author}&isbn=${data.isbn}&publisher=${data.publisher}`, {
//                 method: "POST",
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`,
//                 },
//             });
//
//             const contentType = response.headers.get("content-type");
//             const responseData = contentType && contentType.includes("application/json")
//                 ? await response.json()
//                 : await response.text();
//
//             if (response.ok) {
//                 showToast("success", responseData.message || "Book added successfully!");
//             } else if (response.status === 409) {
//                 showToast("error", responseData.message || "Book with this ISBN already exists.");
//             } else {
//                 showToast("error", responseData.message || "Something went wrong.");
//             }
//         } catch (error) {
//             showToast("error", "An error occurred while adding the book.");
//         }
//
//         reset();
//     };
//
//     return (
//         <ToastProvider>
//             <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
//                 <div className="grid grid-cols-[auto_1fr]">
//                     <LibrarianSidebar />
//
//                     <main className="p-8">
//                         <header className="mb-8">
//                             <h1 className="text-3xl font-bold text-white mb-2">Add New Book</h1>
//                             <p className="text-gray-400">Fill out the form to add a new book to the library.</p>
//                         </header>
//
//                         <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
//                             <CardHeader className="p-6">
//                                 <h2 className="text-2xl font-bold text-white">Book Information</h2>
//                             </CardHeader>
//                             <CardContent className="p-6">
//                                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                                     {/* Book Title */}
//                                     <div className="space-y-2">
//                                         <Label htmlFor="title" className="text-white">Title</Label>
//                                         <Input
//                                             id="title"
//                                             {...register("title", { required: "Title is required" })}
//                                             className="bg-gray-700 text-white border-gray-600"
//                                         />
//                                         {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
//                                     </div>
//
//                                     {/* Author */}
//                                     <div className="space-y-2">
//                                         <Label htmlFor="author" className="text-white">Author</Label>
//                                         <Input
//                                             id="author"
//                                             {...register("author", { required: "Author is required" })}
//                                             className="bg-gray-700 text-white border-gray-600"
//                                         />
//                                         {errors.author && <p className="text-sm text-red-500">{errors.author.message}</p>}
//                                     </div>
//
//                                     {/* ISBN */}
//                                     <div className="space-y-2">
//                                         <Label htmlFor="isbn" className="text-white">ISBN</Label>
//                                         <Input
//                                             id="isbn"
//                                             {...register("isbn", {
//                                                 required: "ISBN is required",
//                                                 minLength: { value: 10, message: "ISBN must be at least 10 characters" },
//                                                 maxLength: { value: 13, message: "ISBN must not exceed 13 characters" },
//                                             })}
//                                             className="bg-gray-700 text-white border-gray-600"
//                                         />
//                                         {errors.isbn && <p className="text-sm text-red-500">{errors.isbn.message}</p>}
//                                     </div>
//
//                                     {/* Publisher */}
//                                     <div className="space-y-2">
//                                         <Label htmlFor="publisher" className="text-white">Publisher</Label>
//                                         <Input
//                                             id="publisher"
//                                             {...register("publisher", { required: "Publisher is required" })}
//                                             className="bg-gray-700 text-white border-gray-600"
//                                         />
//                                         {errors.publisher && <p className="text-sm text-red-500">{errors.publisher.message}</p>}
//                                     </div>
//
//                                     <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
//                                         Add Book
//                                     </Button>
//                                 </form>
//                             </CardContent>
//                         </Card>
//                     </main>
//                 </div>
//
//                 {/* Toast Display */}
//                 {toastMessage && (
//                     <Toast className={toastType === "error" ? "bg-red-600" : "bg-green-600"}>
//                         <ToastTitle>{toastType === "error" ? "Error" : "Success"}</ToastTitle>
//                         <ToastDescription>{toastMessage}</ToastDescription>
//                         <ToastClose />
//                     </Toast>
//                 )}
//                 <ToastViewport />
//             </div>
//         </ToastProvider>
//     );
// }
//


"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LibrarianSidebar from "@/components/librarian/sidebar";
import { PlusCircle } from 'lucide-react'; // Icon import
import {
    ToastProvider,
    ToastViewport,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose,
} from "@/components/ui/toast";

export default function AddBook() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            title: "",
            author: "",
            isbn: "",
            publisher: "",
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
            const response = await fetch(`http://localhost:8081/api/books/addBook?title=${data.title}&author=${data.author}&isbn=${data.isbn}&publisher=${data.publisher}`, {
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
                showToast("success", responseData.message || "Book added successfully!");
            } else if (response.status === 409) {
                showToast("error", responseData.message || "Book with this ISBN already exists.");
            } else {
                showToast("error", responseData.message || "Something went wrong.");
            }
        } catch (error) {
            showToast("error", "An error occurred while adding the book.");
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
                            <h1 className="text-3xl font-bold text-white mb-2">Add New Book</h1>
                            <p className="text-gray-400">Fill out the form to add a new book to the library.</p>
                        </header>

                        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                            <CardHeader className="p-6">
                                <h2 className="text-2xl font-bold text-white">Book Information</h2>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    {/* Book Title */}
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-white">Title</Label>
                                        <Input
                                            id="title"
                                            {...register("title", { required: "Title is required" })}
                                            className="bg-gray-700 text-white border-gray-600"
                                        />
                                        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                                    </div>

                                    {/* Author */}
                                    <div className="space-y-2">
                                        <Label htmlFor="author" className="text-white">Author</Label>
                                        <Input
                                            id="author"
                                            {...register("author", { required: "Author is required" })}
                                            className="bg-gray-700 text-white border-gray-600"
                                        />
                                        {errors.author && <p className="text-sm text-red-500">{errors.author.message}</p>}
                                    </div>

                                    {/* ISBN */}
                                    <div className="space-y-2">
                                        <Label htmlFor="isbn" className="text-white">ISBN</Label>
                                        <Input
                                            id="isbn"
                                            {...register("isbn", {
                                                required: "ISBN is required",
                                                minLength: { value: 10, message: "ISBN must be at least 10 characters" },
                                                maxLength: { value: 13, message: "ISBN must not exceed 13 characters" },
                                            })}
                                            className="bg-gray-700 text-white border-gray-600"
                                        />
                                        {errors.isbn && <p className="text-sm text-red-500">{errors.isbn.message}</p>}
                                    </div>

                                    {/* Publisher */}
                                    <div className="space-y-2">
                                        <Label htmlFor="publisher" className="text-white">Publisher</Label>
                                        <Input
                                            id="publisher"
                                            {...register("publisher", { required: "Publisher is required" })}
                                            className="bg-gray-700 text-white border-gray-600"
                                        />
                                        {errors.publisher && <p className="text-sm text-red-500">{errors.publisher.message}</p>}
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 transition-colors duration-200"
                                    >
                                        <span className="flex items-center justify-center">
                                            <PlusCircle className="mr-2 h-5 w-5" />
                                            Add Book
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
