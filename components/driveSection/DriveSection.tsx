import React from "react";
import Image from 'next/image';
const DriveSection = () => {
    return (
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="https://images.unsplash.com/photo-1649769069590-268b0b994462?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkcml2ZXJ8ZW58MHx8fHRlYWx8MTc1MDg1NTY0N3ww&ixlib=rb-4.1.0&q=85"
                alt="Professional driver"
                width={1200}  // or appropriate width
                height={384}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-black mb-6">
                Rejoignez notre platforme en tant que professionnel
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Gagnez de l&apos;argent selon votre disponibilité en proposant vos services 
                à des clients de votre ville. Gérez vos rendez-vous, votre profil et vos revenus facilement.
              </p>
              <div className="space-y-4">
                <button className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors mr-4">
                  Commencer l&apos;inscription
                </button>
                <button className="text-black underline hover:no-underline">
                  Vous avez déjà un compte ? Connectez-vous
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  export default DriveSection;