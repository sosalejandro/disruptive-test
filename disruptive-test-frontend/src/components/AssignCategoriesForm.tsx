import React, { useState, useContext } from 'react';
import { assignCategoriesToTopic } from '../api/topics';
import { CategoryContext } from '../context/CategoryContext';
import { AssignCategoriesDto } from '../enums/domain.enums';

interface AssignCategoriesFormProps {
  topicId: string;
  onClose: () => void;
}

const AssignCategoriesForm: React.FC<AssignCategoriesFormProps> = ({ topicId, onClose }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { categories } = useContext(CategoryContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: AssignCategoriesDto = { categoryIds: selectedCategories };
    await assignCategoriesToTopic(topicId, data);
    setSelectedCategories([]);
    onClose();
  };

  const handleCheckboxChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Assign Categories:</label>
        {categories.length === 0 ? (
          <p>No categories available</p>
        ) : (
          categories.map((category) => (
            <div key={category.id}>
              <input
                type="checkbox"
                value={category.id}
                checked={selectedCategories.includes(category.id!)}
                onChange={() => handleCheckboxChange(category.id!)}
              />
              {category.name}
            </div>
          ))
        )}
      </div>
      <button type="submit">Assign Categories</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default AssignCategoriesForm;