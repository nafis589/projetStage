import React from "react";
import { Wrench, CalendarCheck, BadgeCheck} from "lucide-react";
const SuggestionsSection = () => {
    const suggestions = [
        {
            title: 'Demander un service',
            description: 'Trouvez un professionnel qualifié près de chez vous pour tous vos besoins à domicile.',
            icon: <Wrench size={28} className="text-primary" />,
            details: 'Voir plus'
          },
          {
            title: 'Réserver à l’avance',
            description: 'Planifiez votre intervention à la date et l’heure qui vous conviennent.',
            icon: <CalendarCheck size={28} className="text-primary" />,
            details: 'Voir plus'
          },
          {
            title: 'Professionnels certifiés',
            description: 'Nos prestataires sont vérifiés, notés et évalués par les clients.',
            icon: <BadgeCheck size={28} className="text-primary" />,
            details: 'Voir plus'
          },
      
    ];
  
    return (
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-black mb-8">Suggestions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestions.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{item.icon}</div>
                  <button className="text-black font-semibold hover:underline">
                    {item.details}
                  </button>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  export default SuggestionsSection;