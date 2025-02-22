import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Request } from '../../shared/types';
import './requestDetail.css';

const statusMap = {
  NEW: 'Новое',
  IN_PROGRESS: 'В работе',
  COMPLETED: 'Завершено',
  CANCELED: 'Отменено',
};

const RequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<Request | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [resolution, setResolution] = useState('');
  const [cancelNote, setCancelNote] = useState('');

  const fetchRequest = async () => {
    try {
      const res = await fetch(`http://localhost:3000/requests/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка при получении данных');
      setRequest(data);
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Ошибка при получении данных');
    }
  };

  useEffect(() => {
    if (id) {
      fetchRequest();
    }
  }, [id]);

  const handleStart = async () => {
    try {
      const res = await fetch(`http://localhost:3000/requests/${id}/start`, {
        method: 'PATCH',
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || 'Ошибка при изменении статуса обращения');
      await fetchRequest();
    } catch (err: any) {
      setError(err.message || 'Ошибка при изменении статуса обращения');
    }
  };

  const handleComplete = async () => {
    try {
      const res = await fetch(`http://localhost:3000/requests/${id}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || 'Ошибка при изменении статуса обращения');
      setResolution('');
      await fetchRequest();
    } catch (error: any) {
      setError(error.message || 'Ошибка при изменении статуса обращения');
    }
  };

  const handleCancel = async () => {
    try {
      const res = await fetch(`http://localhost:3000/requests/${id}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancelNote }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || 'Ошибка при изменении статуса обращения');
      setCancelNote('');
      await fetchRequest();
    } catch (err: any) {
      setError(err.message || 'Ошибка при изменении статуса обращения');
    }
  };

  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!request) return <div>Загрузка...</div>;

  return (
    <>
      <div className="request-detail">
        <h2>{request.topic}</h2>
        <p>{request.message}</p>
        <p className="detail-info">
          Статус: {statusMap[request.status as keyof typeof statusMap]}
        </p>
        <p className="detail-info">
          Дата обращения: {new Date(request.createdAt).toLocaleString()}
        </p>
        {request.resolution && <p>Решение проблемы: {request.resolution}</p>}
        {request.cancelNote && <p>Причина отмены: {request.cancelNote}</p>}

        <div className="status-update">
          {request.status === 'NEW' && (
            <button onClick={handleStart}>Взять в работу</button>
          )}

          {request.status === 'IN_PROGRESS' && (
            <div className="update-section">
              <div>
                <label>Решение проблемы:</label>
                <textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="Решение проблемы"
                />
                <button id="complete-button" onClick={handleComplete}>
                  Завершить
                </button>
              </div>

              <div>
                <label>Причина отмены:</label>
                <textarea
                  value={cancelNote}
                  onChange={(e) => setCancelNote(e.target.value)}
                  placeholder="Причина отмены"
                />
                <button id="cancel-button" onClick={handleCancel}>
                  Отменить
                </button>
              </div>
            </div>
          )}

          {(request.status === 'COMPLETED' ||
            request.status === 'CANCELED') && (
            <p className="inactive-message">Это обращение уже неактивно</p>
          )}
        </div>
      </div>
      <Link to="/">На главную</Link>
    </>
  );
};

export default RequestDetail;
