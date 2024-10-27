import React, { useState, useEffect } from 'react';
import { createCategory, updateCategory, getCategoryById } from '../api/categories';
import { Category, ContentType } from '../enums/domain.enums';

interface CategoryFormProps {
  categoryId?: string;
  onSuccess: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ categoryId, onSuccess }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<ContentType>(ContentType.IMAGE);
  const [coverImage, setCoverImage] = useState('');

  useEffect(() => {
    if (categoryId) {
      getCategoryById(categoryId).then((category) => {
        setName(category.name);
        setType(category.type);
        setCoverImage(category.coverImage || '');
      });
    }
  }, [categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const category: Category = { name, type, coverImage };
    try {
      if (categoryId) {
        await updateCategory(categoryId, category);
      } else {
        await createCategory(category);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value as ContentType)}>
          {Object.values(ContentType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Cover Image URL:</label>
        <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} />
      </div>
      <button type="submit">Save</button>
    </form>
  );
};

export default CategoryForm;