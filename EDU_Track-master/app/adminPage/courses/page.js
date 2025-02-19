'use client';

import { useState } from 'react';
import { Book, Tag, Calendar, Award, Home, Layers } from "lucide-react";
import AdminSidebar from "@/components/admin/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminAddCourse() {
    const [formData, setFormData] = useState({
        courseName: '',
        courseCode: '',
        description: '',
        creditHours: '',
        eligibleSemester: '',
        isBacklogEligible: false,  // Default to false
        maxCapacity: '',
        fieldOfStudy: '',
        semester: '',
    });
    const [successMessage, setSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name) => (value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Retrieve and parse the userData object from session storage
            const userData = sessionStorage.getItem('userData');

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

            // Ensure the value is treated as a boolean for the request body
            const requestData = {
                ...formData,
                isBacklogEligible: Boolean(formData.isBacklogEligible),  // Make sure it's a boolean
            };

            const response = await fetch("http://localhost:8081/api/courses/create", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const successData = await response.json();
                setSuccessMessage(successData.message || "Course added successfully!");
                setErrorMessage(null); // Clear any previous error message
                setFormData({
                    courseName: '',
                    courseCode: '',
                    description: '',
                    creditHours: '',
                    eligibleSemester: '',
                    isBacklogEligible: false,
                    maxCapacity: '',
                    fieldOfStudy: '',
                    semester: '',
                });
                setTimeout(() => setSuccessMessage(false), 3000);
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Failed to add course");
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
            console.error("Error:", error);
        }
    };

    // Modified to exclude isBacklogEligible from the validation
    const isFormValid = Object.entries(formData).every(([key, value]) =>
        key === 'isBacklogEligible' || (value !== '' && value !== false)
    );

    const formFields = [
        { id: "courseName", label: "Course Name", icon: Book },
        { id: "courseCode", label: "Course Code", icon: Tag },
        { id: "description", label: "Description", icon: Home },
        { id: "creditHours", label: "Credit Hours", type: "number", icon: Award },
        { id: "eligibleSemester", label: "Eligible Semester", type: "number", icon: Calendar },
        { id: "maxCapacity", label: "Max Capacity", type: "number", icon: Layers },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="grid grid-cols-[auto_1fr]">
                <AdminSidebar />
                <main className="p-8">
                    <div className="max-w-2xl mx-auto">
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Add New Course</h1>
                            <p className="text-gray-400">Fill in the details to register a new course.</p>
                        </header>

                        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {formFields.map(({ id, label, type = "text", placeholder, icon: Icon }) => (
                                        <div key={id} className="space-y-2">
                                            <Label htmlFor={id} className="text-gray-200 flex items-center gap-2">
                                                <Icon className="h-4 w-4 text-gray-400" />
                                                {label}
                                            </Label>
                                            <Input
                                                id={id}
                                                name={id}
                                                type={type}
                                                value={formData[id]}
                                                onChange={handleInputChange}
                                                required
                                                placeholder={placeholder}
                                                className="bg-gray-700/50 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    ))}

                                    <div className="space-y-2">
                                        <Label htmlFor="fieldOfStudy" className="text-gray-200 flex items-center gap-2">
                                            <Book className="h-4 w-4 text-gray-400" />
                                            Field of Study
                                        </Label>
                                        <Select
                                            onValueChange={handleSelectChange('fieldOfStudy')}
                                            value={formData.fieldOfStudy}
                                        >
                                            <SelectTrigger className="bg-gray-700/50 text-gray-100 border-gray-600">
                                                <SelectValue placeholder="Select a field of study" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-800 border-gray-700">
                                                {["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Physics", "Mathematics"].map((field) => (
                                                    <SelectItem
                                                        key={field.toLowerCase().replace(' ', '_')}
                                                        value={field.toLowerCase().replace(' ', '_')}
                                                        className="text-gray-200 focus:bg-gray-700"
                                                    >
                                                        {field}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="semester" className="text-gray-200 flex items-center gap-2">
                                            <Book className="h-4 w-4 text-gray-400" />
                                            Semester
                                        </Label>
                                        <Input
                                            id="semester"
                                            name="semester"
                                            type="number"
                                            value={formData.semester}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Enter the semester"
                                            className="bg-gray-700/50 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="isBacklogEligible"
                                            name="isBacklogEligible"
                                            checked={formData.isBacklogEligible}
                                            onChange={handleCheckboxChange}
                                            className="text-gray-400"
                                        />
                                        <Label htmlFor="isBacklogEligible" className="text-gray-200">
                                            Backlog Eligible
                                        </Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        className={`w-full h-12 text-lg font-medium transition-all duration-200 ${isFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 cursor-not-allowed'}`}
                                        disabled={!isFormValid}
                                    >
                                        {isFormValid ? 'Add Course' : 'Please Fill All Required Fields'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>

            {/* Success and Error Messages */}
            {successMessage && (
                <div className="fixed bottom-5 right-5 bg-green-600 text-white p-3 rounded-md shadow-md transition-opacity duration-300">
                    Course added successfully!
                </div>
            )}
            {errorMessage && (
                <div className="fixed bottom-5 right-5 bg-red-600 text-white p-3 rounded-md shadow-md transition-opacity duration-300">
                    {errorMessage}
                </div>
            )}
        </div>
    );
}
