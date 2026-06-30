import { useState, useEffect } from 'react';
import { Focus, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { generateAIResponse } from '../utils/ai';
import './NudgeCard.css';

export default function RuminationBreaker() {
  const [activeMode, setActiveMode] = useState(null); // 'microstep', 'breathing', 'timer', '54321'
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  
  // States for microstep
  const [exerciseText, setExerciseText] = useState('');

  // States for breathing
  const [breathState, setBreathState] = useState('inhale'); // inhale, hold, exhale
  const [breathMessage, setBreathMessage] = useState('Breathe In');

  // States for timer
  const [timeLeft, setTimeLeft] = useState(30);

  // States for 5-4-3-2-1
  const [currentStep, setCurrentStep] = useState(5);
  const stepPrompts = {
    5: "Name 5 things you can see around you.",
    4: "Name 4 things you can physically feel.",
    3: "Name 3 things you can hear right now.",
    2: "Name 2 things you can smell.",
    1: "Name 1 thing you can taste."
  };

  const handleBreak = async () => {
    // Reset states
    setError('');
    setExerciseText('');
    setTimeLeft(30);
    setCurrentStep(5);
    
    // Pick random mode
    const modes = ['microstep', 'breathing', 'timer', '54321'];
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    setActiveMode(randomMode);

    if (randomMode === 'microstep') {
      setIsGenerating(true);
      try {
        const prompt = `The user is stuck in a loop of overthinking. Give them a quick 1-sentence physical grounding exercise (like noticing things, breathing, etc.), followed by an encouraging sentence to get up, take a positive step, and engage with the real world today. Keep it under 3 sentences total. Only return the response text.`;
        const text = await generateAIResponse(prompt);
        setExerciseText(text.replace(/^["']|["']$/g, ''));
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setIsGenerating(false);
      }
    }
  };

  // Breathing effect hook
  useEffect(() => {
    let interval;
    if (activeMode === 'breathing') {
      setBreathState('inhale');
      setBreathMessage('Breathe In');
      
      let cycle = 0;
      interval = setInterval(() => {
        cycle = (cycle + 1) % 4;
        if (cycle === 0) {
          setBreathState('inhale');
          setBreathMessage('Breathe In');
        } else if (cycle === 1 || cycle === 3) {
          setBreathState('hold');
          setBreathMessage('Hold');
        } else if (cycle === 2) {
          setBreathState('exhale');
          setBreathMessage('Breathe Out');
        }
      }, 4000); // 4 seconds per phase
    }
    return () => clearInterval(interval);
  }, [activeMode]);

  // Timer effect hook
  useEffect(() => {
    let interval;
    if (activeMode === 'timer' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeMode, timeLeft]);

  return (
    <div className="glass-panel nudge-card animate-fade-in-up">
      <div className="card-header">
        <Focus size={28} color="#81B29A" />
        <h2>Break the Loop</h2>
      </div>
      <p className="card-description">
        Stuck in an overthinking spiral? Hit the button to get back to the present moment.
      </p>

      {!activeMode && (
        <button 
          className="nudge-btn"
          onClick={handleBreak}
          style={{ background: '#81B29A' }}
        >
          <Focus size={20} />
          <span>Ground Me</span>
        </button>
      )}

      {/* MODE 1: Microstep */}
      {activeMode === 'microstep' && (
        <>
          <button 
            className={`nudge-btn ${isGenerating ? 'animating' : ''}`}
            onClick={handleBreak}
            disabled={isGenerating}
            style={{ background: '#81B29A' }}
          >
            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Focus size={20} />}
            <span>{isGenerating ? 'Centering...' : 'Ground Me Again'}</span>
          </button>
          {error && (
            <div className="response-box animate-fade-in-up" style={{ background: '#FFD6D6', borderColor: '#FF9999', marginTop: '1rem' }}>
              <p className="response-text" style={{ color: '#CC0000', fontSize: '0.9rem' }}>{error}</p>
            </div>
          )}
          {exerciseText && !isGenerating && (
            <div className="response-box animate-fade-in-up" style={{ background: 'rgba(129, 178, 154, 0.2)', borderColor: '#81B29A', marginTop: '1rem' }}>
              <p className="response-text" style={{ color: '#2B4A3B' }}>{exerciseText}</p>
            </div>
          )}
        </>
      )}

      {/* MODE 2: Breathing */}
      {activeMode === 'breathing' && (
        <div className="animate-fade-in-up" style={{ textAlign: 'center' }}>
          <div className="breathing-circle-container">
            <div className={`breathing-circle ${breathState}`}>
              {breathMessage}
            </div>
          </div>
          <button 
            className="another-one-btn" 
            onClick={() => setActiveMode(null)}
            style={{ color: '#81B29A', textDecoration: 'underline', marginTop: '1rem' }}
          >
            I feel grounded now
          </button>
        </div>
      )}

      {/* MODE 3: Timer */}
      {activeMode === 'timer' && (
        <div className="animate-fade-in-up" style={{ textAlign: 'center' }}>
          <p style={{ color: '#2B4A3B', fontWeight: 500 }}>Just sit and breathe. Do nothing else until the timer ends.</p>
          <div className="timer-display">
            00:{timeLeft.toString().padStart(2, '0')}
          </div>
          {timeLeft === 0 ? (
            <button 
              className="nudge-btn"
              onClick={() => setActiveMode(null)}
              style={{ background: '#81B29A', margin: '0 auto' }}
            >
              <CheckCircle2 size={20} />
              <span>Great job. Time to step forward.</span>
            </button>
          ) : (
            <p style={{ fontSize: '0.8rem', color: '#81B29A' }}>Wait for it...</p>
          )}
        </div>
      )}

      {/* MODE 4: 5-4-3-2-1 */}
      {activeMode === '54321' && (
        <div className="animate-fade-in-up" style={{ textAlign: 'center' }}>
          <div className="response-box" style={{ background: 'rgba(129, 178, 154, 0.2)', borderColor: '#81B29A', marginTop: 0 }}>
            <p className="response-text" style={{ color: '#2B4A3B' }}>
              {currentStep > 0 ? stepPrompts[currentStep] : "You are grounded. Take a deep breath and go tackle the world."}
            </p>
          </div>
          
          <div style={{ marginTop: '1.5rem' }}>
            {currentStep > 0 ? (
              <button 
                className="nudge-btn"
                onClick={() => setCurrentStep(prev => prev - 1)}
                style={{ background: '#81B29A', margin: '0 auto' }}
              >
                <span>I found them</span>
                <ArrowRight size={20} />
              </button>
            ) : (
              <button 
                className="nudge-btn"
                onClick={() => setActiveMode(null)}
                style={{ background: '#81B29A', margin: '0 auto' }}
              >
                <CheckCircle2 size={20} />
                <span>Done</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
