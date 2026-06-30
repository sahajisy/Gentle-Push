import { useState } from 'react';
import { Home, Loader2 } from 'lucide-react';
import { generateAIResponse } from '../utils/ai';
import './NudgeCard.css';

export default function SolitudeValidator() {
  const [reason, setReason] = useState('');
  const [validation, setValidation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleValidate = async () => {
    setIsGenerating(true);
    setError('');
    setValidation('');

    try {
      let prompt;
      if (reason.trim()) {
        prompt = `The user is choosing to stay in because: "${reason}". Validate their need for rest briefly (1 sentence), but pivot to gently reminding them that the world is waiting for them. Encourage them to prepare for a positive step outward when they are ready. Keep it under 3 sentences total. Only return the response text.`;
      } else {
        prompt = `The user is choosing to stay in. Validate their need for rest briefly (1 sentence), but pivot to gently reminding them that the world is waiting for them. Encourage them to take a positive, brave step outward as soon as they feel recharged. Keep it under 3 sentences total. Only return the response text.`;
      }

      const text = await generateAIResponse(prompt);
      setValidation(text.replace(/^["']|["']$/g, ''));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass-panel nudge-card animate-fade-in-up">
      <div className="card-header">
        <Home size={28} color="#E07A5F" />
        <h2>Rest & Rise</h2>
      </div>
      <p className="card-description">
        Staying in? Tell me why. Let's validate your rest, but make sure you don't hide away forever.
      </p>

      <div className="input-group">
        <input 
          type="text" 
          placeholder="Why are you staying in today?" 
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="dilemma-input"
        />
      </div>

      <button 
        className={`nudge-btn ${isGenerating ? 'animating' : ''}`}
        onClick={handleValidate}
        disabled={isGenerating}
        style={{ background: '#E07A5F', marginTop: '1rem' }}
      >
        {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Home size={20} />}
        <span>{isGenerating ? 'Reflecting...' : 'Validate & Motivate'}</span>
      </button>

      {error && (
        <div className="response-box animate-fade-in-up" style={{ background: '#FFD6D6', borderColor: '#FF9999', marginTop: '1rem' }}>
          <p className="response-text" style={{ color: '#CC0000', fontSize: '0.9rem' }}>{error}</p>
        </div>
      )}

      {validation && !isGenerating && (
        <div className="response-box animate-fade-in-up" style={{ background: 'rgba(224, 122, 95, 0.1)', borderColor: '#E07A5F', marginTop: '1rem' }}>
          <p className="response-text" style={{ color: '#6A3A2C' }}>{validation}</p>
        </div>
      )}
    </div>
  );
}
