import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, User, Mail, Lock, Trash2 } from "lucide-react";
import {
  AVAILABLE_PROFILE_PICTURES,
  getProfilePictureUrl,
} from "../lib/profilePictures";
import CustomSpinner from "./CustomSpinner";

interface ProfileModalProps {
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  currentName?: string;
  currentEmail?: string;
  /** Profile picture filename (e.g. "1.png") from predefined set */
  currentProfilePicture?: string;
  onUpdateName?: (newName: string) => Promise<void>;
  /** Now receives both the new email and the current password for verification */
  onUpdateEmail?: (newEmail: string, currentPassword: string) => Promise<void>;
  onUpdatePassword?: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  /** Only accepts predefined filenames like "1.png" */
  onUpdateProfilePicture?: (filename: string) => Promise<void>;
  onRemoveProfilePicture?: () => Promise<void>;
}

export default function ProfileModal({
  loading,
  isOpen,
  onClose,
  darkMode,
  currentName = "",
  currentEmail = "",
  currentProfilePicture,
  onUpdateName,
  onUpdateEmail,
  onUpdatePassword,
  onUpdateProfilePicture,
  onRemoveProfilePicture,
}: ProfileModalProps) {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<"picture" | "email" | "password">(
    "picture",
  );
  const [profilePicture, setProfilePicture] = useState<string | null>(
    currentProfilePicture || null,
  );

  // Name state
  const [name, setName] = useState(currentName);
  const [nameErrors, setNameErrors] = useState<{ name?: string }>({});
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  useEffect(() => {
    setName(currentName);
    setIsUpdatingName(!isUpdatingName);
  }, [currentName]);

  // Email state
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailErrors, setEmailErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Picture state
  const [isUpdatingPicture, setIsUpdatingPicture] = useState(false);

  if (!isOpen) return null;

  const validateName = () => {
    const errors: { name?: string } = {};
    if (!name.trim()) errors.name = t("profile.errors.nameRequired");
    setNameErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateName = async () => {
    if (!validateName() || !onUpdateName || isUpdatingName) return;
    setIsUpdatingName(true);
    try {
      await onUpdateName(name.trim());
    } catch (error) {
      console.error("Error updating name:", error);
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleSelectPicture = async (filename: string) => {
    setProfilePicture(filename);
    if (onUpdateProfilePicture) {
      setIsUpdatingPicture(true);
      try {
        await onUpdateProfilePicture(filename);
      } catch (error) {
        console.error("Error updating profile picture:", error);
        setProfilePicture(currentProfilePicture || null);
      } finally {
        setIsUpdatingPicture(false);
      }
    }
  };

  const handleRemovePicture = async () => {
    if (onRemoveProfilePicture) {
      setIsUpdatingPicture(true);
      try {
        await onRemoveProfilePicture();
        setProfilePicture(null);
      } catch (error) {
        console.error("Error removing profile picture:", error);
      } finally {
        setIsUpdatingPicture(false);
      }
    }
  };

  const validateEmail = () => {
    const errors: { email?: string; password?: string } = {};

    if (!newEmail.trim()) {
      errors.email = t("profile.errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      errors.email = t("profile.errors.invalidEmail");
    } else if (newEmail === currentEmail) {
      errors.email = t("profile.errors.sameEmail");
    }

    if (!emailPassword) {
      errors.password = t("profile.errors.currentPasswordRequired");
    }

    setEmailErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateEmail = async () => {
    if (!validateEmail() || !onUpdateEmail || isUpdatingEmail) return;
    setIsUpdatingEmail(true);
    try {
      await onUpdateEmail(newEmail, emailPassword);
      setNewEmail("");
      setEmailPassword("");
      setEmailErrors({});
    } catch (error) {
      console.error("Error updating email:", error);
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const validatePassword = () => {
    const errors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!currentPassword)
      errors.currentPassword = t("profile.errors.currentPasswordRequired");

    if (!newPassword) {
      errors.newPassword = t("profile.errors.newPasswordRequired");
    } else if (newPassword.length < 8) {
      errors.newPassword = t("profile.errors.passwordTooShort");
    }

    if (!confirmPassword) {
      errors.confirmPassword = t("profile.errors.newPasswordRequired");
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = t("profile.errors.passwordMismatch");
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdatePassword = async () => {
    if (!validatePassword() || !onUpdatePassword || isUpdatingPassword) return;
    setIsUpdatingPassword(true);
    try {
      await onUpdatePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordErrors({});
    } catch (error) {
      console.error("Error updating password:", error);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleClose = () => {
    setActiveTab("picture");
    setName(currentName);
    setNewEmail("");
    setEmailPassword("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setNameErrors({});
    setEmailErrors({});
    setPasswordErrors({});
    setProfilePicture(currentProfilePicture || null);
    onClose();
  };

  const inputClass = (hasError: boolean) =>
    `w-full pl-10 pr-4 py-3 rounded-lg border ${
      hasError
        ? "border-red-500"
        : darkMode
          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
    } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {loading && <CustomSpinner darkMode={darkMode} />}
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div
          className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} px-6 py-4 flex justify-between items-center border-b ${darkMode ? "border-gray-600" : "border-gray-200"}`}
        >
          <h2
            className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            {t("profile.title")}
          </h2>
          <button
            onClick={handleClose}
            className={`${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"} transition-colors`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div
          className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} px-6 py-2 flex gap-2 border-b ${darkMode ? "border-gray-600" : "border-gray-200"}`}
        >
          {(["picture", "email", "password"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-purple-500 text-white"
                  : darkMode
                    ? "text-gray-300 hover:bg-gray-600"
                    : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {t(
                `profile.${tab === "picture" ? "profilePicture" : tab === "email" ? "changeEmail" : "changePassword"}`,
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Profile Picture Tab */}
          {activeTab === "picture" && (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    {profilePicture ? (
                      <img
                        src={getProfilePictureUrl(profilePicture) ?? ""}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-white" />
                    )}
                  </div>
                  {isUpdatingPicture && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="text-white text-sm">Loading...</div>
                    </div>
                  )}
                </div>
                <p
                  className={`mt-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {t("profile.choosePicture")}
                </p>
                <div className="grid grid-cols-5 gap-3 w-full max-w-xs">
                  {AVAILABLE_PROFILE_PICTURES.map((filename) => {
                    const url = getProfilePictureUrl(filename);
                    const isSelected = profilePicture === filename;
                    if (!url) return null;
                    return (
                      <button
                        key={filename}
                        type="button"
                        onClick={() => handleSelectPicture(filename)}
                        disabled={isUpdatingPicture}
                        className={`w-12 h-12 rounded-full overflow-hidden border-2 flex-shrink-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          isSelected
                            ? "border-purple-500 ring-2 ring-purple-300"
                            : darkMode
                              ? "border-gray-600 hover:border-gray-500"
                              : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <img
                          src={url}
                          alt={filename}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
                {profilePicture && (
                  <button
                    onClick={handleRemovePicture}
                    disabled={isUpdatingPicture}
                    className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                      darkMode
                        ? "bg-gray-700 text-red-400 hover:bg-gray-600"
                        : "bg-gray-100 text-red-500 hover:bg-gray-200"
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    {t("profile.removePicture")}
                  </button>
                )}
              </div>

              {/* Name Field */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {t("profile.name")}
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
                      if (nameErrors.name) setNameErrors({});
                    }}
                    placeholder={t("profile.namePlaceholder")}
                    className={inputClass(!!nameErrors.name)}
                  />
                </div>
                {nameErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{nameErrors.name}</p>
                )}
              </div>

              {onUpdateName &&
                name.trim() !== currentName &&
                name.trim() !== "" && (
                  <button
                    onClick={handleUpdateName}
                    disabled={isUpdatingName}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdatingName ? "Saving..." : t("profile.save")}
                  </button>
                )}
            </div>
          )}

          {/* Email Tab */}
          {activeTab === "email" && (
            <div className="space-y-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {t("profile.currentEmail")}
                </label>
                <div
                  className={`px-4 py-3 rounded-lg ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}
                >
                  {currentEmail}
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {t("profile.newEmail")}
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                  />
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => {
                      setNewEmail(e.target.value);
                      if (emailErrors.email)
                        setEmailErrors((prev) => ({
                          ...prev,
                          email: undefined,
                        }));
                    }}
                    placeholder={t("profile.emailPlaceholder")}
                    className={inputClass(!!emailErrors.email)}
                  />
                </div>
                {emailErrors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {emailErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {t("profile.currentPassword")}
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                  />
                  <input
                    type="password"
                    value={emailPassword}
                    onChange={(e) => {
                      setEmailPassword(e.target.value);
                      if (emailErrors.password)
                        setEmailErrors((prev) => ({
                          ...prev,
                          password: undefined,
                        }));
                    }}
                    placeholder={t("profile.currentPasswordPlaceholder")}
                    className={inputClass(!!emailErrors.password)}
                  />
                </div>
                {emailErrors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {emailErrors.password}
                  </p>
                )}
              </div>

              <button
                onClick={handleUpdateEmail}
                disabled={isUpdatingEmail || !newEmail.trim() || !emailPassword}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingEmail ? "Updating..." : t("profile.save")}
              </button>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <div className="space-y-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {t("profile.currentPassword")}
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                  />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      if (passwordErrors.currentPassword)
                        setPasswordErrors((prev) => ({
                          ...prev,
                          currentPassword: undefined,
                        }));
                    }}
                    placeholder={t("profile.currentPasswordPlaceholder")}
                    className={inputClass(!!passwordErrors.currentPassword)}
                  />
                </div>
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {t("profile.newPassword")}
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (passwordErrors.newPassword)
                        setPasswordErrors((prev) => ({
                          ...prev,
                          newPassword: undefined,
                        }));
                      if (passwordErrors.confirmPassword)
                        setPasswordErrors((prev) => ({
                          ...prev,
                          confirmPassword:
                            e.target.value !== confirmPassword
                              ? t("profile.errors.passwordMismatch")
                              : undefined,
                        }));
                    }}
                    placeholder={t("profile.passwordPlaceholder")}
                    className={inputClass(!!passwordErrors.newPassword)}
                  />
                </div>
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {passwordErrors.newPassword}
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {t("profile.confirmNewPassword")}
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (passwordErrors.confirmPassword)
                        setPasswordErrors((prev) => ({
                          ...prev,
                          confirmPassword:
                            e.target.value !== newPassword
                              ? t("profile.errors.passwordMismatch")
                              : undefined,
                        }));
                    }}
                    placeholder={t("profile.confirmPasswordPlaceholder")}
                    className={inputClass(!!passwordErrors.confirmPassword)}
                  />
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                onClick={handleUpdatePassword}
                disabled={
                  isUpdatingPassword ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword
                }
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingPassword ? "Updating..." : t("profile.save")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}