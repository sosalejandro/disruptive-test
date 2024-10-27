import React, { useState } from 'react';
import { createTopic } from '../api/topics';
import '../styles/TopicsPage.css';
import { CreateTopicDto } from '../enums/domain.enums';

const TopicForm: React.FC = () => {
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTopic: CreateTopicDto = { name };
    await createTopic(newTopic);
    setName('');
  };

  return (
    <div className="topic-form">
      <form onSubmit={handleSubmit}>
        <label>Topic Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        <button type="submit">Create Topic</button>
      </form>
    </div>
  );
};

export default TopicForm;