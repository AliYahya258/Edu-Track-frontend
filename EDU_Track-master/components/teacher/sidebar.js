"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../sidebarProvider";
import {
  IconArrowLeft,
  IconCheckupList,
  IconReportAnalytics,
  IconBrandTabler,
  IconClock,
  IconClipboardList,
  IconCalendarDue,
  IconBook,
  IconChevronDown,
  IconChevronUp,
  IconTrendingUp,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { removeData } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function TeacherSidebar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({ resources: false });

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleLogout = () => {
    removeData();
    router.push("/auth/login");
  };

  const actions = {
    attendance: [
      { label: "Mark Attendance", path: "/teacherPage/attendance/mark" },
      { label: "Get Attendance", path: "/teacherPage/attendance/getAttendance" },
    ],
    assignment: [
      { label: "Create Assignment", path: "/teacherPage/assignments/create" },
      { label: "Get Assignment", path: "/teacherPage/assignments/getAssignment" },
      { label: "Grade Assignment", path: "/teacherPage/assignments/grade" },
    ],
    marks: [
      { label: "Input & Update Grade", path: "/teacherPage/marks/input" },
      { label: "Get Grade", path: "/teacherPage/marks/getGrade" },
    ],
  };

  const links = [
    {
      label: "Dashboard",
      href: "/teacherPage/dashboard",
      icon: (<IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />)
    },
    {
      label: "Attendance",
      icon: (<IconCheckupList className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />),
      dropdownKey: 'attendance',
    },
    {
      label: "Marks",
      icon: (<IconReportAnalytics className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />),
      dropdownKey: 'marks',
    },
    {
      label: "Time Table",
      href: "/teacherPage/timetable",
      icon: (<IconClock className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />),
    },
    {
      label: "Exam Schedule",
      href: "/teacherPage/examSchedule",
      icon: (<IconCalendarDue className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />),
    },
    {
      label: "Assignment",
      icon: (<IconClipboardList className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />),
      dropdownKey: 'assignment',
    },
    {
      label: "Books",
      href: "/teacherPage/books",
      icon: (<IconBook className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />),
    },
    {
      label: "Performance",
      href: "/teacherPage/performance",
      icon: (<IconTrendingUp className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />),
    },
    {
      label: "Logout",
      href: "#",
      icon: (<IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />),
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

export const Logo = () => (
    <Link
        href="#"
        className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-medium text-black dark:text-white whitespace-pre"
      >
        Edu Track
      </motion.span>
    </Link>
);

export const LogoIcon = () => (
    <Link
        href="#"
        className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
);
