import React from 'react';
import RequestItem from '../request-item/RequestItem';
import { Request } from '../../shared/types';
import './RequestList.css';

interface RequestListProps {
  requests: Request[];
}

const RequestList: React.FC<RequestListProps> = ({ requests }) => {
  return (
    <div style={{ width: '90vw' }}>
      <div className="requests-container">
        {requests.length ? (
          requests.map((req) => (
            <RequestItem
              key={req.id}
              id={req.id}
              topic={req.topic}
              message={req.message}
              status={req.status}
              createdAt={req.createdAt}
            />
          ))
        ) : (
          <h3>Обращений не найдено</h3>
        )}
      </div>
    </div>
  );
};

export default RequestList;
