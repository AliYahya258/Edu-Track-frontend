"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../sidebarProvider";

import {
  IconArrowLeft,
  IconCheckupList,
  IconReportAnalytics,
  IconBrandTabler,
  IconClock,
  IconCalendar,
  IconClipboardList,
  IconBook,
  IconCertificate,
  IconBooks,
  IconCoin
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies
import { useRouter } from 'next/navigation';
import {removeData} from "@/utils/auth"; // Import useRouter

export default function StudentSidebar() {


  const router = useRouter(); // Initialize useRouter

  const handleDashboard = () => {
    router.push('/studentPage/dashboard');
  };

  const handleAttendance = () => {
    router.push("/studentPage/attendance");
  };

  const handleMarks = () => {
    router.push("/studentPage/marks");
  };

  const handleTimetable = () => {
    router.push("/studentPage/timetable");
  };

  const handleExamschedule = () => {
    router.push("/studentPage/examSchedule");
  };

  const handleAssignment = () => {
    router.push("/studentPage/assignment");
  };

  const handleTranscript = () => {
    router.push("/studentPage/transcript");
  };

  const handleBooks = () => {
    router.push("/studentPage/books");
  };

  const handleFees = () => {
    router.push("/studentPage/fees");
  };

  const handleLogout = () => {
    removeData();
    router.push('/auth/login');
  };

  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
          <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: handleDashboard,
    },
    {
      label: "Attendance",
      href: "#",
      icon: (
          <IconCheckupList className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: handleAttendance,
    },
    {
      label: "Marks",
      href: "#",
      icon: (
          <IconReportAnalytics className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: handleMarks,
    },
    {
      label: "Time Table",
      href: "#",
      icon: (
          <IconClock className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: handleTimetable,
    },
    {
      label: "Exam Schedule",
      href: "#",
      icon: (
          <IconCalendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: handleExamschedule,
    },
    {
      label: "Assignment",
      href: "#",
      icon: (
          <IconClipboardList className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: handleAssignment,
    },
    {
      label: "Transcript",
      href: "#",
      icon: (
          <IconCertificate className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: handleTranscript,
    },
    {
      label: "Books",
      href: "#",
      icon: (
          <IconBooks className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: handleBooks,
    },
    {
      label: "Fees",
      href: "#",
      icon: (
          <IconCoin className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: handleFees,
    },
    {
      label: "Logout",
      href: "#",
      icon: (
          <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: handleLogout,
    },
  ];

  const [open, setOpen] = useState(false);

  return (
      (<div
          className={cn(
              "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
              "h-screen"
          )}>
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                    <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
          </SidebarBody>
        </Sidebar>
      </div>)
  );
}
export const Logo = () => {
  return (
      (<Link
          href="#"
          className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
        <div
            className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-medium text-black dark:text-white whitespace-pre">
          Edu Track
        </motion.span>
      </Link>)
  );
};
export const LogoIcon = () => {
  return (
      (<Link
          href="#"
          className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
        <div
            className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      </Link>)
  );
};