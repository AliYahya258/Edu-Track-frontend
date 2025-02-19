"use client";
import React, { useState } from "react";
import { Label } from "./label";
import { Input } from "./input";
import { cn } from "@/utils/cn";
import Link from "next/link";
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    studentId: "",
    dob: "",
    academicYear: "",
    semester: "",
    parentUsername: "",
    parentEmail: "",
    parentContactNumber: "",
    parentAddress: "",
    parentOccupation: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Success message state

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        academicYear: parseInt(formData.academicYear),
        semester: parseInt(formData.semester)
      };

      const response = await axios.post('http://localhost:8081/api/auth/register/student', payload);
      console.log('Registration successful:', response.data);

      setSuccess(response.data.message); // Display success message
      setError(""); // Clear error if any

      // Redirect to login after a brief delay
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000); // 3 seconds delay
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      setError(error.response?.data?.message || "Registration failed. Please try again.");
      setSuccess(""); // Clear success message if there's an error
    }
  };

  return (
      <div
          className="min-h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat py-10"
          style={{
            backgroundImage: "url('/images/bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#000',
          }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <div className="relative z-10 max-w-2xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white/10 backdrop-blur-md dark:bg-black/20">
          <h2 className="font-bold text-3xl text-white mb-2">
            Welcome to EDU Track
          </h2>
          <p className="text-gray-200 mb-6">
            Create your Student Account
          </p>

          <form className="my-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Student Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Student Information</h3>

                <LabelInputContainer>
                  <Label htmlFor="username" className="text-white">Username</Label>
                  <Input
                      id="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Username"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="student@email.com"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="********"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="studentId" className="text-white">Student ID</Label>
                  <Input
                      id="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      placeholder="Student ID"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="dob" className="text-white">Date of Birth</Label>
                  <Input
                      id="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="academicYear" className="text-white">Academic Year</Label>
                  <Input
                      id="academicYear"
                      type="number"
                      value={formData.academicYear}
                      onChange={handleChange}
                      placeholder="Year"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="semester" className="text-white">Semester</Label>
                  <Input
                      id="semester"
                      type="number"
                      value={formData.semester}
                      onChange={handleChange}
                      placeholder="Semester"
                      min="1"
                      max="8"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                  />
                </LabelInputContainer>
              </div>

              {/* Parent Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Parent Information</h3>

                <LabelInputContainer>
                  <Label htmlFor="parentUsername" className="text-white">Parent Username</Label>
                  <Input
                      id="parentUsername"
                      value={formData.parentUsername}
                      onChange={handleChange}
                      placeholder="Parent Username"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="parentEmail" className="text-white">Parent Email</Label>
                  <Input
                      id="parentEmail"
                      type="email"
                      value={formData.parentEmail}
                      onChange={handleChange}
                      placeholder="parent@email.com"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="parentContactNumber" className="text-white">Parent Contact Number</Label>
                  <Input
                      id="parentContactNumber"
                      value={formData.parentContactNumber}
                      onChange={handleChange}
                      placeholder="Phone"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="parentAddress" className="text-white">Parent Address</Label>
                  <Input
                      id="parentAddress"
                      value={formData.parentAddress}
                      onChange={handleChange}
                      placeholder="Address"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="parentOccupation" className="text-white">Parent Occupation</Label>
                  <Input
                      id="parentOccupation"
                      value={formData.parentOccupation}
                      onChange={handleChange}
                      placeholder="Occupation"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                  />
                </LabelInputContainer>
              </div>
            </div>

            {/* Display error or success message */}
            {error && (
                <p className="text-red-400 text-center mt-4">{error}</p>
            )}
            {success && (
                <p className="text-green-400 text-center mt-4">{success}</p>
            )}

            <button
                className="bg-gradient-to-br relative group/btn from-blue-600 to-blue-800 block w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] hover:from-blue-700 hover:to-blue-900 transition-all duration-300"
                type="submit"
            >
              Sign up &rarr;
              <BottomGradient />
            </button>

            <div className="bg-gradient-to-r from-transparent via-white/20 to-transparent my-8 h-[1px] w-full" />

            <div className="text-center">
              <p className="text-gray-200">
                Already have an account?{" "}
                <Link
                    href="/auth/login"
                    className="text-blue-400 hover:text-blue-500 font-medium transition-colors"
                >
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
  );
}

const BottomGradient = () => {
  return (
      <>
        <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
      </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
      <div className={cn("flex flex-col space-y-2 w-full", className)}>
        {children}
      </div>
  );
};
