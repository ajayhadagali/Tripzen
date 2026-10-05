import { Plane } from 'lucide-react';

export default function TravelScene({ icon: Icon, quote, subtext }) {
  return (
    <div className="auth-scene">
      <div className="stars" />
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="sun" />

      <svg className="flight-svg" viewBox="0 0 400 600" preserveAspectRatio="none">
        <path
          d="M40,90 C160,40 210,190 170,270 C130,350 300,330 340,470"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="2"
          strokeDasharray="2 10"
          strokeLinecap="round"
        />
      </svg>
      <div className="plane-wrap">
        <Plane size={18} color="white" fill="white" />
      </div>

      <div className="mountain mountain-back" />
      <div className="mountain mountain-front" />

      <div className="scene-copy">
        {Icon && <Icon color="white" size={26} />}
        <h3>{quote}</h3>
        <p>{subtext}</p>
      </div>
    </div>
  );
}