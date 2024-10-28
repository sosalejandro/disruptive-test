import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { webSocketService } from '../services/websocketService';
import { Content } from '../enums/domain.enums';
import { AuthContext } from '../context/AuthContext';

interface ContentListProps {
  topicId?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  orderBy?: 'asc' | 'desc';
}

const ContentList: React.FC<ContentListProps> = ({ topicId, name, startDate, endDate, orderBy }) => {
  const [contents, setContents] = useState<Content[]>([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    webSocketService.connect('/contents');
    webSocketService.emit('getContents', { topicId, name, startDate, endDate, orderBy });

    const subscription = webSocketService.on<Content[]>('contents').subscribe(
      (data) => {
        setContents(data);
      },
      (error) => {
        console.error('WebSocket subscription error: ', error);
      }
    );

    const contentCreatedSubscription = webSocketService.on<Content>('contentCreated').subscribe((newContent) => {
      setContents((prevContents) => [...prevContents, newContent]);
    });

    const contentUpdatedSubscription = webSocketService.on<Content>('contentUpdated').subscribe((updatedContent) => {
      setContents((prevContents) =>
        prevContents.map((content) => (content.id === updatedContent.id ? updatedContent : content))
      );
    });

    const contentDeletedSubscription = webSocketService.on<{ id: string }>('contentDeleted').subscribe(({ id }) => {
      setContents((prevContents) => prevContents.filter((content) => content.id !== id));
    });

    return () => {
      subscription.unsubscribe();
      contentCreatedSubscription.unsubscribe();
      contentUpdatedSubscription.unsubscribe();
      contentDeletedSubscription.unsubscribe();
      webSocketService.disconnect();
    };
  }, [topicId, name, startDate, endDate, orderBy]);

  const handleAddContent = () => {
    navigate('/contents/add');
  };

  return (
    <div>
      <h2>Contents</h2>
      {user && (user.role === 'CREATOR' || user.role === 'ADMIN') && (
        <button onClick={handleAddContent}>Add Content</button>
      )}
      <ul>
        {contents.map((content) => (
          <li key={content.id}>{content.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default ContentList;