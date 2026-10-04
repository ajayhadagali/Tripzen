import { useState } from 'react';
import { Star } from 'lucide-react';

const mockHotels = [
  { id: 1, name: 'Seaside Resort', price: '₹3,200/night', rating: 4.3 },
  { id: 2, name: 'Palm Grove Inn', price: '₹1,800/night', rating: 4.0 },
  { id: 3, name: 'Beachside Villas', price: '₹4,500/night', rating: 4.6 },
];

const mockAttractions = [
  { id: 1, name: 'Baga Beach', type: 'Beach' },
  { id: 2, name: 'Fort Aguada', type: 'Historic Site' },
  { id: 3, name: 'Anjuna Flea Market', type: 'Shopping' },
];

export default function PlacesExplorer({ destination }) {
  const [tab, setTab] = useState('hotels');

  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>Exploring {destination}</h3>

      <div className="sub-tab-row">
        <button className={tab === 'hotels' ? 'sub-tab active' : 'sub-tab'} onClick={() => setTab('hotels')}>Hotels</button>
        <button className={tab === 'attractions' ? 'sub-tab active' : 'sub-tab'} onClick={() => setTab('attractions')}>Attractions</button>
      </div>

      {tab === 'hotels' && (
        <div className="place-grid">
          {mockHotels.map((h) => (
            <div key={h.id} className="place-tile">
              <span className="tag">Hotel</span>
              <h4>{h.name}</h4>
              <div className="meta">
                <span>{h.price}</span>
                <span className="rating"><Star size={13} fill="#FF6B4A" color="#FF6B4A" /> {h.rating}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'attractions' && (
        <div className="place-grid">
          {mockAttractions.map((a) => (
            <div key={a.id} className="place-tile">
              <span className="tag teal">{a.type}</span>
              <h4>{a.name}</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}