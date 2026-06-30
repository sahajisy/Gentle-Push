import { useState } from 'react';
import NudgeCard from './components/NudgeCard';
import QuoteCard from './components/QuoteCard';
import RuminationBreaker from './components/RuminationBreaker';
import SolitudeValidator from './components/SolitudeValidator';
import ConnectionStarter from './components/ConnectionStarter';
import SocialBuffer from './components/SocialBuffer';
import DryRun from './components/DryRun';
import ThoughtCheck from './components/ThoughtCheck';
import { Sparkles, Focus, Home, MessagesSquare, Bot, PlaySquare, BrainCircuit } from 'lucide-react';
import logo from './assets/logo.png';
import './App.css'; // Add a new CSS file for App specific styles

function App() {
  const [activeTab, setActiveTab] = useState('nudge');

  const tabs = [
    { id: 'nudge', label: 'The Nudge', icon: <Sparkles size={16} /> },
    { id: 'break', label: 'Break Loop', icon: <Focus size={16} /> },
    { id: 'check', label: 'Thought Check', icon: <BrainCircuit size={16} /> },
    { id: 'stay_in', label: 'Stay In', icon: <Home size={16} /> },
    { id: 'go_deep', label: 'Go Deep', icon: <MessagesSquare size={16} /> },
    { id: 'dry_run', label: 'Dry Run', icon: <PlaySquare size={16} /> },
    { id: 'buffer', label: 'Social Buffer', icon: <Bot size={16} /> },
  ];

  return (
    <div className="app-container">
      <header className="animate-fade-in-up" style={{ animationDelay: '0s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <img src={logo} alt="Gentle Push Logo" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
        <h1 className="header-title" style={{ margin: 0 }}>Gentle Push</h1>
        <p className="header-subtitle" style={{ margin: 0 }}>Your pocket companion for introverted moments.</p>
      </header>

      <nav className="nav-pill animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            style={{ marginBottom: '0.5rem' }}
          >
            {tab.icon}
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>
      
      <main className="main-content" style={{ width: '100%' }}>
        {activeTab === 'nudge' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <NudgeCard />
            <QuoteCard />
          </div>
        )}
        {activeTab === 'break' && <RuminationBreaker />}
        {activeTab === 'check' && <ThoughtCheck />}
        {activeTab === 'stay_in' && <SolitudeValidator />}
        {activeTab === 'go_deep' && <ConnectionStarter />}
        {activeTab === 'dry_run' && <DryRun />}
        {activeTab === 'buffer' && <SocialBuffer />}
      </main>
    </div>
  );
}

export default App;
