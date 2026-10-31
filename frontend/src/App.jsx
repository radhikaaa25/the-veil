import { useState, useCallback } from 'react';
import LandingScreen from './components/LandingScreen';
import OuijaBoard from './components/OuijaBoard';
import QuestionInput from './components/QuestionInput';
import ResponseDisplay from './components/ResponseDisplay';
import Transcript from './components/Transcript';
import Particles from './components/Particles';
import Candles from './components/Candles';
import AmbientSound from './components/AmbientSound';
import './App.css';

const API_URL = 'http://localhost:8000';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function App() {
  const [seanceStarted, setSeanceStarted] = useState(false);
  const [question, setQuestion] = useState('');
  const [isContacting, setIsContacting] = useState(false);
  const [response, setResponse] = useState('');
  const [revealedText, setRevealedText] = useState('');
  const [currentTarget, setCurrentTarget] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState('');
  const [transcript, setTranscript] = useState([]);
  const [highlightedChar, setHighlightedChar] = useState(null);

  const resetBoard = useCallback(() => {
    setQuestion('');
    setResponse('');
    setRevealedText('');
    setCurrentTarget(null);
    setIsAnimating(false);
    setIsDone(false);
    setError('');
    setIsContacting(false);
    setHighlightedChar(null);
  }, []);

  const endSeance = useCallback(() => {
    resetBoard();
    setTranscript([]);
    setSeanceStarted(false);
  }, [resetBoard]);

  const askAgain = useCallback(() => {
    resetBoard();
  }, [resetBoard]);

  const handleSubmit = useCallback(async (q) => {
    setQuestion(q);
    setIsContacting(true);
    setError('');
    setRevealedText('');
    setIsDone(false);
    setHighlightedChar(null);

    try {
      const res = await fetch(`${API_URL}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'The connection to the other side has been severed.');
      }

      const data = await res.json();
      const answer = data.answer.toUpperCase();
      setResponse(answer);
      setIsContacting(false);
      setIsAnimating(true);

      // Animate through each character
      const chars = answer.split('');
      let revealed = '';

      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];

        if (ch === ' ') {
          revealed += ' ';
          setRevealedText(revealed);
          setHighlightedChar(null);
          await sleep(400);
          continue;
        }

        // Move planchette to this character
        setCurrentTarget(ch);
        setHighlightedChar(ch);
        await sleep(700); // time to glide

        revealed += ch;
        setRevealedText(revealed);
        await sleep(300); // pause on letter
      }

      // Move to GOODBYE
      setHighlightedChar(null);
      setCurrentTarget('GOODBYE');
      await sleep(1200);

      setCurrentTarget(null);
      setIsAnimating(false);
      setIsDone(true);

      setTranscript((prev) => [...prev, { question: q, answer }]);
    } catch (err) {
      setIsContacting(false);
      setIsAnimating(false);
      setError(err.message || 'The connection to the other side has been severed.');
    }
  }, []);

  if (!seanceStarted) {
    return (
      <>
        <Particles />
        <LandingScreen onEnter={() => setSeanceStarted(true)} />
      </>
    );
  }

  return (
    <div className={`seance-room ${isContacting ? 'dimmed' : ''}`}>
      <Particles />
      <Candles />
      <AmbientSound />

      <div className="board-container">
        <OuijaBoard
          currentTarget={currentTarget}
          highlightedChar={highlightedChar}
          isContacting={isContacting}
        />

        <ResponseDisplay
          revealedText={revealedText}
          isContacting={isContacting}
          error={error}
        />

        <QuestionInput
          onSubmit={handleSubmit}
          disabled={isContacting || isAnimating}
          isDone={isDone}
          onAskAgain={askAgain}
          onEndSeance={endSeance}
        />

        {transcript.length > 0 && <Transcript entries={transcript} />}
      </div>
    </div>
  );
}

export default App;
