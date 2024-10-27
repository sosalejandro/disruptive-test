import React from 'react';
import '../styles/CategoryCard.css';

interface CategoryCardProps {
  imageUrl: string;
  title: string;
  type: string;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ imageUrl, title, type, onEdit, onDelete, isAdmin }) => {
  return (
    <div className="category-card">
      <img src={imageUrl} alt={title} />
      <div className="category-card-title">{title}</div>
      <p>Type: {type}</p>
      {isAdmin && (
        <div className="category-card-actions">
          <button onClick={onEdit}>Edit</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;