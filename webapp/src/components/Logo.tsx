export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="aurora-1" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#207852" /> {/* calm-600 */}
          <stop offset="100%" stopColor="#82cba8" /> {/* calm-300 */}
        </linearGradient>
        <linearGradient id="aurora-2" x1="100" y1="0" x2="0" y2="100">
          <stop offset="0%" stopColor="#82cba8" />
          <stop offset="100%" stopColor="#d8f0e3" /> {/* calm-100 */}
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-strong" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Ambient background glow behind the logo */}
      <circle cx="50" cy="50" r="30" fill="#207852" opacity="0.15" filter="url(#glow-strong)" />

      {/* Orbit/Wave 1 */}
      <ellipse cx="50" cy="50" rx="40" ry="14" transform="rotate(-35 50 50)" stroke="url(#aurora-1)" strokeWidth="2.5" fill="none" opacity="0.9" filter="url(#glow)" />
      
      {/* Orbit/Wave 2 */}
      <ellipse cx="50" cy="50" rx="40" ry="14" transform="rotate(35 50 50)" stroke="url(#aurora-2)" strokeWidth="2.5" fill="none" opacity="0.9" filter="url(#glow)" />
      
      {/* Central Core Orb */}
      <circle cx="50" cy="50" r="10" fill="url(#aurora-1)" filter="url(#glow-strong)" />
      <circle cx="50" cy="50" r="6" fill="#ffffff" opacity="0.9" filter="url(#glow)" />

      {/* Twinkling Star/Sparkle 1 */}
      <path d="M25 20 Q25 25 20 25 Q25 25 25 30 Q25 25 30 25 Q25 25 25 20" fill="#ffffff" opacity="0.8" filter="url(#glow)" />
      
      {/* Twinkling Star/Sparkle 2 */}
      <path d="M75 80 Q75 83 72 83 Q75 83 75 86 Q75 83 78 83 Q75 83 75 80" fill="#82cba8" opacity="0.6" filter="url(#glow)" />
      
      {/* Twinkling Star/Sparkle 3 */}
      <path d="M80 30 Q80 32 78 32 Q80 32 80 34 Q80 32 82 32 Q80 32 80 30" fill="#ffffff" opacity="0.9" filter="url(#glow)" />
    </svg>
  );
}
