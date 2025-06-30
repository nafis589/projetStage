import React from "react";
const LoginActivitySection = () => {
    return (
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-black mb-6">
                Log in to see your recent activity
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                View past trips, tailored suggestions, support resources, and more.
              </p>
              <div className="space-y-4">
                <button className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  Log in to your account
                </button>
                <p className="text-gray-600">
                  Don&apos;t have an Uber account? 
                  <button className="text-black underline hover:no-underline ml-1">
                    Sign up
                  </button>
                </p>
              </div>
            </div>
            <div>
              <img 
                src="https://images.pexels.com/photos/5081930/pexels-photo-5081930.jpeg"
                alt="Person using mobile app"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    );
  };

  export default LoginActivitySection;