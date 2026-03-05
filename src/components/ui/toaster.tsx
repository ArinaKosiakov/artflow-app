"use client";

import { Toaster as SonnerToaster, toast } from "sonner";


export const Toaster = () => (
  <SonnerToaster
    position="bottom-right"
    richColors
    closeButton
    toastOptions={{
      classNames: {
        toast: "rounded-lg border shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100",
        error: "border-red-200 dark:border-red-800",
        success: "border-green-200 dark:border-green-800",
      },
    }}
  />
);

export const toaster = {
  create(opts: {
    description?: string;
    title?: string;
    type?: "error" | "success" | "info" | "loading";
  }) {
    const message = opts.description ?? opts.title ?? "";
    switch (opts.type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "info":
        toast.info(message);
        break;
      case "loading":
        toast.loading(message);
        break;
      default:
        toast(message);
    }
  },
};
