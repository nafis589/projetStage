"use client";
import React, { useState } from "react";

// Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
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
          <button className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors">
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
  );
};
export default Header;
