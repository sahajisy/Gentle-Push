import { useState } from 'react';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { generateAIResponse } from '../utils/ai';
import './NudgeCard.css';

export default function ThoughtCheck() {
  const [thought, setThought] = useState('');
  const [reframedThought, setReframedThought] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    if (!thought.trim()) return;
    setIsGenerating(true);
    setError('');
    setReframedThought('');

    try {
      const prompt = `The user is having this anxious/spiraling thought: "${thought}". 
Act as a Cognitive Behavioral Therapy guide. In exactly two short paragraphs:
1. Objectively point out the cognitive distortion they might be experiencing (e.g. mind-reading, catastrophizing, all-or-nothing thinking) gently.
2. Reframe the thought into something more realistic, balanced, and positive, ending with a small encouragement.
Do not use lists or bullet points.`;

      const text = await generateAIResponse(prompt, 200);
      setReframedThought(text.replace(/^["']|["']$/g, ''));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass-panel nudge-card animate-fade-in-up">
      <div className="card-header">
        <BrainCircuit size={28} color="#9D4EDD" />
        <h2>Thought Check</h2>
      </div>
      <p className="card-description">
        Challenge your anxious thoughts. Write down what's bothering you, and let's reframe it together.
      </p>

      <div className="input-group">
        <textarea 
          placeholder="e.g. If I go to this event, I'll be awkward and everyone will judge me." 
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          className="dilemma-input"
          style={{ resize: 'none', height: '100px', borderRadius: '16px' }}
        />
      </div>

      <button 
        className={`nudge-btn ${isGenerating ? 'animating' : ''}`}
        onClick={handleCheck}
        disabled={isGenerating || !thought.trim()}
        style={{ background: '#9D4EDD' }}
      >
        {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <BrainCircuit size={20} />}
        <span>{isGenerating ? 'Analyzing...' : 'Reframe This Thought'}</span>
      </button>

      {error && (
        <div className="response-box animate-fade-in-up" style={{ background: '#FFD6D6', borderColor: '#FF9999' }}>
          <p className="response-text" style={{ color: '#CC0000', fontSize: '0.9rem' }}>{error}</p>
        </div>
      )}

      {reframedThought && !isGenerating && (
        <div className="response-box animate-fade-in-up" style={{ background: 'rgba(157, 78, 221, 0.1)', borderColor: '#9D4EDD' }}>
          {reframedThought.split('\n\n').map((paragraph, i) => (
            <p key={i} className="response-text" style={{ color: '#4A1D70', marginBottom: i === 0 ? '1rem' : 0, fontStyle: 'normal' }}>
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
