import React from 'react';
import { Link } from 'react-router-dom';
import './requestItem.css'; // For styling

interface RequestItemProps {
  id: string;
  topic: string;
  message: string;
  status: string;
  createdAt: string;
}

const statusMap = {
  NEW: 'Новое',
  IN_PROGRESS: 'В работе',
  COMPLETED: 'Завершено',
  CANCELED: 'Отменено',
};

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

const RequestItem: React.FC<RequestItemProps> = ({
  id,
  topic,
  message,
  status,
  createdAt,
}) => {
  return (
    <div className="request-card">
      <div className="request-header">
        <span>{topic}</span>
        <span className={`status ${status.toLowerCase()}`}>
          {statusMap[status as keyof typeof statusMap]}
        </span>
      </div>
      <div className="request-body">
        <p>{truncateText(message, 30)}</p>
      </div>
      <div className="request-footer">
        <span>Создано: {new Date(createdAt).toLocaleString()}</span>
        <Link to={`/request/${id}`} className="details-link">
          Подробнее
        </Link>
      </div>
    </div>
  );
};

export default RequestItem;
