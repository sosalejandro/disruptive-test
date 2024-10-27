import React, { useContext, useState } from 'react';
import AssignCategoriesForm from './AssignCategoriesForm';
import { AuthContext } from '../context/AuthContext';
import '../styles/TopicsPage.css';
import { Topic } from '../enums/domain.enums';

interface TopicsListProps {
  topics: Topic[];
}

const TopicsList: React.FC<TopicsListProps> = ({ topics }) => {
  const { user } = useContext(AuthContext);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const handleAssignCategoriesClick = (topicId: string) => {
    setSelectedTopicId(topicId);
  };

  const handleCloseForm = () => {
    setSelectedTopicId(null);
  };

  return (
    <ul>
      {topics.map((topic) => (
        <li key={topic.id} className="topic-card">
          <h3>{topic.name}</h3>
          {user?.role === 'ADMIN' && (
            <div className="assign-categories">
              <button onClick={() => handleAssignCategoriesClick(topic.id)}>Assign Categories</button>
              {selectedTopicId === topic.id && (
                <AssignCategoriesForm topicId={topic.id} onClose={handleCloseForm} />
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TopicsList;