import React, { useState, useEffect } from 'react';
import { searchTopicsByName, getTopics } from '../api/topics';
import TopicsList from './TopicsList';
import '../styles/TopicsPage.css';
import { Topic } from '../enums/domain.enums';

const TopicSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    if (searchTerm === '') {
      getTopics().then(setTopics);
    } else {
      searchTopicsByName(searchTerm).then(setTopics);
    }
  }, [searchTerm]);

  return (
    <div className="topic-search">
      <input
        type="text"
        placeholder="Search topics..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <TopicsList topics={topics} />
    </div>
  );
};

export default TopicSearch;