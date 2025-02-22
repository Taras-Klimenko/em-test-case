import React, { useState } from 'react';
import './requestForm.css';

interface RequestFormProps {
  onSuccess?: (newRequest: any) => void;
}

const RequestForm: React.FC<RequestFormProps> = ({ onSuccess }) => {
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setResponseMessage(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.issues[0]?.message);
      }

      setResponseMessage(`Создано новое обращение с ID: ${data.id}`);
      setTopic('');
      setMessage('');
      if (onSuccess) {
        setTimeout(() => {
          onSuccess(data);
        }, 1000);
      }
    } catch (error: any) {
      setError(error.message || 'При выполнении запроса произошла ошибка.');
    }
  };

  return (
    <div className="request-form-container">
      <h2>Создать новое обращение</h2>
      <form className="request-form" onSubmit={handleSubmit}>
        <div>
          <label>Тема обращения: </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div>
          <label>Текст обращения: </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <button type="submit">Создать</button>
      </form>
      {responseMessage && (
        <div className="success-message">{responseMessage}</div>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default RequestForm;
