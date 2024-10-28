import React, { useState, useContext } from 'react';
import { createContent } from '../api/content';
import { useTopics } from '../context/TopicsContext';
import { useCategories } from '../context/CategoryContext';
import { AuthContext } from '../context/AuthContext';

interface ContentFormProps {
  onSuccess: () => void;
}

const ContentForm: React.FC<ContentFormProps> = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [topicId, setTopicId] = useState('');

  const { categories } = useCategories();
  const { topics } = useTopics();
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCategory = categories.find(category => category.id === categoryId);
    const type = selectedCategory ? selectedCategory.type : '';
    const credits = user ? user.username : '';

    const newContent = { title, description, categoryId, topicId, type, credits };
    try {
      await createContent(newContent);
      onSuccess();
    } catch (error) {
      console.error('Failed to create content:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Category:</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="" disabled>Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Topic:</label>
        <select
          value={topicId}
          onChange={(e) => setTopicId(e.target.value)}
          required
        >
          <option value="" disabled>Select a topic</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Add Content</button>
    </form>
  );
};

export default ContentForm;