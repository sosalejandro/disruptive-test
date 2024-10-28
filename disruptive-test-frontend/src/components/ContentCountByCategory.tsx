import React, { useEffect, useState } from 'react';
import { webSocketService } from '../services/websocketService';
import { useCategories } from '../context/CategoryContext';

interface ContentCount {
  categoryId: string;
  count: number;
}

interface ContentCountByCategoryProps {
  topicId?: string;
}

const ContentCountByCategory: React.FC<ContentCountByCategoryProps> = ({ topicId }) => {
  const [counts, setCounts] = useState<ContentCount[]>([]);
  const { categories } = useCategories();

  useEffect(() => {
    webSocketService.connect('/contents');
    webSocketService.emit('getContentCountByCategory', { topicId });

    const subscription = webSocketService.on<ContentCount[]>('contentCountByCategory').subscribe(
      {
        next: (data) => {
          setCounts(data);
        },
        error: (error) => {
          console.error('WebSocket subscription error: ', error);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      webSocketService.disconnect();
    };
  }, [topicId]);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  return (
    <div>
      <h2>Content Count by Category</h2>
      <ul>
        {counts.map((count) => (
          <li key={count.categoryId}>
            Category: {getCategoryName(count.categoryId)}, Count: {count.count > 100 ? '100+' : count.count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContentCountByCategory;