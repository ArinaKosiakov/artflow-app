import React from "react";

interface CustomSpinnerProps {
  /** Optional className for the wrapper (e.g. min-height, padding, dark bg) */
  className?: string;
  /** When true, uses dark background and light border for spinner */
  darkMode?: boolean;
}

export default function CustomSpinner({ className = "", darkMode = false }: CustomSpinnerProps) {
  return (
    <div
      className={`flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-white"} ${className}`}
    >
      <div
        className={`w-12 h-12 rounded-full border-4 animate-spin ${
          darkMode ? "border-gray-600 border-t-purple-400" : "border-purple-200 border-t-purple-600"
        }`}
      />
    </div>
  );
}