import { useState } from 'react';
import { MessagesSquare, Loader2 } from 'lucide-react';
import { generateAIResponse } from '../utils/ai';
import './NudgeCard.css';

export default function ConnectionStarter() {
  const [target, setTarget] = useState('');
  const [starter, setStarter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleNext = async () => {
    setIsGenerating(true);
    setError('');
    setStarter('');

    try {
      let prompt;
      if (target.trim()) {
        prompt = `Generate a single, unique, interesting conversation starter that the user can use to confidently approach and talk to: "${target}". Make it sound natural, brave, and positive. Only return the response text.`;
      } else {
        prompt = `Generate a single, unique, interesting conversation starter that the user can use to confidently approach and talk to someone new. Make it sound natural, brave, and positive. Only return the response text.`;
      }

      const text = await generateAIResponse(prompt);
      setStarter(text.replace(/^["']|["']$/g, ''));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass-panel nudge-card animate-fade-in-up">
      <div className="card-header">
        <MessagesSquare size={28} color="#F2CC8F" />
        <h2>Go Deep</h2>
      </div>
      <p className="card-description">
        Want to connect but don't know what to say? Tell me who you're talking to and I'll give you a great starter.
      </p>

      <div className="input-group">
        <input 
          type="text" 
          placeholder="Who are you talking to? (e.g. a colleague, a crush)" 
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="dilemma-input"
        />
      </div>

      <button 
        className={`nudge-btn ${isGenerating ? 'animating' : ''}`}
        onClick={handleNext}
        disabled={isGenerating}
        style={{ background: '#F2CC8F', color: '#7A6245', marginTop: '1rem' }}
      >
        {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <MessagesSquare size={20} />}
        <span>{isGenerating ? 'Thinking...' : 'Give me a starter'}</span>
      </button>

      {error && (
        <div className="response-box animate-fade-in-up" style={{ background: '#FFD6D6', borderColor: '#FF9999', marginTop: '1rem' }}>
          <p className="response-text" style={{ color: '#CC0000', fontSize: '0.9rem' }}>{error}</p>
        </div>
      )}

      {starter && !isGenerating && (
        <div className="response-box animate-fade-in-up" style={{ background: 'rgba(242, 204, 143, 0.2)', borderColor: '#F2CC8F', marginTop: '1rem' }}>
          <p className="response-text" style={{ color: '#7A6245' }}>"{starter}"</p>
        </div>
      )}
    </div>
  );
}
