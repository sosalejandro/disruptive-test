import React, { useState, useEffect } from 'react';
import ContentList from '../components/ContentList';
import ContentCountByCategory from '../components/ContentCountByCategory';
import { TopicsProvider, useTopics } from '../context/TopicsContext';
import { webSocketService } from '../services/websocketService';

const ContentPage: React.FC = () => {
  const [topicId, setTopicId] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [orderBy, setOrderBy] = useState<'asc' | 'desc' | undefined>(undefined);
  const [filters, setFilters] = useState<{
    topicId: string | undefined;
    name: string | undefined;
    startDate: string | undefined;
    endDate: string | undefined;
    orderBy: 'asc' | 'desc' | undefined;
  }>({
    topicId: undefined,
    name: undefined,
    startDate: undefined,
    endDate: undefined,
    orderBy: undefined,
  });

  const { topics, loading, error } = useTopics();

  const handleSearch = () => {
    setFilters({
      topicId,
      name,
      startDate,
      endDate,
      orderBy,
    });
  };

  useEffect(() => {
    return () => {
      // Disconnect WebSocket when the component is unmounted
      webSocketService.disconnect();
    };
  }, []);

  if (loading) return <p>Loading topics...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Content Page</h1>
      <div>
        <label>
          Topic:
          <select value={topicId || ''} onChange={(e) => setTopicId(e.target.value || undefined)}>
            <option value="">Select a topic</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Name:
          <input type="text" value={name || ''} onChange={(e) => setName(e.target.value || undefined)} />
        </label>
        <label>
          Start Date:
          <input type="date" value={startDate || ''} onChange={(e) => setStartDate(e.target.value || undefined)} />
        </label>
        <label>
          End Date:
          <input type="date" value={endDate || ''} onChange={(e) => setEndDate(e.target.value || undefined)} />
        </label>
        <label>
          Order By:
          <select value={orderBy || ''} onChange={(e) => setOrderBy(e.target.value as 'asc' | 'desc' | undefined)}>
            <option value="">Select</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
        <button onClick={handleSearch}>Search</button>
      </div>
      <ContentList {...filters} />
      <ContentCountByCategory topicId={filters.topicId} />
    </div>
  );
};

// const ContentPageWithProvider: React.FC = () => (
//   <TopicsProvider>
//     <ContentPage />
//   </TopicsProvider>
// );

// export default ContentPageWithProvider;

export default ContentPage;