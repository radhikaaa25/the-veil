import { useRef, useCallback, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Planchette from './Planchette';

const ROW1 = 'ABCDEFGHIJKLM'.split('');
const ROW2 = 'NOPQRSTUVWXYZ'.split('');
const NUMBERS = '1234567890'.split('');

/**
 * OuijaBoard – renders the full spirit board, manages element refs,
 * and positions the planchette by reading actual DOM coordinates.
 */
export default function OuijaBoard({ currentTarget, highlightedChar, isContacting }) {
  const boardRef = useRef(null);
  const charRefs = useRef({});    // { 'A': HTMLElement, ... 'GOODBYE': HTMLElement, 'YES': ..., 'NO': ... }

  // Planchette position as spring-animated values
  const planchetteX = useMotionValue(0);
  const planchetteY = useMotionValue(0);
  const springX = useSpring(planchetteX, { stiffness: 80, damping: 22, mass: 0.8 });
  const springY = useSpring(planchetteY, { stiffness: 80, damping: 22, mass: 0.8 });

  const [planchetteVisible, setPlanchetteVisible] = useState(false);

  // Register ref for a character
  const setCharRef = useCallback((char) => (el) => {
    if (el) charRefs.current[char] = el;
  }, []);

  // Calculate position relative to board
  const getCharPosition = useCallback((char) => {
    const board = boardRef.current;
    const el = charRefs.current[char];
    if (!board || !el) return null;

    const boardRect = board.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    return {
      x: elRect.left - boardRect.left + elRect.width / 2,
      y: elRect.top - boardRect.top + elRect.height / 2,
    };
  }, []);

  // Center planchette on mount
  useEffect(() => {
    if (!boardRef.current) return;

    const timer = setTimeout(() => {
      const board = boardRef.current;
      if (!board) return;
      const rect = board.getBoundingClientRect();
      planchetteX.set(rect.width / 2);
      planchetteY.set(rect.height / 2);
      setPlanchetteVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [planchetteX, planchetteY]);

  // Move planchette when target changes
  useEffect(() => {
    if (!currentTarget) return;

    const pos = getCharPosition(currentTarget);
    if (pos) {
      planchetteX.set(pos.x);
      planchetteY.set(pos.y);
    }
  }, [currentTarget, getCharPosition, planchetteX, planchetteY]);

  // Re-center on window resize
  useEffect(() => {
    const handleResize = () => {
      if (currentTarget) {
        const pos = getCharPosition(currentTarget);
        if (pos) {
          planchetteX.set(pos.x);
          planchetteY.set(pos.y);
        }
      } else if (boardRef.current) {
        const rect = boardRef.current.getBoundingClientRect();
        planchetteX.set(rect.width / 2);
        planchetteY.set(rect.height / 2);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentTarget, getCharPosition, planchetteX, planchetteY]);

  return (
    <motion.div
      className="ouija-board"
      ref={boardRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      {/* ── YES / NO ── */}
      <div className="board-top-row">
        <span
          ref={setCharRef('YES')}
          className={`board-word ${highlightedChar === 'YES' ? 'highlighted' : ''}`}
        >
          YES
        </span>
        <motion.div
          className="ornament"
          style={{ fontSize: '0.8rem', opacity: 0.25 }}
        >
          ☽ ✦ ☾
        </motion.div>
        <span
          ref={setCharRef('NO')}
          className={`board-word ${highlightedChar === 'NO' ? 'highlighted' : ''}`}
        >
          NO
        </span>
      </div>

      {/* ── Alphabet ── */}
      <div className="alphabet-section">
        <div className="alpha-row arc-top">
          {ROW1.map((ch) => (
            <span
              key={ch}
              ref={setCharRef(ch)}
              className={`board-letter ${highlightedChar === ch ? 'highlighted' : ''}`}
            >
              {ch}
            </span>
          ))}
        </div>
        <div className="alpha-row arc-bottom">
          {ROW2.map((ch) => (
            <span
              key={ch}
              ref={setCharRef(ch)}
              className={`board-letter ${highlightedChar === ch ? 'highlighted' : ''}`}
            >
              {ch}
            </span>
          ))}
        </div>
      </div>

      {/* ── Numbers ── */}
      <div className="number-row">
        {NUMBERS.map((n) => (
          <span
            key={n}
            ref={setCharRef(n)}
            className={`board-number ${highlightedChar === n ? 'highlighted' : ''}`}
          >
            {n}
          </span>
        ))}
      </div>

      {/* ── GOODBYE ── */}
      <span
        ref={setCharRef('GOODBYE')}
        className={`board-goodbye ${currentTarget === 'GOODBYE' ? 'highlighted' : ''}`}
      >
        GOODBYE
      </span>

      {/* ── Planchette ── */}
      <div className="planchette-container">
        <motion.div
          className="planchette"
          style={{
            x: springX,
            y: springY,
            translateX: '-50%',
            translateY: '-50%',
            opacity: planchetteVisible ? 1 : 0,
          }}
        >
          <Planchette isContacting={isContacting} />
        </motion.div>
      </div>
    </motion.div>
  );
}
