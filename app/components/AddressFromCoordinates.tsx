import React, { useState, useEffect } from 'react';

interface AddressFromCoordinatesProps {
  lat: number;
  lng: number;
}

const AddressFromCoordinates: React.FC<AddressFromCoordinatesProps> = ({ lat, lng }) => {
  const [address, setAddress] = useState<string>('Chargement...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!lat || !lng) {
        setAddress("Localisation non disponible");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
        if (!response.ok) {
          throw new Error('Failed to fetch address');
        }
        const data = await response.json();
        if (data && data.display_name) {
          setAddress(data.display_name);
        } else {
          setAddress('Adresse non trouvée');
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        setAddress("Impossible de charger l'adresse");
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [lat, lng]);

  if (loading) {
    return <span className="text-sm text-gray-500">Chargement de l&apos;adresse...</span>;
  }

  return <span className="text-sm text-gray-500" title={address}>{address}</span>;
};

export default AddressFromCoordinates; 