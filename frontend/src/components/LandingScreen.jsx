import { motion } from 'framer-motion';

export default function LandingScreen({ onEnter }) {
  return (
    <motion.div
      className="landing-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      {/* Decorative ornament */}
      <motion.div
        className="ornament"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        ✦ ✦ ✦
      </motion.div>

      <motion.h1
        className="landing-title"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1.2, ease: 'easeOut' }}
      >
        THE VEIL
      </motion.h1>

      <motion.p
        className="landing-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1, duration: 1 }}
      >
        Some questions are better left unanswered.
      </motion.p>

      <motion.div
        className="ornament"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.2, duration: 1 }}
        style={{ marginBottom: '2rem' }}
      >
        ⸺ ☽ ⸺
      </motion.div>

      <motion.button
        className="enter-btn"
        onClick={onEnter}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        ENTER THE SÉANCE
      </motion.button>
    </motion.div>
  );
}
