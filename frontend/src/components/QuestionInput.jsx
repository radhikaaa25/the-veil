import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuestionInput({ onSubmit, disabled, isDone, onAskAgain, onEndSeance }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = value.trim();
    if (!q || disabled) return;
    onSubmit(q);
    setValue('');
  };

  return (
    <div className="question-area">
      <AnimatePresence mode="wait">
        {isDone ? (
          <motion.div
            key="actions"
            className="action-buttons"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button className="action-btn" onClick={onAskAgain}>
              ASK AGAIN
            </button>
            <button className="action-btn end" onClick={onEndSeance}>
              END SÉANCE
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className="question-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <input
              id="question-input"
              className="question-input"
              type="text"
              placeholder="What do you wish to ask the unknown?"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={disabled}
              autoComplete="off"
              autoFocus
            />
            <button
              id="summon-btn"
              className="summon-btn"
              type="submit"
              disabled={disabled || !value.trim()}
            >
              SUMMON
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
