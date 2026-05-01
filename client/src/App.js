import React, { useEffect, useState } from 'react';
import './App.css';
import { useAppState } from './state';
import { getGameById } from './data/games';
import Dashboard from './components/Dashboard';
import Schedule from './components/Schedule';
import GameDetail from './components/GameDetail';
import People from './components/People';
import Nonprofits from './components/Nonprofits';
import NonprofitDetail from './components/NonprofitDetail';
import AllReceiptsModal from './components/AllReceiptsModal';
import Messages from './components/Messages';

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'schedule',  label: 'Schedule' },
  { id: 'messages',  label: 'Impact' },
  { id: 'people',    label: 'People' },
  { id: 'nonprofits',label: 'Nonprofits' },
];

export default function App() {
  const state = useAppState();
  const [tab, setTab] = useState('dashboard');
  const [openGameId, setOpenGameId] = useState(null);
  const [openNpId, setOpenNpId] = useState(null);
  const [printingNp, setPrintingNp] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu on Escape key.
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [menuOpen]);

  function pickTab(id) {
    setTab(id);
    setOpenGameId(null);
    setOpenNpId(null);
    setMenuOpen(false);
  }

  const openGame = (id) => { setOpenGameId(id); };
  const closeGame = () => setOpenGameId(null);

  const game = openGameId ? getGameById(openGameId) : null;
  const openNp = openNpId ? state.nonprofits.find(n => n.id === openNpId) : null;

  // Pending message badge for the Impact tab.
  const pendingCount = state.messages.filter(m => m.status === 'pending').length;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="dot">★</span>
          <span className="brand-text">
            <span className="brand-name">ShareMySeats</span>
            <span className="brand-tag">Never let a season ticket go to waste.</span>
          </span>
        </div>
        <nav className="tabs desktop-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`tab ${tab === t.id && !openGameId && !openNpId ? 'active' : ''}`}
              onClick={() => pickTab(t.id)}
            >
              {t.label}
              {t.id === 'messages' && pendingCount > 0 && (
                <span className="tab-badge">{pendingCount}</span>
              )}
            </button>
          ))}
        </nav>
        <button
          className={`hamburger ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu-panel"
        >
          <span /><span /><span />
        </button>
      </header>

      {menuOpen && (
        <div className="mobile-menu-backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}
      <nav
        id="mobile-menu-panel"
        className={`mobile-menu ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-menu-eyebrow">Navigate</div>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`mobile-menu-item ${tab === t.id && !openGameId && !openNpId ? 'active' : ''}`}
            onClick={() => pickTab(t.id)}
            tabIndex={menuOpen ? 0 : -1}
          >
            <span>{t.label}</span>
            {t.id === 'messages' && pendingCount > 0 && (
              <span className="mobile-menu-badge">{pendingCount}</span>
            )}
          </button>
        ))}
        <div className="mobile-menu-foot">
          Pat Cowan · Diamond Club STH
        </div>
      </nav>

      <main className="main">
        {game ? (
          <GameDetail
            game={game}
            seats={state.seats}
            assignments={state.assignments}
            people={state.people}
            nonprofits={state.nonprofits}
            onAssign={state.assignSeat}
            onRecordDonation={state.recordDonation}
            onBack={closeGame}
          />
        ) : tab === 'dashboard' ? (
          <Dashboard
            games={state.games}
            seats={state.seats}
            assignments={state.assignments}
            messages={state.messages}
            people={state.people}
            nonprofits={state.nonprofits}
            onOpenGame={openGame}
            onGoSchedule={() => setTab('schedule')}
            onResetDemo={() => { if (window.confirm('Reset all demo data? Past games will be re-seeded with fresh assignments.')) state.reset(); }}
            onAssign={state.assignSeat}
            onRecordDonation={state.recordDonation}
          />
        ) : tab === 'schedule' ? (
          <Schedule
            games={state.games}
            seats={state.seats}
            assignments={state.assignments}
            onOpenGame={openGame}
          />
        ) : tab === 'messages' ? (
          <Messages
            messages={state.messages}
            nonprofits={state.nonprofits}
            onSimulateUpload={state.simulateUpload}
          />
        ) : tab === 'people' ? (
          <People
            people={state.people}
            assignments={state.assignments}
            onAdd={state.addPerson}
            onRemove={state.removePerson}
          />
        ) : openNp ? (
          <NonprofitDetail
            nonprofit={openNp}
            assignments={state.assignments}
            messages={state.messages}
            onBack={() => setOpenNpId(null)}
            onPrintAll={(np) => setPrintingNp(np)}
          />
        ) : (
          <Nonprofits
            nonprofits={state.nonprofits}
            assignments={state.assignments}
            onOpenNonprofit={(id) => setOpenNpId(id)}
          />
        )}
      </main>

      {printingNp && (
        <AllReceiptsModal
          nonprofits={state.nonprofits}
          assignments={state.assignments}
          scopeNonprofit={printingNp}
          onClose={() => setPrintingNp(null)}
        />
      )}
    </div>
  );
}
