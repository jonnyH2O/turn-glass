import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sword, Flame, Footprints, Eye } from 'lucide-react';

// ADJUSTABLE CONSTANT - Change timer duration here
const TIMER_DURATION = 5; // seconds

const NimbleTurnTimer = () => {
  const [phase, setPhase] = useState('select-actions'); // 'select-actions', 'taking-turn', 'summary'
  const [actionCount, setActionCount] = useState(0);
  const [selectedActions, setSelectedActions] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const [showAssessMenu, setShowAssessMenu] = useState(false);
  const timerRef = useRef(null);

  const handleTimeout = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedActions(current => {
      if (current.length === 0) {
        // Case 1: No actions clicked - get Anticipate Danger
        return [{ type: 'assess', subType: 'anticipate', label: 'Anticipate Danger' }];
      }
      // Case 2: Some actions clicked - just lose the rest (already handled by current state)
      return current;
    });

    setPhase('summary');
  }, []);

  // Start timer when entering taking-turn phase
  useEffect(() => {
    if (phase === 'taking-turn') {
      setTimeRemaining(TIMER_DURATION);
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, handleTimeout]);

  // When all actions are selected, show summary
  useEffect(() => {
    if (selectedActions.length === actionCount && actionCount > 0 && phase === 'taking-turn') {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase('summary');
    }
  }, [selectedActions, actionCount, phase]);

  const handleActionSelect = (actionType) => {
    if (selectedActions.length < actionCount) {
      let action;
      switch(actionType) {
        case 'attack':
          action = { type: 'attack', label: 'Attack' };
          break;
        case 'spell':
          action = { type: 'spell', label: 'Spell' };
          break;
        case 'move':
          action = { type: 'move', label: 'Move' };
          break;
        case 'assess':
          setShowAssessMenu(true);
          return;
        default:
          return;
      }
      setSelectedActions([...selectedActions, action]);
    }
  };

  const handleAssessSubOption = (subType, label) => {
    if (selectedActions.length < actionCount) {
      setSelectedActions([...selectedActions, { type: 'assess', subType, label }]);
      setShowAssessMenu(false);
    }
  };

  const resetTimer = () => {
    setPhase('select-actions');
    setActionCount(0);
    setSelectedActions([]);
    setTimeRemaining(TIMER_DURATION);
    setShowAssessMenu(false);
  };

  const getActionIcon = (action) => {
    switch(action.type) {
      case 'attack': return <Sword size={32} strokeWidth={2.5} />;
      case 'spell': return <Flame size={32} strokeWidth={2.5} />;
      case 'move': return <Footprints size={32} strokeWidth={2.5} />;
      case 'assess': return <Eye size={32} strokeWidth={2.5} />;
      default: return null;
    }
  };

  // Hourglass animation
  const sandHeight = ((TIMER_DURATION - timeRemaining) / TIMER_DURATION) * 100;

  return (
    <div className="nimble-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Roboto+Condensed:wght@400;700&display=swap');

        :root {
          --page-bg: #1a1410;
          --header-bg: #2d1810;
          --header-text: #f4e8d8;
          --border-dark: #8b4513;
          --border-light: #d4a574;
          --box-bg: rgba(244, 232, 216, 0.9);
          --text-dark: #2d1810;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Roboto Condensed', sans-serif;
        }

        .nimble-container {
          min-height: 100vh;
          background: var(--page-bg);
          background-image: 
            radial-gradient(circle at 20% 80%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(212, 165, 116, 0.05) 0%, transparent 50%);
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .header {
          font-family: 'Cinzel', serif;
          font-weight: 900;
          font-size: 2rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--header-text);
          text-align: center;
          margin-bottom: 40px;
          text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.8);
        }

        .content-box {
          background: var(--box-bg);
          border: 3px solid var(--border-dark);
          box-shadow: 
            inset 0 0 0 2px var(--border-light),
            0 4px 8px rgba(0, 0, 0, 0.3);
          padding: 2rem;
          max-width: 600px;
          width: 100%;
        }

        .action-count-selector {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
        }

        .action-count-label {
          font-family: 'Cinzel', serif;
          font-weight: 700;
          font-size: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-dark);
          text-align: center;
        }

        .action-count-buttons {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .count-button {
          font-family: 'Cinzel', serif;
          font-weight: 700;
          font-size: 1.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: var(--header-bg);
          color: var(--header-text);
          border: 3px solid var(--border-dark);
          box-shadow: 
            inset 0 0 0 2px var(--border-light),
            0 4px 8px rgba(0, 0, 0, 0.3);
          padding: 1rem 2rem;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 80px;
        }

        .count-button:hover {
          transform: translateY(-2px);
          box-shadow: 
            inset 0 0 0 2px var(--border-light),
            0 6px 12px rgba(0, 0, 0, 0.4);
        }

        .count-button:active {
          transform: translateY(0);
        }

        .turn-phase {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .action-slots {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }

        .action-slot {
          width: 70px;
          height: 70px;
          border: 3px solid var(--border-dark);
          box-shadow: 
            inset 0 0 0 2px var(--border-light),
            0 2px 4px rgba(0, 0, 0, 0.2);
          background: var(--header-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--header-text);
        }

        .action-slot.filled {
          background: var(--border-light);
          color: var(--text-dark);
        }

        .timer-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          padding: 20px 0;
        }

        .hourglass {
          width: 100px;
          height: 140px;
          position: relative;
        }

        .hourglass-svg {
          width: 100%;
          height: 100%;
        }

        .timer-display {
          font-family: 'Cinzel', serif;
          font-weight: 900;
          font-size: 2.5rem;
          color: var(--text-dark);
          letter-spacing: 0.1em;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 10px;
        }

        .action-button {
          font-family: 'Roboto Condensed', sans-serif;
          background: var(--header-bg);
          color: var(--header-text);
          border: 3px solid var(--border-dark);
          box-shadow: 
            inset 0 0 0 2px var(--border-light),
            0 4px 8px rgba(0, 0, 0, 0.3);
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          min-height: 120px;
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 
            inset 0 0 0 2px var(--border-light),
            0 6px 12px rgba(0, 0, 0, 0.4);
        }

        .action-button:active {
          transform: translateY(0);
        }

        .action-button-label {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .assess-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .assess-menu {
          background: var(--box-bg);
          border: 3px solid var(--border-dark);
          box-shadow: 
            inset 0 0 0 2px var(--border-light),
            0 8px 16px rgba(0, 0, 0, 0.5);
          padding: 2rem;
          max-width: 500px;
          width: 100%;
        }

        .assess-menu-title {
          font-family: 'Cinzel', serif;
          font-weight: 700;
          font-size: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-dark);
          text-align: center;
          margin-bottom: 25px;
        }

        .assess-options {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .assess-option {
          font-family: 'Roboto Condensed', sans-serif;
          background: var(--header-bg);
          color: var(--header-text);
          border: 3px solid var(--border-dark);
          box-shadow: 
            inset 0 0 0 2px var(--border-light),
            0 4px 8px rgba(0, 0, 0, 0.3);
          padding: 15px 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          font-size: 1rem;
        }

        .assess-option:hover {
          transform: translateY(-2px);
          box-shadow: 
            inset 0 0 0 2px var(--border-light),
            0 6px 12px rgba(0, 0, 0, 0.4);
        }

        .assess-option strong {
          display: block;
          margin-bottom: 5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .summary-screen {
          display: flex;
          flex-direction: column;
          gap: 25px;
          align-items: center;
        }

        .summary-title {
          font-family: 'Cinzel', serif;
          font-weight: 700;
          font-size: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-dark);
          text-align: center;
        }

        .summary-actions {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .summary-action-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: var(--header-bg);
          border: 3px solid var(--border-dark);
          box-shadow: 
            inset 0 0 0 2px var(--border-light),
            0 2px 4px rgba(0, 0, 0, 0.2);
          color: var(--header-text);
        }

        .summary-action-number {
          font-family: 'Cinzel', serif;
          font-weight: 900;
          font-size: 1.5rem;
          min-width: 40px;
        }

        .summary-action-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .summary-action-label {
          font-family: 'Roboto Condensed', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .next-turn-button {
          font-family: 'Cinzel', serif;
          font-weight: 700;
          font-size: 1.3rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          background: var(--header-bg);
          color: var(--header-text);
          border: 3px solid var(--border-dark);
          box-shadow: 
            inset 0 0 0 2px var(--border-light),
            0 4px 8px rgba(0, 0, 0, 0.3);
          padding: 1rem 3rem;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 10px;
        }

        .next-turn-button:hover {
          transform: translateY(-2px);
          box-shadow: 
            inset 0 0 0 2px var(--border-light),
            0 6px 12px rgba(0, 0, 0, 0.4);
        }

        .next-turn-button:active {
          transform: translateY(0);
        }

        @media (max-width: 600px) {
          .header {
            font-size: 1.5rem;
            margin-bottom: 30px;
          }

          .content-box {
            padding: 1.5rem;
          }

          .action-count-buttons {
            gap: 10px;
          }

          .count-button {
            min-width: 60px;
            padding: 0.8rem 1.5rem;
            font-size: 1.5rem;
          }

          .action-slot {
            width: 60px;
            height: 60px;
          }

          .action-buttons {
            gap: 10px;
          }

          .action-button {
            min-height: 100px;
            padding: 15px;
          }

          .timer-display {
            font-size: 2rem;
          }
        }
      `}</style>

      <h1 className="header">Nimble Turn Timer</h1>

      <div className="content-box">
        {phase === 'select-actions' && (
          <div className="action-count-selector">
            <div className="action-count-label">
              How Many Actions Do You Have?
            </div>
            <div className="action-count-buttons">
              {[1, 2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  className="count-button"
                  onClick={() => {
                    setActionCount(num);
                    setPhase('taking-turn');
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'taking-turn' && (
          <div className="turn-phase">
            <div className="action-slots">
              {Array.from({ length: actionCount }).map((_, idx) => (
                <div key={idx} className={`action-slot ${selectedActions[idx] ? 'filled' : ''}`}>
                  {selectedActions[idx] && getActionIcon(selectedActions[idx])}
                </div>
              ))}
            </div>

            <div className="timer-section">
              <svg className="hourglass-svg" viewBox="0 0 100 140">
                <defs>
                  <clipPath id="topGlass">
                    <path d="M 20 10 L 80 10 L 50 70 Z" />
                  </clipPath>
                  <clipPath id="bottomGlass">
                    <path d="M 50 70 L 20 130 L 80 130 Z" />
                  </clipPath>
                </defs>
                
                {/* Frame */}
                <rect x="15" y="5" width="70" height="10" fill="#8b4513" stroke="#d4a574" strokeWidth="2"/>
                <rect x="15" y="125" width="70" height="10" fill="#8b4513" stroke="#d4a574" strokeWidth="2"/>
                
                {/* Glass outline */}
                <path d="M 20 15 L 80 15 L 50 70 L 80 125 L 20 125 L 50 70 Z" 
                      fill="none" stroke="#d4a574" strokeWidth="3"/>
                
                {/* Top sand (remaining) */}
                <rect x="20" y={70 - (55 * (timeRemaining / TIMER_DURATION))} 
                      width="60" height={55 * (timeRemaining / TIMER_DURATION)} 
                      fill="#d4a574" clipPath="url(#topGlass)"/>
                
                {/* Bottom sand (fallen) */}
                <rect x="20" y={125 - (55 * (sandHeight / 100))} width="60" height={55 * (sandHeight / 100)} 
                      fill="#d4a574" clipPath="url(#bottomGlass)"/>
                
                {/* Neck */}
                <circle cx="50" cy="70" r="2" fill="#d4a574"/>
              </svg>

              <div className="timer-display">{timeRemaining}s</div>
            </div>

            <div className="action-buttons">
              <button className="action-button" onClick={() => handleActionSelect('attack')}>
                <Sword size={48} strokeWidth={2.5} />
                <span className="action-button-label">(Attack)</span>
              </button>
              <button className="action-button" onClick={() => handleActionSelect('spell')}>
                <Flame size={48} strokeWidth={2.5} />
                <span className="action-button-label">(Spell)</span>
              </button>
              <button className="action-button" onClick={() => handleActionSelect('move')}>
                <Footprints size={48} strokeWidth={2.5} />
                <span className="action-button-label">(Move)</span>
              </button>
              <button className="action-button" onClick={() => handleActionSelect('assess')}>
                <Eye size={48} strokeWidth={2.5} />
                <span className="action-button-label">(Assess)</span>
              </button>
            </div>
          </div>
        )}

        {phase === 'summary' && (
          <div className="summary-screen">
            <div className="summary-title">Your Turn Summary</div>
            <div className="summary-actions">
              {selectedActions.map((action, idx) => (
                <div key={idx} className="summary-action-item">
                  <div className="summary-action-number">{idx + 1}.</div>
                  <div className="summary-action-icon">
                    {getActionIcon(action)}
                  </div>
                  <div className="summary-action-label">{action.label}</div>
                </div>
              ))}
            </div>
            <button className="next-turn-button" onClick={resetTimer}>
              Next Turn
            </button>
          </div>
        )}
      </div>

      {showAssessMenu && (
        <div className="assess-menu-overlay" onClick={() => setShowAssessMenu(false)}>
          <div className="assess-menu" onClick={(e) => e.stopPropagation()}>
            <div className="assess-menu-title">Choose Assessment</div>
            <div className="assess-options">
              <button 
                className="assess-option"
                onClick={() => handleAssessSubOption('question', 'Ask a Question')}
              >
                <strong>Ask a Question</strong>
                About a weakness, ability, or immediate plans of enemies, the environment, story, etc. The GM will answer honestly.
              </button>
              <button 
                className="assess-option"
                onClick={() => handleAssessSubOption('opening', 'Create an Opening')}
              >
                <strong>Create an Opening</strong>
                Increase the next Primary Die Roll against a target by 1 this round.
              </button>
              <button 
                className="assess-option"
                onClick={() => handleAssessSubOption('anticipate', 'Anticipate Danger')}
              >
                <strong>Anticipate Danger</strong>
                Reduce all Primary Dice rolled against you by 1 this round.
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NimbleTurnTimer;