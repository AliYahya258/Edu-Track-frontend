'use client';

import { useState } from 'react';
import { UserPlus, Mail, Key, Tag, Clock, Calendar, GraduationCap, Building2, BookOpen } from "lucide-react";
import AdminSidebar from "@/components/admin/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function AdminAddTeacher() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        teacherId: '',
        department: '',
        officeHours: '',
        dateOfHire: '',
        qualification: '',
        specialization: '',
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

            const response = await fetch("http://localhost:8081/api/auth/register/teacher", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const successData = await response.json();
                setSuccessMessage(successData.message || "Teacher account created successfully!");
                setErrorMessage(null); // Clear any previous error message
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    teacherId: '',
                    department: '',
                    officeHours: '',
                    dateOfHire: '',
                    qualification: '',
                    specialization: '',
                });
                setTimeout(() => setSuccessMessage(false), 3000);
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Failed to create teacher account");
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
            console.error("Error:", error);
        }
    };


    const isFormValid = Object.values(formData).every((field) => field !== '');

    const formFields = [
        { id: "username", label: "Username", icon: UserPlus },
        { id: "email", label: "Email", type: "email", icon: Mail },
        { id: "password", label: "Password", type: "password", icon: Key },
        { id: "teacherId", label: "Teacher ID", icon: Tag },
        { id: "officeHours", label: "Office Hours", placeholder: "e.g., Mon-Wed 10:00 AM - 12:00 PM", icon: Clock },
        { id: "dateOfHire", label: "Date of Hire", type: "date", icon: Calendar },
        { id: "qualification", label: "Qualification", placeholder: "e.g., Ph.D. in Computer Science", icon: GraduationCap },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="grid grid-cols-[auto_1fr]">
                <AdminSidebar />
                <main className="p-8">
                    <div className="max-w-2xl mx-auto">
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Add New Teacher</h1>
                            <p className="text-gray-400">Fill in the details to register a new faculty member.</p>
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
                                        <Label htmlFor="department" className="text-gray-200 flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-gray-400" />
                                            Department
                                        </Label>
                                        <Select
                                            onValueChange={handleSelectChange('department')}
                                            value={formData.department}
                                        >
                                            <SelectTrigger className="bg-gray-700/50 text-gray-100 border-gray-600">
                                                <SelectValue placeholder="Select a department" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-800 border-gray-700">
                                                {[
                                                    "Computer Science",
                                                    "Electrical Engineering",
                                                    "Mechanical Engineering",
                                                    "Physics",
                                                    "Mathematics"
                                                ].map((dept) => (
                                                    <SelectItem
                                                        key={dept.toLowerCase().replace(' ', '_')}
                                                        value={dept.toLowerCase().replace(' ', '_')}
                                                        className="text-gray-200 focus:bg-gray-700"
                                                    >
                                                        {dept}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="specialization" className="text-gray-200 flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-gray-400" />
                                            Specialization
                                        </Label>
                                        <Textarea
                                            id="specialization"
                                            name="specialization"
                                            value={formData.specialization}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Machine Learning, Artificial Intelligence"
                                            className="bg-gray-700/50 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className={`w-full h-12 text-lg font-medium transition-all duration-200 ${
                                            isFormValid
                                                ? 'bg-blue-600 hover:bg-blue-700'
                                                : 'bg-gray-600 cursor-not-allowed'
                                        }`}
                                        disabled={!isFormValid}
                                    >
                                        {isFormValid ? 'Add Teacher' : 'Please Fill All Fields'}
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
                    Teacher account created successfully!
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
