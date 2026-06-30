import { useState, useRef, useEffect } from 'react';
import { User, Bot, Send, Loader2, PlaySquare } from 'lucide-react';
import { generateAIResponse } from '../utils/ai';
import './NudgeCard.css';

export default function DryRun() {
  const [scenario, setScenario] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleStart = async () => {
    if (!scenario.trim()) return;
    setIsStarted(true);
    setIsTyping(true);
    setError('');

    const systemPrompt = `You are a roleplay simulator for someone practicing a stressful conversation. 
The user is anxious about this scenario: "${scenario}".
Take on the persona of the person the user is going to talk to. Keep your responses brief, realistic, and conversational. Do not break character. Start the conversation by saying something natural for that persona.`;

    try {
      const initialHistory = [
        { role: 'system', content: systemPrompt }
      ];
      
      const response = await generateAIResponse(initialHistory, 300);
      setMessages([
        { role: 'system', content: systemPrompt },
        { role: 'assistant', content: response }
      ]);
    } catch (err) {
      setError(err.message || 'Failed to start roleplay.');
      setIsStarted(false);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const newUserMsg = { role: 'user', content: inputValue };
    const updatedMessages = [...messages, newUserMsg];
    
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);
    setError('');

    try {
      const response = await generateAIResponse(updatedMessages, 300);
      setMessages([...updatedMessages, { role: 'assistant', content: response }]);
    } catch (err) {
      setError(err.message || 'Failed to send message.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="glass-panel nudge-card animate-fade-in-up" style={{ padding: isStarted ? '1rem' : '2rem' }}>
      {!isStarted ? (
        <>
          <div className="card-header">
            <PlaySquare size={28} color="#457B9D" />
            <h2>Dry Run</h2>
          </div>
          <p className="card-description">
            Practice a stressful conversation before it happens. Tell me who you need to talk to and what it's about.
          </p>

          <div className="input-group">
            <textarea 
              placeholder="e.g. I need to ask my boss for a raise." 
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="dilemma-input"
              style={{ resize: 'none', height: '80px', borderRadius: '16px' }}
            />
          </div>

          <button 
            className={`nudge-btn ${isTyping ? 'animating' : ''}`}
            onClick={handleStart}
            disabled={isTyping || !scenario.trim()}
            style={{ background: '#457B9D' }}
          >
            {isTyping ? <Loader2 className="animate-spin" size={20} /> : <PlaySquare size={20} />}
            <span>{isTyping ? 'Setting the stage...' : 'Start Roleplay'}</span>
          </button>
          
          {error && (
            <div className="response-box" style={{ background: '#FFD6D6', borderColor: '#FF9999', marginTop: '1rem' }}>
              <p className="response-text" style={{ color: '#CC0000', fontSize: '0.9rem' }}>{error}</p>
            </div>
          )}
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: '#457B9D', fontSize: '1rem' }}>Roleplay in Progress</h3>
            <button 
              onClick={() => { setIsStarted(false); setMessages([]); setScenario(''); }}
              style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
            >
              End Session
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.filter(m => m.role !== 'system').map((msg, idx) => (
              <div key={idx} style={{ 
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                background: msg.role === 'user' ? '#457B9D' : 'rgba(69, 123, 157, 0.1)',
                color: msg.role === 'user' ? 'white' : '#1D3557',
                padding: '0.75rem 1rem',
                borderRadius: '16px',
                borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '16px',
                maxWidth: '80%',
                lineHeight: 1.4
              }}>
                {msg.content}
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', background: 'rgba(69, 123, 157, 0.1)', padding: '0.75rem 1rem', borderRadius: '16px', borderBottomLeftRadius: '4px' }}>
                <Loader2 className="animate-spin" size={16} color="#457B9D" />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {error && (
            <div style={{ color: '#CC0000', fontSize: '0.8rem', marginTop: '0.5rem' }}>{error}</div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your reply..."
              className="dilemma-input"
              style={{ flex: 1, margin: 0, padding: '0.75rem 1rem' }}
              disabled={isTyping}
            />
            <button 
              onClick={handleSend}
              disabled={isTyping || !inputValue.trim()}
              style={{ 
                background: '#457B9D', color: 'white', border: 'none', borderRadius: '16px', 
                width: '48px', display: 'flex', justifyContent: 'center', alignItems: 'center',
                cursor: (isTyping || !inputValue.trim()) ? 'not-allowed' : 'pointer',
                opacity: (isTyping || !inputValue.trim()) ? 0.6 : 1
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
