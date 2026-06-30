import { useState } from 'react';
import { Bot, Send, Loader2 } from 'lucide-react';
import { generateAIResponse } from '../utils/ai';
import './NudgeCard.css';

export default function SocialBuffer() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setIsGenerating(true);
    setError('');
    setOutput('');

    try {
      const prompt = `You are a positive, encouraging "Social Buffer" helping an introvert step out of their comfort zone. The user wants to reach out to someone but is struggling with the right words. They provided a raw, brief, or blunt thought. 
Your job is to rewrite it into a single, warm, friendly, confident, and natural-sounding text message that encourages connection. Don't make it overly enthusiastic or long, keep it genuine. Only return the final rewritten message, nothing else.

User's raw thought: "${input}"
Rewritten message:`;

      const text = await generateAIResponse(prompt);
      // Remove any surrounding quotes if AI adds them
      setOutput(text.replace(/^["']|["']$/g, ''));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass-panel nudge-card animate-fade-in-up">
      <div className="card-header">
        <Bot size={28} color="#9D4EDD" />
        <h2>Social Buffer</h2>
      </div>
      <p className="card-description">
        Type your raw, blunt thought. AI will rewrite it into a warm message so you can confidently hit send and connect.
      </p>

      <div className="input-group">
        <textarea 
          placeholder="e.g. Haven't talked in months, let's get coffee." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="dilemma-input"
          style={{ resize: 'none', height: '80px', borderRadius: '16px' }}
        />
      </div>

      <button 
        className={`nudge-btn ${isGenerating ? 'animating' : ''}`}
        onClick={handleGenerate}
        disabled={isGenerating || !input.trim()}
        style={{ background: '#9D4EDD' }}
      >
        {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
        <span>{isGenerating ? 'Drafting...' : 'Buffer this'}</span>
      </button>

      {error && (
        <div className="response-box animate-fade-in-up" style={{ background: '#FFD6D6', borderColor: '#FF9999', marginTop: '1rem' }}>
          <p className="response-text" style={{ color: '#CC0000', fontSize: '0.9rem' }}>{error}</p>
        </div>
      )}

      {output && !isGenerating && (
        <div className="response-box animate-fade-in-up" style={{ background: 'rgba(157, 78, 221, 0.1)', borderColor: '#9D4EDD', marginTop: '1rem' }}>
          <p className="response-text" style={{ color: '#4A0080' }}>"{output}"</p>
        </div>
      )}
    </div>
  );
}
