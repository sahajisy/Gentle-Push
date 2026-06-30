import { useState, useEffect } from 'react';
import { Quote, Loader2 } from 'lucide-react';
import { generateAIResponse } from '../utils/ai';
import './QuoteCard.css';

export default function QuoteCard() {
  const [quote, setQuote] = useState('Loading inspiration...');
  const [context, setContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const fetchQuote = async (retryContext = '') => {
    setIsGenerating(true);
    setError('');
    
    try {
      let prompt;
      if (retryContext.trim()) {
        prompt = `Generate a short, powerful, highly motivational quote pushing the user to step out of their comfort zone, take a positive approach, and be courageous specifically regarding: "${retryContext}". Do not include who said it, just the quote itself. Only return the quote text.`;
      } else {
        prompt = `Generate a short, powerful, unique, highly motivational quote pushing an introverted user to step out of their comfort zone, embrace the world, and take a positive approach. Do not include who said it, just the quote itself. Only return the quote text.`;
      }

      const text = await generateAIResponse(prompt);
      setQuote(text.replace(/^["']|["']$/g, ''));
    } catch (err) {
      setError(err.message || "Failed to load quote.");
      setQuote("Sometimes you have to be your own inspiration when the API fails.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    fetchQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="glass-panel quote-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="quote-icon-wrapper">
        <Quote size={24} color="#F2C14E" fill="#F2C14E" />
      </div>
      
      {error && (
        <div style={{ color: '#CC0000', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {isGenerating ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
          <Loader2 className="animate-spin" size={32} color="#F2C14E" />
        </div>
      ) : (
        <p className="quote-text">"{quote}"</p>
      )}
      
      <div className="quote-input-wrapper" style={{ marginTop: '1.5rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Need courage for something specific?" 
          value={context}
          onChange={(e) => setContext(e.target.value)}
          className="dilemma-input"
          style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.7)' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') fetchQuote(context);
          }}
        />
        <button 
          className="another-one-btn" 
          onClick={() => fetchQuote(context)}
          disabled={isGenerating}
        >
          {context.trim() ? 'Generate custom quote' : 'Need another one?'}
        </button>
      </div>
    </div>
  );
}
