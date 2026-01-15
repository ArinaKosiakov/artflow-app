import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, User, Mail, Lock, Camera, Trash2 } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  currentName?: string;
  currentEmail?: string;
  currentProfilePicture?: string;
  onUpdateName?: (newName: string) => Promise<void>;
  onUpdateEmail?: (newEmail: string) => Promise<void>;
  onUpdatePassword?: (currentPassword: string, newPassword: string) => Promise<void>;
  onUpdateProfilePicture?: (file: File) => Promise<void>;
  onRemoveProfilePicture?: () => Promise<void>;
}

export default function ProfileModal({
  isOpen,
  onClose,
  darkMode,
  currentName = '',
  currentEmail = '',
  currentProfilePicture,
  onUpdateName,
  onUpdateEmail,
  onUpdatePassword,
  onUpdateProfilePicture,
  onRemoveProfilePicture,
}: ProfileModalProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<'picture' | 'email' | 'password'>('picture');
  const [profilePicture, setProfilePicture] = useState<string | null>(currentProfilePicture || null);
  
  // Name state
  const [name, setName] = useState(currentName);
  const [nameErrors, setNameErrors] = useState<{ name?: string }>({});
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  
  // Update name when currentName changes
  useEffect(() => {
    setName(currentName);
  }, [currentName]);
  
  // Email state
  const [newEmail, setNewEmail] = useState('');
  const [emailErrors, setEmailErrors] = useState<{ email?: string }>({});
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    
    if (!name.trim()) {
      errors.name = t('profile.errors.nameRequired');
    }
    
    setNameErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateName = async () => {
    if (!validateName() || !onUpdateName || isUpdatingName) return;

    setIsUpdatingName(true);
    try {
      await onUpdateName(name.trim());
      // Success message could be shown here
    } catch (error) {
      console.error('Error updating name:', error);
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload picture
    if (onUpdateProfilePicture) {
      setIsUpdatingPicture(true);
      try {
        await onUpdateProfilePicture(file);
        // Success message could be shown here
      } catch (error) {
        console.error('Error updating profile picture:', error);
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
        console.error('Error removing profile picture:', error);
      } finally {
        setIsUpdatingPicture(false);
      }
    }
  };

  const validateEmail = () => {
    const errors: { email?: string } = {};
    
    if (!newEmail.trim()) {
      errors.email = t('profile.errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      errors.email = t('profile.errors.invalidEmail');
    } else if (newEmail === currentEmail) {
      errors.email = t('profile.errors.sameEmail');
    }
    
    setEmailErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateEmail = async () => {
    if (!validateEmail() || !onUpdateEmail || isUpdatingEmail) return;

    setIsUpdatingEmail(true);
    try {
      await onUpdateEmail(newEmail);
      setNewEmail('');
      setEmailErrors({});
      // Success message could be shown here
    } catch (error) {
      console.error('Error updating email:', error);
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

    if (!currentPassword) {
      errors.currentPassword = t('profile.errors.currentPasswordRequired');
    }

    if (!newPassword) {
      errors.newPassword = t('profile.errors.newPasswordRequired');
    } else if (newPassword.length < 8) {
      errors.newPassword = t('profile.errors.passwordTooShort');
    }

    if (!confirmPassword) {
      errors.confirmPassword = t('profile.errors.newPasswordRequired');
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = t('profile.errors.passwordMismatch');
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdatePassword = async () => {
    if (!validatePassword() || !onUpdatePassword || isUpdatingPassword) return;

    setIsUpdatingPassword(true);
    try {
      await onUpdatePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordErrors({});
      // Success message could be shown here
    } catch (error) {
      console.error('Error updating password:', error);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleClose = () => {
    setActiveTab('picture');
    setName(currentName);
    setNewEmail('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setNameErrors({});
    setEmailErrors({});
    setPasswordErrors({});
    setProfilePicture(currentProfilePicture || null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} px-6 py-4 flex justify-between items-center border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('profile.title')}
          </h2>
          <button
            onClick={handleClose}
            className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} px-6 py-2 flex gap-2 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <button
            onClick={() => setActiveTab('picture')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'picture'
                ? 'bg-purple-500 text-white'
                : darkMode
                ? 'text-gray-300 hover:bg-gray-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t('profile.profilePicture')}
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'email'
                ? 'bg-purple-500 text-white'
                : darkMode
                ? 'text-gray-300 hover:bg-gray-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t('profile.changeEmail')}
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'password'
                ? 'bg-purple-500 text-white'
                : darkMode
                ? 'text-gray-300 hover:bg-gray-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t('profile.changePassword')}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Profile Picture Tab */}
          {activeTab === 'picture' && (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
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
                <div className="mt-4 flex gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePictureChange}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUpdatingPicture}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    {t('profile.changePicture')}
                  </button>
                  {profilePicture && (
                    <button
                      onClick={handleRemovePicture}
                      disabled={isUpdatingPicture}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                        darkMode
                          ? 'bg-gray-700 text-red-400 hover:bg-gray-600'
                          : 'bg-gray-100 text-red-500 hover:bg-gray-200'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      {t('profile.removePicture')}
                    </button>
                  )}
                </div>
              </div>
              
              {/* Name Field */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('profile.name')}
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (nameErrors.name) setNameErrors({});
                    }}
                    placeholder={t('profile.namePlaceholder')}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      nameErrors.name
                        ? 'border-red-500'
                        : darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors`}
                  />
                </div>
                {nameErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{nameErrors.name}</p>
                )}
              </div>
              
              {/* Save Name Button */}
              {onUpdateName && (
                <button
                  onClick={handleUpdateName}
                  disabled={isUpdatingName || !name.trim() || name.trim() === currentName}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingName ? 'Saving...' : t('profile.save')}
                </button>
              )}
            </div>
          )}

          {/* Email Tab */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('profile.currentEmail')}
                </label>
                <div className={`px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                  {currentEmail}
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('profile.newEmail')}
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => {
                      setNewEmail(e.target.value);
                      if (emailErrors.email) setEmailErrors({});
                    }}
                    placeholder={t('profile.emailPlaceholder')}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      emailErrors.email
                        ? 'border-red-500'
                        : darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors`}
                  />
                </div>
                {emailErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{emailErrors.email}</p>
                )}
              </div>
              <button
                onClick={handleUpdateEmail}
                disabled={isUpdatingEmail || !newEmail.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingEmail ? 'Updating...' : t('profile.save')}
              </button>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('profile.currentPassword')}
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      if (passwordErrors.currentPassword) setPasswordErrors({ ...passwordErrors, currentPassword: undefined });
                    }}
                    placeholder={t('profile.currentPasswordPlaceholder')}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      passwordErrors.currentPassword
                        ? 'border-red-500'
                        : darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors`}
                  />
                </div>
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-500">{passwordErrors.currentPassword}</p>
                )}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('profile.newPassword')}
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (passwordErrors.newPassword) setPasswordErrors({ ...passwordErrors, newPassword: undefined });
                      if (passwordErrors.confirmPassword && e.target.value !== confirmPassword) {
                        setPasswordErrors({ ...passwordErrors, confirmPassword: t('profile.errors.passwordMismatch') });
                      } else if (passwordErrors.confirmPassword) {
                        setPasswordErrors({ ...passwordErrors, confirmPassword: undefined });
                      }
                    }}
                    placeholder={t('profile.passwordPlaceholder')}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      passwordErrors.newPassword
                        ? 'border-red-500'
                        : darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors`}
                  />
                </div>
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-500">{passwordErrors.newPassword}</p>
                )}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('profile.confirmNewPassword')}
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (passwordErrors.confirmPassword) {
                        if (e.target.value !== newPassword) {
                          setPasswordErrors({ ...passwordErrors, confirmPassword: t('profile.errors.passwordMismatch') });
                        } else {
                          setPasswordErrors({ ...passwordErrors, confirmPassword: undefined });
                        }
                      }
                    }}
                    placeholder={t('profile.confirmPasswordPlaceholder')}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      passwordErrors.confirmPassword
                        ? 'border-red-500'
                        : darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors`}
                  />
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{passwordErrors.confirmPassword}</p>
                )}
              </div>
              <button
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingPassword ? 'Updating...' : t('profile.save')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

