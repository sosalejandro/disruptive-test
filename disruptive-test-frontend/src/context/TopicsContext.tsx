import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { getTopics } from '../api/topics';
import { Topic } from '../enums/domain.enums';

interface TopicsContextProps {
  topics: Topic[];
  loading: boolean;
  error: string | null;
}

const TopicsContext = createContext<TopicsContextProps | undefined>(undefined);

export const TopicsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await getTopics();
        setTopics(response);
      } catch (err) {
        setError('Failed to fetch topics');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  return (
    <TopicsContext.Provider value={{ topics, loading, error }}>
      {children}
    </TopicsContext.Provider>
  );
};

export const useTopics = (): TopicsContextProps => {
  const context = useContext(TopicsContext);
  if (!context) {
    throw new Error('useTopics must be used within a TopicsProvider');
  }
  return context;
};