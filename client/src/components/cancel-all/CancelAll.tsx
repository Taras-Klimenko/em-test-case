import React, { useState } from 'react';
import './cancelAll.css';

const CancelAll: React.FC = () => {
  const [cancelNote, setCancelNote] = useState('');
  const [resultMsg, setResultMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCancelAll = async () => {
    setError(null);
    setResultMsg(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/requests/cancel-all-in-progress`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cancelNote }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResultMsg(data.message);
      setCancelNote('');
    } catch (err: any) {
      setError(
        err.message || 'Ошибка при отмене всех обращений со статусом "В РАБОТЕ"'
      );
    }
  };

  return (
    <div className="cancel-all-container">
      <h2>Отменить все обращения в работе</h2>
      <input
        type="text"
        placeholder="Причина отмены"
        value={cancelNote}
        onChange={(e) => setCancelNote(e.target.value)}
      />
      <button onClick={handleCancelAll}>Отменить все</button>
      {resultMsg && <div className="result-message">{resultMsg}</div>}
      {error && <div className="error-message">Error: {error}</div>}
    </div>
  );
};

export default CancelAll;
