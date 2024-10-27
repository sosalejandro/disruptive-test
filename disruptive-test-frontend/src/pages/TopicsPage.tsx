import React, { useContext } from 'react';
import TopicForm from '../components/TopicForm';
import TopicSearch from '../components/TopicSearch';
import { AuthContext } from '../context/AuthContext';
import '../styles/TopicsPage.css';

const TopicsPage: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Topics</h1>
      {user?.role === 'ADMIN' && <TopicForm />}
      <TopicSearch />
    </div>
  );
};

export default TopicsPage;