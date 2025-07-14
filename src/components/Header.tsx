'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <header className="bg-slate-800 shadow-md border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-white">
              <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                Todo App
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
                  <UserIcon className="h-5 w-5 text-slate-300" />
                  <span className="text-slate-300 text-sm">{session.user.name}</span>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-md shadow-lg py-1 z-10 border border-slate-600">
                    <div className="px-4 py-2 text-sm text-slate-300 border-b border-slate-600">
                      Signed in as <span className="font-medium">{session.user.email}</span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-600"
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
                  className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 