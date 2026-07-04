import { useState } from 'react';
import {
  getFavorites, getTemplates, getRecentMeals,
  deleteFavorite, deleteTemplate,
} from '../utils/dailyLog';
import { formatTime } from '../utils/storage';

function ScoreBadge({ score }) {
  if (!score) return null;
  const { netScore, rating } = score;
  const color = rating === 'Low' ? '#00C9A7' : rating === 'Moderate' ? '#F5A623' : '#E84545';
  const bg = rating === 'Low' ? '#0a2a25' : rating === 'Moderate' ? '#2a2010' : '#2a1010';
  return (
    <span style={{
      fontSize: 11, padding: '2px 8px', borderRadius: 4,
      background: bg, color, fontWeight: 600,
    }}>
      {netScore.toFixed(1)}
    </span>
  );
}

function MealRow({ meal, onLog, onDelete, showTime }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 0', borderBottom: '1px solid #1e2d3d',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#F0EDE6', marginBottom: 2 }}>
          {meal.name}
        </div>
        <div style={{ fontSize: 11, color: '#5a7a96', display: 'flex', gap: 8 }}>
          {showTime && meal.timestamp && (
            <span>{formatTime(meal.timestamp)}</span>
          )}
          {meal.score && (
            <>
              <span>P {meal.score.totalProtein?.toFixed(0)}g</span>
              <span>C {meal.score.totalCarbs?.toFixed(0)}g</span>
            </>
          )}
        </div>
      </div>
      <ScoreBadge score={meal.score} />
      <button
        onClick={() => onLog(meal)}
        style={{
          background: '#00C9A7', border: 'none', borderRadius: 4,
          color: '#0F1923', fontSize: 11, fontWeight: 600,
          padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit',
          flexShrink: 0,
        }}
      >
        Log
      </button>
      {onDelete && (
        confirming ? (
          <button
            onClick={() => { onDelete(meal.id); setConfirming(false); }}
            style={{
              background: '#2a1010', border: 'none', borderRadius: 4,
              color: '#E84545', fontSize: 11, padding: '5px 8px',
              cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
            }}
          >
            ✕
          </button>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            style={{
              background: 'none', border: 'none', color: '#3a5a76',
              fontSize: 16, cursor: 'pointer', flexShrink: 0,
              lineHeight: 1, padding: '0 2px',
            }}
          >
            ×
          </button>
        )
      )}
    </div>
  );
}

export default function QuickLog({ onLogMeal, onRefresh }) {
  const [tab, setTab] = useState('favorites');
  const [favorites, setFavorites] = useState(getFavorites);
  const [templates, setTemplates] = useState(getTemplates);
  const [recent, setRecent] = useState(() => getRecentMeals(7));

  const refresh = () => {
    setFavorites(getFavorites());
    setTemplates(getTemplates());
    setRecent(getRecentMeals(7));
    onRefresh?.();
  };

  const handleLog = (meal) => {
    onLogMeal({
      name: meal.name,
      items: meal.items,
      flag: null,
      timestamp: new Date().toISOString(),
    });
    refresh();
  };

  const handleDeleteFav = (id) => {
    deleteFavorite(id);
    setFavorites(getFavorites());
  };

  const handleDeleteTemplate = (id) => {
    deleteTemplate(id);
    setTemplates(getTemplates());
  };

  const tabs = [
    { id: 'favorites',  label: `⭐ Favorites (${favorites.length})` },
    { id: 'templates',  label: `📋 Templates (${templates.length})` },
    { id: 'recent',     label: `🕐 Recent` },
  ];

  return (
    <div className="card">
      <div className="label-sm" style={{ marginBottom: 12 }}>Quick log</div>

      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1e2d3d', marginBottom: 12 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, background: 'none', border: 'none',
              borderBottom: tab === t.id ? '2px solid #00C9A7' : '2px solid transparent',
              color: tab === t.id ? '#F0EDE6' : '#5a7a96',
              padding: '6px 4px', fontSize: 11, cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: tab === t.id ? 600 : 400,
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxHeight: 280, overflowY: 'auto' }}>
        {tab === 'favorites' && (
          favorites.length === 0 ? (
            <div style={{ fontSize: 12, color: '#5a7a96', padding: '12px 0', textAlign: 'center', lineHeight: 1.6 }}>
              No favorites yet.<br />
              Score a meal and tap ⭐ Save as favorite.
            </div>
          ) : (
            favorites.map(meal => (
              <MealRow
                key={meal.id}
                meal={meal}
                onLog={handleLog}
                onDelete={handleDeleteFav}
              />
            ))
          )
        )}

        {tab === 'templates' && (
          templates.length === 0 ? (
            <div style={{ fontSize: 12, color: '#5a7a96', padding: '12px 0', textAlign: 'center', lineHeight: 1.6 }}>
              No templates yet.<br />
              Build a meal and tap 📋 Save as template.
            </div>
          ) : (
            templates.map(meal => (
              <MealRow
                key={meal.id}
                meal={meal}
                onLog={handleLog}
                onDelete={handleDeleteTemplate}
              />
            ))
          )
        )}

        {tab === 'recent' && (
          recent.length === 0 ? (
            <div style={{ fontSize: 12, color: '#5a7a96', padding: '12px 0', textAlign: 'center' }}>
              No meals logged in the last 7 days.
            </div>
          ) : (
            recent.map(meal => (
              <MealRow
                key={meal.id}
                meal={meal}
                onLog={handleLog}
                showTime
              />
            ))
          )
        )}
      </div>
    </div>
  );
}
