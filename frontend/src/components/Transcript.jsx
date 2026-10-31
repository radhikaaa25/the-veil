import { motion } from 'framer-motion';

export default function Transcript({ entries }) {
  return (
    <motion.div
      className="transcript-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="transcript-title">Séance Transcript</div>
      <div className="transcript-entries">
        {entries.map((entry, i) => (
          <motion.div
            key={i}
            className="transcript-entry"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <div className="transcript-question">"{entry.question}"</div>
            <div className="transcript-answer">{entry.answer}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
