"use client";
import React, { useState, useRef, useEffect } from "react";
import AddressFromCoordinates from "./AddressFromCoordinates";

interface LocationDisplayProps {
  latitude?: number;
  longitude?: number;
  fallbackAddress?: string;
  maxLength?: number;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ 
  latitude, 
  longitude, 
  fallbackAddress, 
  maxLength = 20 
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const [fullAddress, setFullAddress] = useState<string>("");
  const addressRef = useRef<HTMLDivElement>(null);

  const truncateText = (text: string, maxLen: number) => {
    if (!text || text.length <= maxLen) return text;
    return text.substring(0, maxLen) + "...";
  };

  // Cet effet observe le composant AddressFromCoordinates pour extraire l'adresse complète une fois chargée.
  useEffect(() => {
    if (!addressRef.current) return;

    const observer = new MutationObserver(() => {
      const spanElement = addressRef.current?.querySelector('span');
      if (spanElement) {
        const loadedAddress = spanElement.getAttribute('title') || spanElement.textContent;
        if (loadedAddress && loadedAddress !== 'Chargement de l\'adresse...' && loadedAddress !== 'Chargement...') {
          setFullAddress(loadedAddress);
        }
      }
    });

    observer.observe(addressRef.current, { 
      childList: true, 
      subtree: true, 
      attributes: true, 
      attributeFilter: ['title'] 
    });

    return () => observer.disconnect();
  }, []);

  // Affiche le composant AddressFromCoordinates pour le chargement des données
  if (latitude && longitude) {
    return (
      <div className="relative">
        <div 
          className="cursor-pointer"
          onMouseEnter={() => setShowPopover(true)}
          onMouseLeave={() => setShowPopover(false)}
        >
          {/* Affiche l'adresse tronquée une fois chargée, sinon le composant de chargement */}
          <div ref={addressRef} className="text-sm text-gray-500">
            {fullAddress ? truncateText(fullAddress, maxLength) : <AddressFromCoordinates lat={latitude} lng={longitude} />}
          </div>
        </div>
        
        {/* Affiche le popover si l'adresse est longue */}
        {showPopover && fullAddress && fullAddress.length > maxLength && (
          <div className="absolute z-50 bg-gray-800 text-white text-xs rounded-lg p-2 shadow-lg max-w-xs -top-2 left-0 transform -translate-y-full">
            {fullAddress}
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>
    );
  }

  // Fallback pour les adresses sans coordonnées
  const displayText = fallbackAddress || "Localisation non disponible";
  const truncatedText = truncateText(displayText, maxLength);
  const needsPopover = displayText.length > maxLength;

  return (
    <div className="relative">
      <span 
        className={`text-sm text-gray-500 ${needsPopover ? 'cursor-pointer' : ''}`}
        onMouseEnter={() => needsPopover && setShowPopover(true)}
        onMouseLeave={() => setShowPopover(false)}
        title={needsPopover ? displayText : undefined}
      >
        {truncatedText}
      </span>
      
      {showPopover && needsPopover && (
        <div className="absolute z-50 bg-gray-800 text-white text-xs rounded-lg p-2 shadow-lg max-w-xs -top-2 left-0 transform -translate-y-full">
          {displayText}
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

export default LocationDisplay;
