import { useState } from 'react';
import { Sparkles, MessageSquareHeart, Loader2 } from 'lucide-react';
import { generateAIResponse } from '../utils/ai';
import './NudgeCard.css';

export default function NudgeCard() {
  const [dilemma, setDilemma] = useState('');
  const [response, setResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleNudge = async () => {
    if (!dilemma.trim()) return;

    setIsGenerating(true);
    setError('');
    setResponse('');

    try {
      const prompt = `You are a bold, encouraging companion pushing the user to take positive action. The user is overthinking this dilemma: "${dilemma}". 
Give a short, punchy (1-2 sentences max) push to go for it, step out of their comfort zone, and take a positive, confident approach. Only return the response text, nothing else.`;
      
      const text = await generateAIResponse(prompt);
      setResponse(text.replace(/^["']|["']$/g, ''));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass-panel nudge-card animate-fade-in-up">
      <div className="card-header">
        <MessageSquareHeart size={28} color="#E07A5F" />
        <h2>Need a Nudge?</h2>
      </div>
      <p className="card-description">
        Indecisive? Overthinking? Tell me what you're debating and I'll give you the push you need to take action.
      </p>
      
      <div className="input-group">
        <input 
          type="text" 
          placeholder="e.g. Should I go to that networking event?" 
          value={dilemma}
          onChange={(e) => setDilemma(e.target.value)}
          className="dilemma-input"
        />
      </div>

      <button 
        className={`nudge-btn ${isGenerating ? 'animating' : ''}`}
        onClick={handleNudge}
        disabled={isGenerating || !dilemma.trim()}
      >
        {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
        <span>{isGenerating ? 'Summoning courage...' : 'Give me a push'}</span>
      </button>

      {error && (
        <div className="response-box animate-fade-in-up" style={{ background: '#FFD6D6', borderColor: '#FF9999', marginTop: '1rem' }}>
          <p className="response-text" style={{ color: '#CC0000', fontSize: '0.9rem' }}>{error}</p>
        </div>
      )}

      {response && !isGenerating && (
        <div className="response-box animate-fade-in-up" style={{ marginTop: '1rem' }}>
          <p className="response-text">"{response}"</p>
        </div>
      )}
    </div>
  );
}
