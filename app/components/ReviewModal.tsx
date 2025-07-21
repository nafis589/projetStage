import React, { useState } from 'react';
import StarRating from './StarRating';

interface ReviewModalProps {
  booking: {
    id: number;
    professional_id?: number;
    prof_firstname: string;
    prof_lastname: string;
  };
  onClose: () => void;
  onSubmitted: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ booking, onClose, onSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: booking.id,
          professional_id: booking.professional_id,
          rating,
          comment,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Erreur lors de la soumission de l\'avis');
      } else {
        onSubmitted();
      }
    } catch {
      setError("Erreur lors de la soumission de l'avis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">✕</button>
        <h3 className="text-lg font-bold mb-2">Laisser un avis pour {booking.prof_firstname} {booking.prof_lastname}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Note</label>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Commentaire</label>
            <textarea
              className="w-full border rounded p-2"
              rows={3}
              value={comment}
              onChange={e => setComment(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Envoi...' : 'Soumettre'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal; 