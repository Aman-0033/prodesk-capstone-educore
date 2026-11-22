import React from "react";
import { GraduationCap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            EduCore
          </span>
        </div>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
          Sprint 14 Walking Skeleton
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        {children}
      </div>
    </div>
  );
}
