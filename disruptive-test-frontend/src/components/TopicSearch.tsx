import React, { useState, useEffect } from 'react';
import { searchTopicsByName } from '../api/topics';
import TopicsList from './TopicsList';
import '../styles/TopicsPage.css';
import { Topic } from '../enums/domain.enums';
import { useTopics } from '../context/TopicsContext';

const TopicSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { topics, loading, error } = useTopics();
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredTopics(topics);
    } else {
      searchTopicsByName(searchTerm).then(setFilteredTopics);
    }
  }, [searchTerm, topics]);

  if (loading) return <p>Loading topics...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="topic-search">
      <input
        type="text"
        placeholder="Search topics..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <TopicsList topics={filteredTopics} />
    </div>
  );
};

export default TopicSearch;