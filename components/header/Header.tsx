"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation'


// Header Component
const Header = () => {

  const router = useRouter();
  const handleClick = ()=>{
    router.push('/register')
  }


  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
  };

  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
  };



  return (
   <>
    <header className="bg-black text-white px-6 py-4 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold">Geservice</div>

        {/* Desktop Navigation 
        <nav className="hidden md:flex items-center space-x-8">
          <button className="hover:text-gray-300 transition-colors">
            Ride
          </button>
          <button className="hover:text-gray-300 transition-colors">
            Drive
          </button>
          <button className="hover:text-gray-300 transition-colors">
            Business
          </button>
          <button className="hover:text-gray-300 transition-colors">
            Uber Eats
          </button>
          <button className="hover:text-gray-300 transition-colors">
            About
          </button>
        </nav>
        
        {/* Search Bar 
        <div className="hidden md:flex items-center bg-gray-800 rounded-full px-4 py-2 max-w-md flex-1 mx-8">
          <svg
            className="w-5 h-5 text-gray-400 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent text-white placeholder-gray-400 flex-1 outline-none"
          />
        </div>
        */}
        {/* Right Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <button className="hover:text-gray-300 transition-colors">EN</button>
          <button className="hover:text-gray-300 transition-colors">
            Help
          </button>
          <button className="hover:text-gray-300 transition-colors">
            Log in
          </button>
          <button 
            onClick={openSignupModal}
            className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors"
          >
            Sign up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800 mt-4">
          <nav className="px-6 py-4 space-y-4">
            <button className="block w-full text-left hover:text-gray-300">
              Ride
            </button>
            <button className="block w-full text-left hover:text-gray-300">
              Drive
            </button>
            <button className="block w-full text-left hover:text-gray-300">
              Business
            </button>
            <button className="block w-full text-left hover:text-gray-300">
              Uber Eats
            </button>
            <button className="block w-full text-left hover:text-gray-300">
              About
            </button>
            <button className="block w-full text-left hover:text-gray-300">
              Help
            </button>
            <button className="block w-full text-left hover:text-gray-300">
              Log in
            </button>
            <button className="bg-white text-black px-4 py-2 rounded w-full">
              Sign up
            </button>
          </nav>
        </div>
      )}
    </header>
    {/* Sign Up Modal */}
    {isSignupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-transparent"
            onClick={closeSignupModal}
          ></div>
          
          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 sm:mx-0 sm:max-w-lg md:max-w-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                S&apos;inscrire
              </h2>
              <button
                onClick={closeSignupModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-gray-600 text-center mb-6">
                Choisissez votre type de compte
              </p>
              
              {/* Client Option */}
              <button onClick={handleClick} className="w-full p-4 border border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all duration-200 text-left group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Je suis client</h3>
                    <p className="text-sm text-gray-500">
                      Rechercher et réserver des services
                    </p>
                  </div>
                </div>
              </button>
              
              {/* Professional Option */}
              <button className="w-full p-4 border border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all duration-200 text-left group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Je suis professionnel de service</h3>
                    <p className="text-sm text-gray-500">
                      Proposer mes services et gagner de l&apos;argent
                    </p>
                  </div>
                </div>
              </button>
            </div>
            
            {/* Footer */}
            <div className="px-6 pb-6">
              <p className="text-xs text-gray-500 text-center">
                En continuant, vous acceptez nos{" "}
                <a href="#" className="underline hover:text-gray-700">
                  Conditions d&apos;utilisation
                </a>{" "}
                et notre{" "}
                <a href="#" className="underline hover:text-gray-700">
                  Politique de confidentialité
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Header;
