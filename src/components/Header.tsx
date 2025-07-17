'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { UserIcon, ArrowRightOnRectangleIcon, KeyIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function Header() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Attempting to change password...');
      const response = await axios.post('/api/auth/change-password', {
        currentPassword,
        newPassword
      });
      
      console.log('Password change response:', response.data);
      toast.success('Password changed successfully');
      setIsPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Password change error:', error.response?.data || error);
      const errorMessage = error.response?.data?.error || 'Failed to change password';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className="bg-slate-800 shadow-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-bold text-white">
                <span className="bg-gradient-to-r from-pink-500 to-green-300 bg-clip-text text-transparent">
                  Project Todo
                </span>
              </Link>
            </div>
            
            <div className="ml-4 flex items-center">
              {status === 'authenticated' ? (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 bg-slate-700 py-2 px-3 rounded-md hover:bg-slate-600 transition-colors duration-200"
                  >
                    <UserIcon className="h-5 w-5  bg-gradient-to-r from-pink-500 to-green-300 bg-clip-text text-transparen " />
                    <span className="bg-gradient-to-r text-sm from-pink-500 to-green-400 bg-clip-text text-transparent">{session.user.name}</span>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-md shadow-lg py-1 z-10 border border-slate-600">
                      <div className="px-4 py-2 text-sm text-yellow-400 border-b border-slate-600">
                        Signed in as <span className="font-medium">{session.user.email}</span>
                      </div>
                      <button
                        onClick={() => {
                          setIsPasswordModalOpen(true);
                          setIsDropdownOpen(false);
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-600 hover:text-yellow-400"
                      >
                        <KeyIcon className="h-4 w-4 mr-2" />
                        Change Password
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-400 font-bold hover:bg-slate-600 hover:text-yellow-400"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    href="/auth/signin"
                    className="text-slate-300 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-blue-700 text-yellow-400 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Password Change Modal */}
      <Dialog
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

          <div className="relative bg-slate-800 rounded-2xl w-full max-w-md mx-4 p-6 shadow-2xl border border-slate-700">
            <h3 className="text-lg font-medium mb-4 text-center bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
              Change Password
            </h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-yellow-400">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 p-2 block w-full rounded-md border-slate-600 bg-slate-700 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 text-slate-200 transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 p-2 block w-full rounded-md border-slate-600 bg-slate-700 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 text-slate-200 transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 p-2 block w-full rounded-md border-slate-600 bg-slate-700 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 text-slate-200 transition-all duration-300"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors duration-300 border border-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-yellow-400 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-md hover:from-blue-800 hover:to-indigo-900 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </>
  );
} 