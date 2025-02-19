// 'use client';
// import { useState } from 'react';
// import { Trash2 } from 'lucide-react';
// import LibrarianSidebar from '@/components/librarian/sidebar';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import {
//     ToastProvider,
//     ToastViewport,
//     Toast,
//     ToastTitle,
//     ToastDescription,
//     ToastClose,
// } from "@/components/ui/toast";
//
// const BookDeleteFormComponent = () => {
//     const [isbn, setIsbn] = useState('');
//     const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//     const [toastMessage, setToastMessage] = useState('');
//     const [toastType, setToastType] = useState("success");
//
//     const showToast = (type, message) => {
//         setToastType(type);
//         setToastMessage(message);
//         setTimeout(() => setToastMessage(null), 3000); // Hide toast after 3 seconds
//     };
//
//     const handleDelete = async () => {
//         if (!isbn) return;
//
//         try {
//             const url = `http://localhost:8081/api/books/removeBook?isbn=${isbn}`;
//             const userData = sessionStorage.getItem('userData');
//
//             if (!userData) {
//                 showToast("error", "No userData found in session storage");
//                 return;
//             }
//
//             const parsedData = JSON.parse(userData);
//             const token = parsedData.accessToken;
//
//             if (!token) {
//                 showToast("error", "Authorization token missing.");
//                 return;
//             }
//
//             // Make the API call to delete the book
//             const response = await fetch(url, {
//                 method: 'DELETE',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 },
//             });
//
//             const result = await response.text(); // Read the response message from the backend
//
//             if (result === 'Book Not Found') {
//                 showToast("error", "Book Not Found");
//             } else if (result === 'Book Deleted Successfully') {
//                 showToast("success", "Book Deleted Successfully");
//                 setIsDeleteDialogOpen(false);
//                 setIsbn('');
//             } else {
//                 throw new Error(result || 'Failed to delete the book. Please check the ISBN or try again.');
//             }
//         } catch (error) {
//             showToast("error", error.message || 'An error occurred while deleting the book. Please try again.');
//         }
//     };
//
//     return (
//         <ToastProvider swipeDirection="right">
//             <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
//                 <div className="grid grid-cols-[auto_1fr]">
//                     <LibrarianSidebar />
//                     <main className="p-8">
//                         <div className="max-w-2xl mx-auto">
//                             <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
//                                 <CardHeader>
//                                     <CardTitle className="text-white">Delete Book</CardTitle>
//                                     <CardDescription className="text-gray-400">Enter the ISBN of the book to remove it from the library collection</CardDescription>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <div className="grid w-full items-center gap-4">
//                                         <div className="flex flex-col space-y-1.5">
//                                             <Label htmlFor="isbnInput">ISBN Number</Label>
//                                             <Input
//                                                 id="isbnInput"
//                                                 placeholder="Enter ISBN"
//                                                 value={isbn}
//                                                 onChange={(e) => setIsbn(e.target.value)}
//                                                 className="bg-gray-700 text-white border-gray-600"
//                                             />
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                                 <CardFooter className="flex justify-between">
//                                     <Button variant="outline" onClick={() => setIsbn('')}>
//                                         Clear
//                                     </Button>
//                                     <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//                                         <DialogTrigger asChild>
//                                             <Button
//                                                 variant="destructive"
//                                                 disabled={!isbn}
//                                                 onClick={() => setIsDeleteDialogOpen(true)}
//                                             >
//                                                 <Trash2 className="mr-2 h-4 w-4" />
//                                                 Delete Book
//                                             </Button>
//                                         </DialogTrigger>
//                                         <DialogContent>
//                                             <DialogHeader>
//                                                 <DialogTitle>Are you sure you want to delete this book?</DialogTitle>
//                                                 <DialogDescription>
//                                                     This action cannot be undone. This will permanently delete the book with ISBN {isbn} from the library collection.
//                                                 </DialogDescription>
//                                             </DialogHeader>
//                                             <DialogFooter>
//                                                 <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(false)}>
//                                                     Cancel
//                                                 </Button>
//                                                 <Button variant="outline" onClick={handleDelete}>
//                                                     Confirm
//                                                 </Button>
//                                             </DialogFooter>
//                                         </DialogContent>
//                                     </Dialog>
//                                 </CardFooter>
//                             </Card>
//                         </div>
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
// };
//
// export default BookDeleteFormComponent;


'use client';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import LibrarianSidebar from '@/components/librarian/sidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    ToastProvider,
    ToastViewport,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose,
} from "@/components/ui/toast";

const BookDeleteFormComponent = () => {
    const [isbn, setIsbn] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState("success");

    const showToast = (type, message) => {
        setToastType(type);
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000); // Hide toast after 3 seconds
    };

    const handleDelete = async () => {
        if (!isbn) return;

        try {
            const url = `http://localhost:8081/api/books/removeBook?isbn=${isbn}`;
            const userData = sessionStorage.getItem('userData');

            if (!userData) {
                showToast("error", "No user data found in session storage");
                return;
            }

            const parsedData = JSON.parse(userData);
            const token = parsedData.accessToken;

            if (!token) {
                showToast("error", "Authorization token missing.");
                return;
            }

            // Make the API call to delete the book
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            const result = await response.text(); // Read the response message from the backend

            if (result === 'Book Not Found') {
                showToast("error", "Book Not Found");
            } else if (result === 'Book Deleted Successfully') {
                showToast("success", "Book Deleted Successfully");
                setIsDeleteDialogOpen(false);
                setIsbn('');
            } else {
                throw new Error(result || 'Failed to delete the book. Please check the ISBN or try again.');
            }
        } catch (error) {
            showToast("error", error.message || 'An error occurred while deleting the book. Please try again.');
        }
    };

    return (
        <ToastProvider>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
                <div className="grid grid-cols-[auto_1fr]">
                    <LibrarianSidebar />
                    <main className="overflow-auto p-6">
                        <div className="max-w-2xl mx-auto">
                            <Card className="bg-gray-800 border-gray-700 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-3xl font-bold text-white flex items-center gap-2">
                                        <Trash2 className="w-8 h-8 text-red-500" />
                                        Delete Book
                                    </CardTitle>
                                    <CardDescription className="text-gray-400">
                                        Enter the ISBN of the book to remove it from the library collection.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="isbnInput" className="text-white block mb-2">
                                                ISBN Number
                                            </Label>
                                            <Input
                                                id="isbnInput"
                                                placeholder="Enter ISBN"
                                                value={isbn}
                                                onChange={(e) => setIsbn(e.target.value)}
                                                className="bg-gray-700 text-white border-gray-600 w-full"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsbn('')}
                                        className="text-white border-gray-600 hover:bg-gray-700"
                                    >
                                        Clear
                                    </Button>
                                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                disabled={!isbn}
                                                onClick={() => setIsDeleteDialogOpen(true)}
                                                className="bg-red-600 hover:bg-red-700 text-white"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete Book
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle className="text-white">Confirm Delete</DialogTitle>
                                                <DialogDescription className="text-gray-400">
                                                    This action cannot be undone. This will permanently delete the book with ISBN {isbn} from the library collection.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setIsDeleteDialogOpen(false)}
                                                    className="text-white border-gray-600 hover:bg-gray-700"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={handleDelete}
                                                    className="bg-red-600 hover:bg-red-700 text-white"
                                                >
                                                    Confirm
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </CardFooter>
                            </Card>
                        </div>
                    </main>
                </div>

                {/* Toast Display */}
                {toastMessage && (
                    <Toast className={toastType === "error" ? "bg-red-600" : "bg-green-600"}>
                        <ToastTitle>{toastType === "error" ? "Error" : "Success"}</ToastTitle>
                        <ToastDescription>{toastMessage}</ToastDescription>
                        <ToastClose />
                    </Toast>
                )}
                <ToastViewport />
            </div>
        </ToastProvider>
    );
};

export default BookDeleteFormComponent;
