import { motion, AnimatePresence } from 'framer-motion';

export default function ResponseDisplay({ revealedText, isContacting, error }) {
  return (
    <div className="response-area">
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="error"
            className="error-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.p>
        )}

        {isContacting && (
          <motion.p
            key="contacting"
            className="contacting-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            Reaching beyond the veil...
          </motion.p>
        )}

        {revealedText && (
          <motion.p
            key="revealed"
            className="revealed-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {revealedText}
            <motion.span
              style={{ display: 'inline-block', marginLeft: '2px' }}
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            >
              ▌
            </motion.span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
