import React, { useState, useEffect } from 'react';
import { Request } from '../../shared/types';
import RequestList from '../../components/request-list/RequestList';
import RequestForm from '../../components/request-form/RequestForm';
import CancelAll from '../../components/cancel-all/CancelAll';
import './homepage.css';

const HomePage: React.FC = () => {
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showCancelAllModal, setShowCancelAllModal] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [exactDate, setExactDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');

  const fetchRequests = async (queryParams: string = '') => {
    try {
      const res = await fetch(`http://localhost:3000/requests${queryParams}`);
      const data = await res.json();
      setRequests(
        data.sort(
          (req1: Request, req2: Request) =>
            new Date(req1.createdAt).getTime() -
            new Date(req2.createdAt).getTime()
        )
      );
    } catch (err) {
      setError('Ошибка получения данных');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleNewRequestSuccess = (newRequest: Request) => {
    setRequests((prev) => [...prev, newRequest]);
    setShowNewRequestModal(false);
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (exactDate) {
      params.append('date', exactDate);
    }
    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }
    if (status) {
      params.append('status', status);
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    fetchRequests(queryString);
  };

  const resetFilters = () => {
    setExactDate('');
    setStartDate('');
    setEndDate('');
    setStatus('');
    fetchRequests();
  };

  return (
    <div>
      <h2>Все обращения</h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={() => setShowNewRequestModal(true)}>
          Создать обращение
        </button>
        <button onClick={() => setShowCancelAllModal(true)}>
          Отменить все "В работе"
        </button>
      </div>
      <div className="homepage-content-wrapper">
        <div className="homepage-filter-wrapper">
          <h3>Фильтры</h3>
          <div style={{ marginBottom: '8px' }}>
            <label>День: &nbsp;</label>
            <input
              type="date"
              value={exactDate}
              onChange={(e) => setExactDate(e.target.value)}
            />
          </div>
          <small style={{ padding: '10px 0', display: 'inline-block' }}>
            или в диапазоне
          </small>
          <div style={{ marginBottom: '8px' }}>
            <label>Начало: &nbsp;</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label>Конец: &nbsp;</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label>Статус: &nbsp;</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Все</option>
              <option value="NEW">Новое</option>
              <option value="IN_PROGRESS">В работе</option>
              <option value="COMPLETED">Завершено</option>
              <option value="CANCELED">Отменено</option>
            </select>
          </div>
          <button
            className="filter-button"
            onClick={applyFilters}
            style={{ marginRight: '8px' }}
          >
            Найти
          </button>
          <button className="filter-button" onClick={resetFilters}>
            Сбросить
          </button>
        </div>

        {error && <div style={{ color: 'red' }}>{error}</div>}
        <RequestList requests={requests} />
      </div>
      {showNewRequestModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowNewRequestModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-button"
              onClick={() => setShowNewRequestModal(false)}
            >
              X
            </button>
            <RequestForm onSuccess={handleNewRequestSuccess} />
          </div>
        </div>
      )}
      {showCancelAllModal && (
        <div
          className="modal-overlay"
          onClick={() => {
            fetchRequests();
            setShowCancelAllModal(false);
          }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-button"
              onClick={() => {
                fetchRequests();
                setShowCancelAllModal(false);
              }}
            >
              X
            </button>
            <CancelAll />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
