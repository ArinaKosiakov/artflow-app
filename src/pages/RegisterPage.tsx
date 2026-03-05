import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Palette,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import Spinner from "../components/CustomSpinner";

interface RegisterPageProps {
  darkMode: boolean;
  onRegister: (name: string, email: string, password: string) => void;
  onSwitchToLogin: () => void;
  serverError?: string | null;
  onClearError?: () => void;
}

export default function RegisterPage({
  darkMode,
  onRegister,
  onSwitchToLogin,
  serverError,
  onClearError,
}: RegisterPageProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = t("auth.errors.nameRequired");
    } else if (name.trim().length < 3) {
      newErrors.name = t("auth.errors.nameTooShort");
    }

    if (!email.trim()) {
      newErrors.email = t("auth.errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t("auth.errors.invalidEmail");
    }

    if (!password) {
      newErrors.password = t("auth.errors.passwordRequired");
    } else if (password.length < 8) {
      newErrors.password = t("auth.errors.passwordTooShort");
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t("auth.errors.passwordRequired");
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t("auth.errors.passwordMismatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onRegister(name, email, password);
    } catch (error) {
      // Error handling will be done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 to-gray-100"} transition-colors`}
    >
      <div className="w-full max-w-md px-6">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
            <Palette className="w-8 h-8 text-white" />
          </div>
          <h1
            className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"} mb-2`}
          >
            {t("auth.register.title")}
          </h1>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {t("auth.register.subtitle")}
          </p>
        </div>

        {/* Register Form */}
        <div
          className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl shadow-lg border p-8`}
        >
          {serverError && (
            <div
              className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
              role="alert"
            >
              {serverError}
              {onClearError && (
                <button
                  type="button"
                  onClick={onClearError}
                  className="ml-2 underline focus:outline-none"
                  aria-label="Dismiss"
                >
                  ✕
                </button>
              )}
            </div>
          )}
          {isSubmitting && <Spinner />}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {t("auth.register.name")}
              </label>
              <div className="relative">
                <User
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  placeholder={t("auth.register.namePlaceholder")}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    errors.name
                      ? "border-red-500"
                      : darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {t("auth.register.email")}
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors({ ...errors, email: undefined });
                  }}
                  placeholder={t("auth.register.emailPlaceholder")}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    errors.email
                      ? "border-red-500"
                      : darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {t("auth.register.password")}
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors({ ...errors, password: undefined });
                    if (
                      errors.confirmPassword &&
                      e.target.value !== confirmPassword
                    ) {
                      setErrors({
                        ...errors,
                        confirmPassword: t("auth.errors.passwordMismatch"),
                      });
                    } else if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: undefined });
                    }
                  }}
                  placeholder={t("auth.register.passwordPlaceholder")}
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
                    errors.password
                      ? "border-red-500"
                      : darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded ${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {t("auth.register.confirmPassword")}
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      if (e.target.value !== password) {
                        setErrors({
                          ...errors,
                          confirmPassword: t("auth.errors.passwordMismatch"),
                        });
                      } else {
                        setErrors({ ...errors, confirmPassword: undefined });
                      }
                    }
                  }}
                  placeholder={t("auth.register.confirmPasswordPlaceholder")}
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded ${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span>Loading...</span>
              ) : (
                <>
                  {t("auth.register.submit")}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              {t("auth.register.hasAccount")}{" "}
              <button
                onClick={onSwitchToLogin}
                className="text-purple-500 hover:text-purple-600 font-medium transition-colors"
              >
                {t("auth.register.loginLink")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

