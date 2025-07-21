import React from "react";
import Image from 'next/image';
const LoginActivitySection = () => {
    return (
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-black mb-6">
                Connectez-vous pour suivre vos services
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Accédez à votre tableau de bord, suivez vos prestations récentes, 
                consultez vos rendez-vous à venir et gérez vos informations personnelles.
              </p>
              <div className="space-y-4">
                <button className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                    Se connecter à mon compte
                </button>
                <p className="text-gray-600">
                    Vous n&apos;avez pas encore de compte ?
                  <button className="text-black underline hover:no-underline ml-1">
                    Créer un compte
                  </button>
                </p>
              </div>
            </div>
            <div>
            <Image
  src="/landingimg.jpg"
  alt="People getting into Uber"
  width={1200}  // or appropriate width
  height={384} // h-96 = 384px
  className="object-cover rounded-lg shadow-2xl w-full h-96"
/>
            </div>
          </div>
        </div>
      </section>
    );
  };

  export default LoginActivitySection;