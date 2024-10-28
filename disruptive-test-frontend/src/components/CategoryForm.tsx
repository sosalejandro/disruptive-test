import React, { useState, useEffect } from 'react';
import { getCategoryById, updateCategory } from '../api/categories';
import { useCategories } from '../context/CategoryContext';
import { Category } from '../enums/domain.enums';

interface CategoryFormProps {
  categoryId?: string;
  onSuccess: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ categoryId, onSuccess }) => {
  const { categories, updateCategory: updateCategoryInContext } = useCategories();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const existingCategory = categories.find((cat) => cat.id === categoryId);
    if (existingCategory) {
      setCategory(existingCategory);
      setLoading(false);
    } else {
      const fetchCategory = async () => {
        try {
          const fetchedCategory = await getCategoryById(categoryId!);
          setCategory(fetchedCategory);
        } catch (err) {
          setError('Failed to fetch category');
        } finally {
          setLoading(false);
        }
      };

      fetchCategory();
    }
  }, [categoryId, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
      try {
        const updatedCategory = await updateCategory(categoryId!, category);
        updateCategoryInContext(updatedCategory);
        onSuccess();
      } catch (err) {
        setError('Failed to update category');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategory((prevCategory) => (prevCategory ? { ...prevCategory, [name]: value } : null));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={category?.name || ''}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Type:
          <input
            type="text"
            name="type"
            value={category?.type || ''}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Cover Image:
          <input
            type="text"
            name="coverImage"
            value={category?.coverImage || ''}
            onChange={handleChange}
          />
        </label>
      </div>
      <button type="submit">Save</button>
    </form>
  );
};

export default CategoryForm;