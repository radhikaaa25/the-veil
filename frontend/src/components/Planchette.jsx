import { motion } from 'framer-motion';

/**
 * Planchette – The triangular pointer that glides over the board.
 * Rendered as an SVG with a wooden look and circular viewing window.
 *
 * The parent positions this absolutely via Framer Motion's `animate`.
 * All we render here is the visual shape.
 */
export default function Planchette({ isContacting }) {
  return (
    <motion.div
      className="planchette-body"
      animate={
        isContacting
          ? {
              rotate: [0, -1, 1, -0.5, 0.5, 0],
              scale: [1, 1.02, 0.98, 1.01, 0.99, 1],
            }
          : {}
      }
      transition={
        isContacting
          ? { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }
          : {}
      }
    >
      <svg
        className="planchette-shape"
        viewBox="0 0 80 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Drop shadow filter */}
        <defs>
          <filter id="planchette-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
          </filter>
          <radialGradient id="wood-gradient" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#5c3d2e" />
            <stop offset="50%" stopColor="#3d2b1f" />
            <stop offset="100%" stopColor="#2a1f17" />
          </radialGradient>
          <radialGradient id="window-gradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(201,168,76,0.08)" />
            <stop offset="70%" stopColor="rgba(201,168,76,0.03)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Main body – teardrop / planchette shape */}
        <path
          d="M40 5 L72 80 Q72 95 40 95 Q8 95 8 80 Z"
          fill="url(#wood-gradient)"
          stroke="rgba(201,168,76,0.3)"
          strokeWidth="1"
          filter="url(#planchette-shadow)"
        />

        {/* Inner border */}
        <path
          d="M40 12 L66 78 Q66 90 40 90 Q14 90 14 78 Z"
          fill="none"
          stroke="rgba(201,168,76,0.12)"
          strokeWidth="0.5"
        />

        {/* Circular viewing window */}
        <circle
          cx="40"
          cy="45"
          r="12"
          fill="url(#window-gradient)"
          stroke="rgba(201,168,76,0.25)"
          strokeWidth="1"
        />

        {/* Inner ring of window */}
        <circle
          cx="40"
          cy="45"
          r="9"
          fill="none"
          stroke="rgba(201,168,76,0.1)"
          strokeWidth="0.5"
        />

        {/* Small decorative dot at the pointer tip */}
        <circle
          cx="40"
          cy="10"
          r="2"
          fill="rgba(201,168,76,0.4)"
        />

        {/* Wood grain lines */}
        <line x1="25" y1="55" x2="55" y2="55" stroke="rgba(80,55,25,0.15)" strokeWidth="0.5" />
        <line x1="22" y1="65" x2="58" y2="65" stroke="rgba(80,55,25,0.1)" strokeWidth="0.5" />
        <line x1="20" y1="75" x2="60" y2="75" stroke="rgba(80,55,25,0.08)" strokeWidth="0.5" />
      </svg>
    </motion.div>
  );
}
