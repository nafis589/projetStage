import React from "react";

const Footer = () => {
    
  
    return (
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-8 mb-4 md:mb-0">
                <button className="text-gray-300 hover:text-white">Privacy</button>
                <button className="text-gray-300 hover:text-white">Accessibility</button>
                <button className="text-gray-300 hover:text-white">Terms</button>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">© 2025 Geservice Technologies Inc.</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  };

  export default Footer;