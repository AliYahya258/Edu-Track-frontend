"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../sidebarProvider";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconClock,
    IconCalendarDue,
    IconCoin,
    IconUserCircle,
    IconUserPlus,
    IconChevronDown,
    IconChevronUp,
    IconLibraryPlus,
    IconCalendar,
    IconAward
} from "@tabler/icons-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { useRouter } from "next/navigation";
import { removeData } from "@/utils/auth";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function AdminSidebar() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState({ teacher: false, student: false, classSchedule: false });

    const handleNavigation = (path) => {
        router.push(path);
    };

    const handleLogout = () => {
        removeData();
        router.push("/auth/login");
    };

    const actions = {
        teacher: [
            { label: "Add Teacher", path: "/adminPage/teacher/addTeacher" },
            { label: "Update Profile", path: "/adminPage/teacher/updateProfile" },
            { label: "Assign Course", path: "/adminPage/teacher/assignCourse" },
            { label: "Get All Teachers", path: "/adminPage/teacher/allTeachers" },
            { label: "Get Teacher Info", path: "/adminPage/teacher/info" },
            { label: "Get Assigned Courses", path: "/adminPage/teacher/assignedCourses" },
            { label: "Get Performance", path: "/adminPage/teacher/performance" },
            { label: "Remove Assigned Course", path: "/adminPage/teacher/removeCourse" },
            { label: "Delete Teacher", path: "/adminPage/teacher/delete" },
        ],
        student: [
            { label: "Approve Student", path: "/adminPage/student/approveStudent" },
            { label: "Student Attendance", path: "/adminPage/student/attendance" },
            { label: "Get Attendance By Section", path: "/adminPage/student/sectionAttendance" },
        ],
        classSchedule: [
            { label: "Create Schedule", path: "/adminPage/classSchedule/create" },
            { label: "Get By CourseID", path: "/adminPage/classSchedule/courseId" },
            { label: "Delete Schedule", path: "/adminPage/classSchedule/delete" },
        ],
        exam: [
            { label: "Exam Schedule", path: "/adminPage/exam/examSchedule" },
            { label: "Exam Result", path: "/adminPage/exam/examResult" },
        ],
        fee: [
            { label: "Create Fee", path: "/adminPage/fee/create" },
            { label: "Fee Approval", path: "/adminPage/fee/approve" },
        ],
    };

    const links = [
        {
            label: "Dashboard",
            href: "/adminPage/dashboard",
            icon: <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Add Librarian",
            href: "/adminPage/librarian",
            icon: <IconUserPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Add Course",
            href: "/adminPage/courses",
            icon: <IconLibraryPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Student Management",
            icon: <IconUserCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
            dropdownKey: "student",
        },
        {
            label: "Teacher Management",
            icon: <IconUserPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
            dropdownKey: "teacher",
        },
        {
            label: "Class Schedule",
            icon: <IconCalendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
            dropdownKey: "classSchedule",
        },
        {
            label: "Exam",
            icon: <IconCalendarDue className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
            dropdownKey: "exam",
        },
        {
            label: "Fees",
            icon: <IconCoin className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
            dropdownKey: "fee",
        },
        {
            label: "Time Table",
            href: "/adminPage/timetable",
            icon: <IconClock className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Scholarship",
            href: "/adminPage/scholarship",
            icon: <IconAward className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Logout",
            href: "#",
            icon: <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
            onClick: handleLogout,
        },
    ];

    return (
        <div
            className={cn(
                "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
                "h-screen"
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) =>
                                link.dropdownKey ? (
                                    <Collapsible
                                        key={idx}
                                        open={dropdownOpen[link.dropdownKey]}
                                        onOpenChange={(isOpen) =>
                                            setDropdownOpen((prev) => ({
                                                ...prev,
                                                [link.dropdownKey]: isOpen,
                                            }))
                                        }
                                    >
                                        <CollapsibleTrigger className="w-full flex items-center gap-2 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-blue-900 hover:text-white rounded-md transition-colors">
                                            {link.icon}
                                            <span>{link.label}</span>
                                            {dropdownOpen[link.dropdownKey] ? (
                                                <IconChevronUp className="ml-auto" />
                                            ) : (
                                                <IconChevronDown className="ml-auto" />
                                            )}
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="bg-black-900 rounded-md mt-1">
                                            <AnimatePresence>
                                                {dropdownOpen[link.dropdownKey] && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        {actions[link.dropdownKey].map((action, actionIdx) => (
                                                            <motion.button
                                                                key={actionIdx}
                                                                onClick={() => handleNavigation(action.path)}
                                                                className="w-full text-left px-10 py-2 text-sm text-white hover:bg-blue-800 transition-colors"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                {action.label}
                                                            </motion.button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </CollapsibleContent>
                                    </Collapsible>
                                ) : (
                                    <SidebarLink key={idx} link={link} />
                                )
                            )}
                        </div>
                    </div>
                </SidebarBody>
            </Sidebar>
        </div>
    );
}

const Logo = () => (
    <Link href="#" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
        <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium text-black dark:text-white whitespace-pre">
            Edu Track
        </motion.span>
    </Link>
);

const LogoIcon = () => (
    <Link href="#" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
        <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
);
