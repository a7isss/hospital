import React from "react";

const Partners = () => {
  // Sample partner data (replace with your actual data)
  const partners = [
    { id: 1, name: "HealthTech Innovations", image: "https://picsum.photos/200/200?random=1", description: "Leading medical technology provider" },
    { id: 2, name: "CarePlus Labs", image: "https://picsum.photos/200/200?random=2", description: "Diagnostic testing specialists" },
    { id: 3, name: "MediSolutions", image: "https://picsum.photos/200/200?random=3", description: "Pharmaceutical partners" },
    { id: 4, name: "Surgical Experts", image: "https://picsum.photos/200/200?random=4", description: "Surgical equipment manufacturers" },
    { id: 5, name: "Digital Health Co.", image: "https://picsum.photos/200/200?random=5", description: "Telemedicine platform" },
    { id: 6, name: "BioResearch Ltd", image: "https://picsum.photos/200/200?random=6", description: "Clinical research organization" },
  ];

  return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Our Trusted Partners</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner) => (
                <div
                    key={partner.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-center">
                      <img
                          className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                          src={partner.image}
                          alt={partner.name}
                          loading="lazy"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
                      <p className="mt-2 text-sm text-gray-500">{partner.description}</p>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default Partners;