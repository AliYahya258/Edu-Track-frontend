'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from "@/components/admin/sidebar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminTeacherList() {
    const [teachers, setTeachers] = useState([])
    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)
    const [selectedTeacher, setSelectedTeacher] = useState(null)
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const [updatedTeacher, setUpdatedTeacher] = useState({
        username: "",
        email: "",
        officeHours: "",
        qualification: "",
    })

    useEffect(() => {
        fetchTeachers()
    }, [])

    const fetchTeachers = async () => {
        try {
            const userData = sessionStorage.getItem('userData');

            if (!userData) {
                setErrorMessage("No userData found in session storage");
                return;
            }

            const parsedData = JSON.parse(userData);
            const token = parsedData.accessToken;

            if (!token) {
                setErrorMessage("No token found in userData");
                return;
            }

            const response = await fetch("http://localhost:8081/api/teachers/getinfoofall", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const teacherList = data.map((item) => item.teacherInfo); // Extract teacherInfo from the response
                setTeachers(teacherList);
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Failed to fetch teachers");
            }
        } catch (error) {
            setErrorMessage("An error occurred while fetching teachers.");
            console.error("Error:", error);
        }
    };

    const handleUpdateTeacher = async () => {
        try {
            const userData = sessionStorage.getItem('userData')

            if (!userData) {
                setErrorMessage("No userData found in session storage")
                return
            }

            const parsedData = JSON.parse(userData)
            const token = parsedData.accessToken

            if (!token) {
                setErrorMessage("No token found in userData")
                return
            }

            const response = await fetch(`http://localhost:8081/api/teachers/update/${selectedTeacher.id}?officeHours=${updatedTeacher.officeHours}&qualification=${updatedTeacher.qualification}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })

            if (response.ok) {
                setSuccessMessage("Teacher profile updated successfully.")
                setSelectedTeacher(null)
                setIsUpdateDialogOpen(false)
                fetchTeachers()
            } else {
                const errorData = await response.json()
                setErrorMessage(errorData.message || "Failed to update teacher profile.")
            }
        } catch (error) {
            setErrorMessage("An error occurred while updating the teacher profile.")
            console.error("Error:", error)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setUpdatedTeacher(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="min-h-screen bg-[#1a1f2e]">
            <div className="grid grid-cols-[auto_1fr]">
                <AdminSidebar />
                <main className="p-8">
                    <div className="max-w-[1400px] mx-auto">
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Update Teacher Profile</h1>
                            <p className="text-gray-400">Below is the list of all registered teachers.</p>
                        </header>

                        {errorMessage && (
                            <div className="bg-red-600/10 border border-red-600/20 text-red-500 p-3 rounded-md mb-4">
                                {errorMessage}
                            </div>
                        )}

                        {successMessage && (
                            <div className="bg-green-600/10 border border-green-600/20 text-green-500 p-3 rounded-md mb-4">
                                {successMessage}
                            </div>
                        )}

                        <div className="bg-[#1c2237] rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                    <tr className="border-b border-gray-700/50">
                                        <th className="py-4 px-4 text-sm font-semibold text-gray-300">Username</th>
                                        <th className="py-4 px-4 text-sm font-semibold text-gray-300">Email</th>
                                        <th className="py-4 px-4 text-sm font-semibold text-gray-300">Office Hours</th>
                                        <th className="py-4 px-4 text-sm font-semibold text-gray-300">Qualification</th>
                                        <th className="py-4 px-4 text-sm font-semibold text-gray-300">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody className="text-gray-300">
                                    {teachers.length > 0 ? (
                                        teachers.map((teacher) => (
                                            <tr
                                                key={teacher.id}
                                                className="border-b border-gray-700/50 hover:bg-gray-700/10 transition-colors"
                                            >
                                                <td className="py-4 px-6 text-sm">{teacher.username}</td>
                                                <td className="py-4 px-6 text-sm">{teacher.email}</td>
                                                <td className="py-4 px-6 text-sm">{teacher.officeHours}</td>
                                                <td className="py-4 px-6 text-sm">{teacher.qualification}</td>
                                                <td className="py-4 px-6 text-sm">
                                                    <Button
                                                        onClick={() => {
                                                            setSelectedTeacher(teacher)
                                                            setUpdatedTeacher({
                                                                username: teacher.username,
                                                                email: teacher.email,
                                                                officeHours: teacher.officeHours,
                                                                qualification: teacher.qualification,
                                                            })
                                                            setIsUpdateDialogOpen(true)
                                                        }}
                                                        className="bg-blue-600 text-white px-4 py-2 rounded-md"
                                                        variant="secondary"
                                                    >
                                                        Update
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="text-center py-8 text-gray-400"
                                            >
                                                No teachers found.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Update Teacher Profile</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    {Object.entries(updatedTeacher).map(([key, value]) => (
                                        <div key={key} className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor={key} className="text-right capitalize">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                            </Label>
                                            <Input
                                                id={key}
                                                name={key}
                                                value={value}
                                                onChange={handleInputChange}
                                                className="col-span-3"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <DialogFooter>
                                    <Button type="submit" onClick={handleUpdateTeacher}>
                                        Update Teacher
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </main>
            </div>
        </div>
    )
}
